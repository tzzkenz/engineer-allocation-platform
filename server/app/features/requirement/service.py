from datetime import datetime

from sqlalchemy.exc import IntegrityError

from models.project_requirement_request import (
    ProjectRequirementRequest,
    RequestStatus,
)
from features.requirement.repository import RequirementRepository
from exceptions import (
    BadRequestException,
    NotFoundException,
    ConflictException,
    UnknownException,
)
from models.skill import SkillType


class RequirementService:
    def __init__(self, repo: RequirementRepository):
        self.repo = repo

    async def get(
        self, request_id: int | None = None, project_id: int | None = None
    ) -> ProjectRequirementRequest:
        if project_id is not None:
            request = await self.repo.get_by_project_id(project_id)
        else:
            request = await self.repo.get_by_id(request_id)
        if request is None:
            raise NotFoundException("Requirement request not found")
        return request

    async def list_all(self) -> list[ProjectRequirementRequest]:
        return await self.repo.list_all()

    async def create(
        self,
        project_id: int,
        project_role_id: int,
        requested_count: int,
        requested_by: int,
        stack_ids: list[int] | None = None,
    ) -> ProjectRequirementRequest:
        try:
            request = await self.repo.create(
                project_id=project_id,
                project_role_id=project_role_id,
                requested_count=requested_count,
                requested_by=requested_by,
            )

            if stack_ids:
                for stack_id in stack_ids:
                    skill = await self.repo.get_stack_by_id(stack_id)

                    if skill is None:
                        raise NotFoundException(f"Stack {stack_id} not found")

                    if skill.type != SkillType.STACK:
                        raise BadRequestException(
                            f"Skill {stack_id} is not a valid stack"
                        )

                    await self.repo.add_stack_to_request(request.id, stack_id)

            await self.repo.db.commit()
            return request

        except IntegrityError:
            await self.repo.db.rollback()
            raise ConflictException("Invalid foreign key or constraint violation")

        except Exception as e:
            await self.repo.db.rollback()
            raise UnknownException(str(e))

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

    async def add_stack(self, request_id: id, stack_id: id):
        request = await self.repo.get_by_id(request_id)

        if request is None:
            raise NotFoundException("Requirement request not found")

        skill = await self.repo.get_stack_by_id(stack_id)
        if skill is None:
            raise NotFoundException("Stack not found")

        if skill.type != SkillType.STACK:
            raise BadRequestException("The given skill is not a stack")

        try:
            stack_request = await self.repo.add_stack_to_request(request_id, stack_id)
            await self.repo.db.commit()
            return stack_request
        except IntegrityError:
            await self.repo.db.rollback()
            raise ConflictException("Invalid foreign key or constraint violation")

        except Exception:
            await self.repo.db.rollback()
            raise UnknownException("Failed to create requirement request")

    async def list_stacks(self, request_id: int):
        request = await self.repo.get_by_id(request_id)
        if request is None:
            raise NotFoundException("Requirement request not found")

        return await self.repo.list_stacks_by_request(request_id)

    async def remove_stack(self, request_id: int, stack_request_id: int) -> None:
        request = await self.repo.get_by_id(request_id)
        if request is None:
            raise NotFoundException("Requirement request not found")

        stack_request = await self.repo.get_stack_request_by_id(stack_request_id)
        if stack_request is None:
            raise NotFoundException("Stack requirement not found")

        if stack_request.project_requirement_request_id != request_id:
            raise NotFoundException(
                "Stack requirement not found under this requirement request"
            )

        try:
            await self.repo.delete_stack_request(stack_request)
            await self.repo.db.commit()
        except Exception:
            await self.repo.db.rollback()
            raise UnknownException("Failed to delete stack requirement")
