from datetime import datetime, timezone
from typing import Any

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from models.employee import Employee
from models.employee_skill import EmployeeSkill
from models.skill import Skill
from models.system_role import SystemRole
from exceptions import NotFoundException
from models.project_employee import ProjectEmployee


class EmployeeRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    def _get_active_projects_subquery(self):
        """Helper to build a scalar subquery counting active allocations."""
        return (
            select(func.count(ProjectEmployee.id))
            .where(
                ProjectEmployee.employee_id == Employee.id,
                ProjectEmployee.date_exited.is_(
                    None
                ),  # Only entries where date_exited is None
                ProjectEmployee.deleted_at.is_(None),  # Soft-delete check
            )
            .correlate(Employee)
            .scalar_subquery()
        )

    async def get_by_id_with_role(
        self, employee_id: int
    ) -> tuple[Employee, str, int] | None:
        stmt = (
            select(
                Employee,
                SystemRole.name,
                self._get_active_projects_subquery().label("projects_count"),
            )
            .join(SystemRole, Employee.system_role_id == SystemRole.id)
            .where(Employee.id == employee_id, Employee.deleted_at.is_(None))
        )
        result = await self.db.execute(stmt)
        return result.first()

    async def get_by_email_with_role(
        self, email: str
    ) -> tuple[Employee, str, int] | None:
        stmt = (
            select(
                Employee,
                SystemRole.name,
                self._get_active_projects_subquery().label("projects_count"),
            )
            .join(SystemRole, Employee.system_role_id == SystemRole.id)
            .where(Employee.email == email)
        )
        result = await self.db.execute(stmt)
        return result.first()

    async def list_all_with_role(
        self, 
        limit: int | None = None, 
        offset: int | None = None,
        identifier_filter: tuple[str, Any] | None = None,
        system_role_id: int | None = None,
        skill_ids: list[int] | None = None,
        current_user_id: int | None = None,
        is_hr: bool = False
    ) -> tuple[list[tuple[Employee, str, int]], int]:
        from models.employee_skill import EmployeeSkill
        from models.project_employee import ProjectEmployee
        
        # Base statement selecting employee profile details alongside role and active project counts
        stmt = (
            select(
                Employee,
                SystemRole.name,
                self._get_active_projects_subquery().label("projects_count"),
            )
            .join(SystemRole, Employee.system_role_id == SystemRole.id)
            .where(Employee.deleted_at.is_(None))
        )
        
        # --- ROLE-BASED SCOPING PRIVILEGES ---
        # If the user is HR, we skip this block completely, granting them access to EVERYONE.
        if not is_hr and current_user_id is not None:
            # 1. Gather all active project IDs the current user is part of
            active_projects_stmt = (
                select(ProjectEmployee.project_id)
                .where(
                    ProjectEmployee.employee_id == current_user_id,
                    ProjectEmployee.date_exited.is_(None),
                    ProjectEmployee.deleted_at.is_(None)
                )
            )
            
            # 2. Find all employees who are actively assigned to those same projects
            peer_employees_stmt = (
                select(ProjectEmployee.employee_id)
                .where(
                    ProjectEmployee.project_id.in_(active_projects_stmt),
                    ProjectEmployee.date_exited.is_(None),
                    ProjectEmployee.deleted_at.is_(None)
                )
            )
            
            # 3. Filter employees to include peers or the user themselves
            stmt = stmt.where(
                or_(
                    Employee.id == current_user_id,
                    Employee.id.in_(peer_employees_stmt)
                )
            )

        # Apply incoming query parameters filters if provided
        if system_role_id is not None:
            stmt = stmt.where(Employee.system_role_id == system_role_id)
            
        if identifier_filter is not None:
            id_type, val = identifier_filter
            if id_type == "id":
                stmt = stmt.where(Employee.id == val)
            elif id_type == "email":
                stmt = stmt.where(Employee.email == val)
            elif id_type == "name":
                stmt = stmt.where(Employee.name.ilike(f"%{val}%"))
               
        if skill_ids:
            stmt = stmt.join(EmployeeSkill, Employee.id == EmployeeSkill.employee_id).where(
                EmployeeSkill.skill_id.in_(skill_ids),
                EmployeeSkill.deleted_at.is_(None)
            )
            stmt = stmt.group_by(Employee.id, SystemRole.name).having(
                func.count(EmployeeSkill.skill_id) == len(skill_ids)
            )
        
        # Calculate total matching dataset count safely before pagination window cuts
        count_stmt = select(func.count()).select_from(stmt.subquery())
        count_result = await self.db.execute(count_stmt)
        total_count = count_result.scalar() or 0
        
        if limit is not None:
            stmt = stmt.limit(limit)
        if offset is not None:
            stmt = stmt.offset(offset)
            
        result = await self.db.execute(stmt)
        return list(result.all()), total_count
    

    async def get_by_id(self, employee_id: int) -> Employee | None:
        stmt = select(Employee).where(
            Employee.id == employee_id, Employee.deleted_at.is_(None)
        )
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_email(self, email: str) -> Employee | None:
        stmt = select(Employee).where(Employee.email == email)
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def create(self, employee_data: dict[str, Any]) -> Employee:
        employee = Employee(**employee_data)
        self.db.add(employee)
        await self.db.flush()
        return employee

    async def update(self, employee: Employee, update_data: dict[str, Any]) -> Employee:
        if employee.deleted_at is not None:
            raise ValueError("Cannot update a soft-deleted employee")

        for field, value in update_data.items():
            setattr(employee, field, value)
        await self.db.flush()
        return employee

    async def soft_delete(self, employee: Employee) -> None:
        employee.deleted_at = datetime.now(timezone.utc)
        await self.db.flush()

    async def get_employee_skills(
        self, employee_id: int
    ) -> list[tuple[EmployeeSkill, Skill]]:
        stmt = (
            select(EmployeeSkill, Skill)
            .join(Skill, EmployeeSkill.skill_id == Skill.id)
            .where(
                EmployeeSkill.employee_id == employee_id,
                EmployeeSkill.deleted_at.is_(None),
                Skill.deleted_at.is_(None),
            )
        )
        result = await self.db.execute(stmt)
        return list(result.all())

    async def get_employee_skill(
        self, employee_id: int, skill_id: int
    ) -> EmployeeSkill | None:
        stmt = select(EmployeeSkill).where(
            EmployeeSkill.employee_id == employee_id,
            EmployeeSkill.deleted_at.is_(None),
            EmployeeSkill.skill_id == skill_id,
        )
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def add_employee_skills(
        self, employee_skills: list[EmployeeSkill]
    ) -> list[EmployeeSkill]:
        self.db.add_all(employee_skills)
        await self.db.flush()
        return employee_skills

    async def update_employee_skill(
        self, employee_skill: EmployeeSkill
    ) -> EmployeeSkill:
        await self.db.flush()
        return employee_skill

    async def remove_employee_skill(self, employee_skill: EmployeeSkill) -> None:
        if employee_skill.deleted_at is not None:
            raise NotFoundException("Cannot remove a soft-deleted employee skill")
        employee_skill.deleted_at = datetime.now(timezone.utc)
        await self.db.flush()

    #############################################################################
    #############################AGENT###########################################
    #############################################################################

    async def list_all_by_skill(
        self,
        skill: str | None = None,
    ) -> tuple[list[tuple[Employee, str, int]], int]:
        base_filters = [Employee.deleted_at.is_(None)]

        if skill is not None:
            skill_subq = (
                select(EmployeeSkill.employee_id)
                .join(Skill, EmployeeSkill.skill_id == Skill.id)
                .where(func.lower(Skill.name) == skill.lower())
            )
            base_filters.append(Employee.id.in_(skill_subq))

        count_stmt = select(func.count(Employee.id)).where(*base_filters)
        count_result = await self.db.execute(count_stmt)
        total_count = count_result.scalar() or 0

        stmt = (
            select(
                Employee,
                SystemRole.name,
                self._get_active_projects_subquery().label("projects_count"),
            )
            .join(SystemRole, Employee.system_role_id == SystemRole.id)
            .where(*base_filters)
        )

        result = await self.db.execute(stmt)
        return list(result.all()), total_count
