from datetime import datetime

from sqlalchemy.exc import IntegrityError

from models.project_requirement_request import (
    ProjectRequirementRequest,
    RequestStatus,
)
from features.requirement.repository import RequirementRepository
from exceptions import NotFoundException, ConflictException, UnknownException


class RequirementService:
    def __init__(self, repo: RequirementRepository):
        self.repo = repo

    async def get(self, request_id: int) -> ProjectRequirementRequest:
        request = await self.repo.get_by_id(request_id)
        if request is None:
            raise NotFoundException("Requirement request not found")
        return request

    async def list(self) -> list[ProjectRequirementRequest]:
        return await self.repo.list_all()

    async def create(
        self,
        project_id: int,
        project_role_id: int,
        requested_count: int,
        requested_by: int,
    ) -> ProjectRequirementRequest:
        try:
            request = await self.repo.create(
                project_id=project_id,
                project_role_id=project_role_id,
                requested_count=requested_count,
                requested_by=requested_by,
            )
            await self.repo.db.commit()
            return request

        except IntegrityError:
            await self.repo.db.rollback()
            raise ConflictException("Invalid foreign key or constraint violation")

        except Exception:
            await self.repo.db.rollback()
            raise UnknownException("Failed to create requirement request")

    async def update(
        self,
        request_id: int,
        requested_count: int | None = None,
        status: RequestStatus | None = None,
        resolved_by: int | None = None,
    ) -> ProjectRequirementRequest:

        request = await self.get(request_id)

        resolved_at = None
        if status in {RequestStatus.APPROVED, RequestStatus.REJECTED}:
            resolved_at = datetime.now()

        updated = await self.repo.update(
            request,
            requested_count=requested_count,
            status=status,
            resolved_by=resolved_by,
            resolved_at=resolved_at,
        )

        await self.repo.db.commit()
        return updated

    async def delete(self, request_id: int) -> None:
        request = await self.get(request_id)

        try:
            await self.repo.soft_delete(request)
            await self.repo.db.commit()

        except Exception:
            await self.repo.db.rollback()
            raise UnknownException("Failed to delete requirement request")
