from datetime import datetime, timezone
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload


from models.project_requirement_request import (
    ProjectRequirementRequest,
    RequestStatus,
)
from models.project_stack_requirement_request import ProjectStackRequirementRequest
from models.skill import Skill


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
            .options(selectinload(ProjectRequirementRequest.stack_requests))  # ✅
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
            .options(selectinload(ProjectRequirementRequest.stack_requests))  # ✅
        )
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def list_all(self) -> list[ProjectRequirementRequest]:
        stmt = (
            select(ProjectRequirementRequest)
            .where(ProjectRequirementRequest.deleted_at.is_(None))
            .options(selectinload(ProjectRequirementRequest.stack_requests))  # ✅
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
        stmt = select(ProjectStackRequirementRequest).where(
            ProjectStackRequirementRequest.project_requirement_request_id == request_id
        )
        result = await self.db.execute(stmt)
        return result.scalars().all()

    async def get_stack_request_by_id(
        self, stack_request_id: int
    ) -> ProjectStackRequirementRequest | None:
        stmt = select(ProjectStackRequirementRequest).where(
            ProjectStackRequirementRequest.id == stack_request_id
        )
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def delete_stack_request(
        self, stack_request: ProjectStackRequirementRequest
    ) -> None:
        await self.db.delete(stack_request)
        await self.db.flush()

    async def get_with_stacks(self, request_id: int):
        stmt = (
            select(ProjectRequirementRequest)
            .where(ProjectRequirementRequest.id == request_id)
            .options(selectinload(ProjectRequirementRequest.stack_requests))
        )
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()
