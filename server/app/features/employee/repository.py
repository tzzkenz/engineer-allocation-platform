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
                ProjectEmployee.date_exited.is_(None),  # Only entries where date_exited is None
                ProjectEmployee.deleted_at.is_(None)   # Soft-delete check
            )
            .correlate(Employee)
            .scalar_subquery()
        )

    async def get_by_id_with_role(self, employee_id: int) -> tuple[Employee, str, int] | None:
        stmt = (
            select(
                Employee, 
                SystemRole.name, 
                self._get_active_projects_subquery().label("projects_count")
            )
            .join(SystemRole, Employee.system_role_id == SystemRole.id)
            .where(Employee.id == employee_id, Employee.deleted_at.is_(None))
        )
        result = await self.db.execute(stmt)
        return result.first()

    async def get_by_email_with_role(self, email: str) -> tuple[Employee, str, int] | None:
        stmt = (
            select(
                Employee, 
                SystemRole.name, 
                self._get_active_projects_subquery().label("projects_count")
            )
            .join(SystemRole, Employee.system_role_id == SystemRole.id)
            .where(Employee.email == email)
        )
        result = await self.db.execute(stmt)
        return result.first()

    async def list_all_with_role(self, limit: int | None = None, offset: int | None = None) -> list[tuple[Employee, str, int]]:
        stmt = (
            select(
                Employee, 
                SystemRole.name, 
                self._get_active_projects_subquery().label("projects_count")
            )
            .join(SystemRole, Employee.system_role_id == SystemRole.id)
            .where(Employee.deleted_at.is_(None))
        )
        
        if limit is not None:
            stmt = stmt.limit(limit)
        if offset is not None:
            stmt = stmt.offset(offset)
            
        result = await self.db.execute(stmt)
        return list(result.all())

    async def get_by_id(self, employee_id: int) -> Employee | None:
        stmt = select(Employee).where(Employee.id == employee_id, Employee.deleted_at.is_(None))
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

    async def get_employee_skills(self, employee_id: int) -> list[tuple[EmployeeSkill, Skill]]:
        stmt = (
            select(EmployeeSkill, Skill)
            .join(Skill, EmployeeSkill.skill_id == Skill.id)
            .where(
                EmployeeSkill.employee_id == employee_id,
                EmployeeSkill.deleted_at.is_(None),
                Skill.deleted_at.is_(None)
            )
        )
        result = await self.db.execute(stmt)
        return list(result.all())
    
    async def get_employee_skill(self, employee_id: int, skill_id: int) -> EmployeeSkill | None:
        stmt = select(EmployeeSkill).where(
            EmployeeSkill.employee_id == employee_id,
            EmployeeSkill.deleted_at.is_(None),
            EmployeeSkill.skill_id == skill_id
        )
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def add_employee_skills(self, employee_skills: list[EmployeeSkill]) -> list[EmployeeSkill]:
        self.db.add_all(employee_skills)
        await self.db.flush()
        return employee_skills

    async def update_employee_skill(self, employee_skill: EmployeeSkill) -> EmployeeSkill:
        await self.db.flush()
        return employee_skill

    async def remove_employee_skill(self, employee_skill: EmployeeSkill) -> None:
        if employee_skill.deleted_at is not None:
            raise NotFoundException("Cannot remove a soft-deleted employee skill")
        employee_skill.deleted_at = datetime.now(timezone.utc)
        await self.db.flush()