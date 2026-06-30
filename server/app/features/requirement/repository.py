from datetime import datetime, timezone
from typing import Any
from sqlalchemy import asc, desc, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload, joinedload  # Added joinedload

from models.project_requirement_request import (
    ProjectRequirementRequest,
    RequestStatus,
)
from models.project_stack_requirement_request import ProjectStackRequirementRequest
from models.skill import Skill
from models.project_employee import ProjectEmployee
from models.employee import Employee
from models.employee_skill import EmployeeSkill


class RequirementRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_project_id(
        self, project_id: int
    ) -> list[ProjectRequirementRequest]:
        stmt = (
            select(ProjectRequirementRequest)
            .where(
                ProjectRequirementRequest.project_id == project_id,
                ProjectRequirementRequest.deleted_at.is_(None),
            )
            .options(
                joinedload(ProjectRequirementRequest.project_role),
                joinedload(ProjectRequirementRequest.requested_by_employee),  # ✅ Added
                selectinload(ProjectRequirementRequest.stack_requests).joinedload(ProjectStackRequirementRequest.stack)
            )
        )
        result = await self.db.execute(stmt)
        return result.scalars().all()

    async def get_by_id(self, request_id: int) -> ProjectRequirementRequest | None:
        stmt = (
            select(ProjectRequirementRequest)
            .where(
                ProjectRequirementRequest.id == request_id,
                ProjectRequirementRequest.deleted_at.is_(None),
            )
            .options(
                joinedload(ProjectRequirementRequest.project_role),
                joinedload(ProjectRequirementRequest.requested_by_employee), 
                selectinload(ProjectRequirementRequest.stack_requests).joinedload(ProjectStackRequirementRequest.stack)
            )
        )
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def list_all(self) -> list[ProjectRequirementRequest]:
        stmt = (
            select(ProjectRequirementRequest)
            .where(ProjectRequirementRequest.deleted_at.is_(None))
            .options(
                joinedload(ProjectRequirementRequest.project_role),
                joinedload(ProjectRequirementRequest.requested_by_employee), 
                selectinload(ProjectRequirementRequest.stack_requests).joinedload(ProjectStackRequirementRequest.stack)
            )
        )
        result = await self.db.execute(stmt)
        return result.scalars().all()

    

    async def create(
        self,
        project_id: int,
        project_role_id: int,
        requested_count: int,
        requested_by: int,
        status: RequestStatus = RequestStatus.PENDING,
    ) -> ProjectRequirementRequest:
        request = ProjectRequirementRequest(
            project_id=project_id,
            project_role_id=project_role_id,
            requested_count=requested_count,
            requested_by=requested_by,
            status=status,
        )
        self.db.add(request)
        await self.db.flush()
        return request

    async def update(
        self,
        request: ProjectRequirementRequest,
        requested_count: int | None = None,
        status: RequestStatus | None = None,
        resolved_by: int | None = None,
        resolved_at: datetime | None = None,
    ) -> ProjectRequirementRequest:
        if requested_count is not None:
            request.requested_count = requested_count

        if status is not None:
            request.status = status

        if resolved_by is not None:
            request.resolved_by = resolved_by

        if resolved_at is not None:
            request.resolved_at = resolved_at

        await self.db.flush()
        return request

    async def soft_delete(self, request: ProjectRequirementRequest) -> None:
        request.deleted_at = datetime.now(timezone.utc)
        await self.db.flush()

    async def get_stack_by_id(self, stack_id: int) -> Skill | None:
        stmt = select(Skill).where(
            Skill.id == stack_id,
            Skill.deleted_at.is_(None),
        )
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def add_stack_to_request(self, request_id, stack_id):
        stack_request = ProjectStackRequirementRequest(
            stack_id=stack_id, project_requirement_request_id=request_id
        )
        self.db.add(stack_request)
        await self.db.flush()
        return stack_request

    async def list_stacks_by_request(
        self, request_id: int
    ) -> list[ProjectStackRequirementRequest]:
        stmt = (
            select(ProjectStackRequirementRequest)
            .where(ProjectStackRequirementRequest.project_requirement_request_id == request_id)
            .options(joinedload(ProjectStackRequirementRequest.stack)) # Load skills details
        )
        result = await self.db.execute(stmt)
        return result.scalars().all()

    async def get_stack_request_by_id(
        self, stack_request_id: int
    ) -> ProjectStackRequirementRequest | None:
        stmt = (
            select(ProjectStackRequirementRequest)
            .where(ProjectStackRequirementRequest.id == stack_request_id)
            .options(joinedload(ProjectStackRequirementRequest.stack))
        )
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def delete_stack_request(
        self, stack_request: ProjectStackRequirementRequest
    ) -> None:
        await self.db.delete(stack_request)
        await self.db.flush()

    async def get_matched_employees_for_request(self, request_id: int) -> list[tuple[Employee, int]]:
        skills_stmt = select(ProjectStackRequirementRequest.stack_id).where(
            ProjectStackRequirementRequest.project_requirement_request_id == request_id
        )
        skills_result = await self.db.execute(skills_stmt)
        required_skill_ids = list(skills_result.scalars().all())

        if not required_skill_ids:
            return []

        active_allocations_subquery = (
            select(
                ProjectEmployee.employee_id,
                func.count(ProjectEmployee.id).label("project_count")
            )
            .where(
                ProjectEmployee.date_exited.is_(None),
                ProjectEmployee.deleted_at.is_(None)
            )
            .group_by(ProjectEmployee.employee_id)
            .subquery()
        )

        stmt = (
            select(
                Employee,
                func.coalesce(active_allocations_subquery.c.project_count, 0).label("active_projects")
            )
            .join(EmployeeSkill, Employee.id == EmployeeSkill.employee_id)
            .outerjoin(active_allocations_subquery, Employee.id == active_allocations_subquery.c.employee_id)
            .where(
                Employee.deleted_at.is_(None),
                EmployeeSkill.deleted_at.is_(None),
                EmployeeSkill.skill_id.in_(required_skill_ids)
            )
            .group_by(
                Employee.id, 
                active_allocations_subquery.c.project_count
            )
            .having(func.count(EmployeeSkill.skill_id) == len(required_skill_ids))
            .where(func.coalesce(active_allocations_subquery.c.project_count, 0) < 2)
        )

        result = await self.db.execute(stmt)
        return list(result.all())

    async def get_with_stacks(self, request_id: int):
        stmt = (
            select(ProjectRequirementRequest)
            .where(ProjectRequirementRequest.id == request_id)
            .options(
                joinedload(ProjectRequirementRequest.project_role),
                joinedload(ProjectRequirementRequest.requested_by_employee),  
                selectinload(ProjectRequirementRequest.stack_requests).joinedload(ProjectStackRequirementRequest.stack)
            )
        )
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()
    

    async def search_matching_employees(
        self,
        skill_ids: list[int],
        availability: str,
        sort_by_exp_desc: bool,
        sort_by_prof_desc: bool,
        identifier_filter: tuple[str, Any] | None = None,
        limit: int | None = None,
        offset: int | None = None
    ) -> list[tuple[Employee, int, float]]:
        
        active_allocations_subquery = (
            select(
                ProjectEmployee.employee_id,
                func.count(ProjectEmployee.id).label("project_count")
            )
            .where(
                ProjectEmployee.date_exited.is_(None),
                ProjectEmployee.deleted_at.is_(None)
            )
            .group_by(ProjectEmployee.employee_id)
            .subquery()
        )

        stmt = (
            select(
                Employee,
                func.coalesce(active_allocations_subquery.c.project_count, 0).label("active_projects"),
                func.avg(EmployeeSkill.proficiency).label("avg_proficiency")
            )
            .join(EmployeeSkill, Employee.id == EmployeeSkill.employee_id)
            .outerjoin(active_allocations_subquery, Employee.id == active_allocations_subquery.c.employee_id)
            .where(Employee.deleted_at.is_(None), EmployeeSkill.deleted_at.is_(None))
        )

        if identifier_filter:
            id_type, val = identifier_filter
            if id_type == "id":
                stmt = stmt.where(Employee.id == val)
            elif id_type == "email":
                stmt = stmt.where(Employee.email == val)
            elif id_type == "name":
                stmt = stmt.where(Employee.name.ilike(f"%{val}%"))

        if skill_ids:
            stmt = stmt.where(EmployeeSkill.skill_id.in_(skill_ids))
            stmt = stmt.group_by(Employee.id, active_allocations_subquery.c.project_count)
            stmt = stmt.having(func.count(EmployeeSkill.skill_id) == len(skill_ids))
        else:
            stmt = stmt.group_by(Employee.id, active_allocations_subquery.c.project_count)

        if availability == "AVAILABLE":
            stmt = stmt.where(func.coalesce(active_allocations_subquery.c.project_count, 0) < 2)
        elif availability == "UNAVAILABLE":
            stmt = stmt.where(func.coalesce(active_allocations_subquery.c.project_count, 0) >= 2)

        order_by_clauses = []
        if sort_by_exp_desc:
            order_by_clauses.append(desc(Employee.experience))
        else:
            order_by_clauses.append(asc(Employee.experience))
            
        if sort_by_prof_desc:
            order_by_clauses.append(desc("avg_proficiency"))
        else:
            order_by_clauses.append(asc("avg_proficiency"))

        stmt = stmt.order_by(*order_by_clauses)

        if limit is not None:
            stmt = stmt.limit(limit)
        if offset is not None:
            stmt = stmt.offset(offset)

        result = await self.db.execute(stmt)
        return list(result.all())