from datetime import datetime
import re
from sqlite3 import IntegrityError
from core.base_service import BaseService
from features.audit.repository import AuditLogRepository
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


class RequirementService(BaseService):
    def __init__(self, repo: RequirementRepository, audit_repo: AuditLogRepository):
        super().__init__(repo, audit_repo)

    def _format_requirement_response(self, req: ProjectRequirementRequest) -> dict:
        """Helper to inject dynamic model relationship string properties into a flat dictionary structure."""
        return {
            "id": req.id,
            "project_id": req.project_id,
            "project_role_id": req.project_role_id,
            "project_role_name": req.project_role.name
            if req.project_role
            else "Unknown Role",
            "requested_count": req.requested_count,
            "requested_by": req.requested_by,
            "requested_by_name": req.requested_by_employee.name
            if req.requested_by_employee
            else "Unknown Employee",
            "resolved_by": req.resolved_by,
            "resolved_at": req.resolved_at,
            "status": req.status,
            "stack_requests": [
                {
                    "id": sr.id,
                    "project_requirement_request_id": sr.project_requirement_request_id,
                    "stack_id": sr.stack_id,
                    "stack_name": sr.stack.name if sr.stack else "Unknown Stack",
                }
                for sr in req.stack_requests
            ],
        }

    async def get(
        self, request_id: int | None = None, project_id: int | None = None
    ) -> dict:
        if project_id is not None:
            requests = await self.repo.get_by_project_id(project_id)
            return [self._format_requirement_response(r) for r in requests]
        else:
            request = await self.repo.get_by_id(request_id)
            if request is None:
                raise NotFoundException("Requirement request not found")
            return self._format_requirement_response(request)

    async def list_all(self) -> list[dict]:
        requests = await self.repo.list_all()
        return [self._format_requirement_response(r) for r in requests]

    async def create(
        self,
        project_id: int,
        project_role_id: int,
        requested_count: int,
        requested_by: int,
        stack_ids: list[int] | None = None,
    ) -> dict:
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

            await self.audit_create(
                "PROJECT_REQUIREMENT_REQUEST", request.id, requested_by
            )
            await self.repo.db.commit()

            fresh_request = await self.repo.get_with_stacks(request.id)
            return self._format_requirement_response(fresh_request)

        except (NotFoundException, BadRequestException):
            await self.repo.db.rollback()
            raise
        except IntegrityError:
            await self.repo.db.rollback()
            raise ConflictException("Invalid foreign key or constraint violation")
        except Exception as e:
            await self.repo.db.rollback()
            raise UnknownException(str(e))

    async def update(
        self,
        request_id: int,
        user_id: int,
        requested_count: int | None = None,
        status: RequestStatus | None = None,
        resolved_by: int | None = None,
    ) -> dict:
        # Fetch internal domain object first via repository layer manually
        request = await self.repo.get_by_id(request_id)
        if request is None:
            raise NotFoundException("Requirement request not found")

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

        new_data = {
            "requested_count": requested_count,
            "status": status,
            "resolved_by": resolved_by,
            "resolved_at": resolved_at,
        }

        await self.audit_update_fields(
            "PROJECT_REQUIREMENT_REQUEST", request_id, updated, new_data, user_id
        )

        await self.repo.db.commit()

        # Pull fresh configuration state with relationships fully resolved
        fresh_request = await self.repo.get_by_id(request_id)
        return self._format_requirement_response(fresh_request)

    async def delete(self, request_id: int, user_id: int) -> None:
        request = await self.repo.get_by_id(request_id)
        if request is None:
            raise NotFoundException("Requirement request not found")

        try:
            await self.repo.soft_delete(request)
            await self.audit_delete("REQUIREMENT_REQUEST", request_id, user_id)
            await self.repo.db.commit()
        except Exception:
            await self.repo.db.rollback()
            raise UnknownException("Failed to delete requirement request")

    async def add_stack(self, request_id: int, stack_id: int) -> dict:
        request = await self.repo.get_by_id(request_id)
        if request is None:
            raise NotFoundException("Requirement request not found")

        skill = await self.repo.get_stack_by_id(stack_id)
        if skill is None:
            raise NotFoundException("Stack not found")

        if skill.type != SkillType.STACK:
            raise BadRequestException("The given skill is not a stack")

        try:
            await self.repo.add_stack_to_request(request_id, stack_id)
            await self.repo.db.commit()

            # Fetch complete model row sequence context populated with strings
            stack_request = await self.repo.get_stack_request_by_id(request.id)
            return {
                "id": stack_request.id,
                "project_requirement_request_id": stack_request.project_requirement_request_id,
                "stack_id": stack_request.stack_id,
                "stack_name": stack_request.stack.name
                if stack_request.stack
                else "Unknown Stack",
            }
        except IntegrityError:
            await self.repo.db.rollback()
            raise ConflictException("Invalid foreign key or constraint violation")
        except Exception as e:
            await self.repo.db.rollback()
            raise UnknownException(str(e))

    async def list_stacks(self, request_id: int) -> list[dict]:
        request = await self.repo.get_by_id(request_id)
        if request is None:
            raise NotFoundException("Requirement request not found")

        stacks = await self.repo.list_stacks_by_request(request_id)
        return [
            {
                "id": sr.id,
                "project_requirement_request_id": sr.project_requirement_request_id,
                "stack_id": sr.stack_id,
                "stack_name": sr.stack.name if sr.stack else "Unknown Stack",
            }
            for sr in stacks
        ]

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

    async def get_candidate_matches(self, request_id: int) -> list:
        request = await self.repo.get_by_id(request_id)
        if request is None:
            raise NotFoundException("Requirement request not found")

        records = await self.repo.get_matched_employees_for_request(request_id)
        return [
            {
                "id": emp.id,
                "name": emp.name,
                "email": emp.email,
                "experience": emp.experience,
                "date_of_joining": emp.date_of_joining,
                "system_role_id": emp.system_role_id,
                "active_project_count": active_count,
            }
            for emp, active_count in records
        ]

    async def get_filtered_candidates(
        self,
        skill_ids: list[int],
        availability: str,
        sort_by_experience: bool,
        sort_by_proficiency: bool,
        identifier: str | None = None,
        requirement_request_id: int | None = None,
        page: int = 1,
        limit: int = 10,
    ) -> dict:
        import math

        identifier_filter = None
        if identifier:
            identifier = identifier.strip()
            if identifier.isdigit():
                identifier_filter = ("id", int(identifier))
            elif re.match(r"[^@]+@[^@]+\.[^@]+", identifier):
                identifier_filter = ("email", identifier.lower())
            else:
                identifier_filter = ("name", identifier)

        project_id = None
        project_role_id = None
        if requirement_request_id is not None:
            req_request = await self.repo.get_by_id(requirement_request_id)
            if req_request is None:
                raise NotFoundException("Requirement request not found")
            project_id = req_request.project_id
            project_role_id = req_request.project_role_id

        offset = (page - 1) * limit

        records, total_count = await self.repo.search_matching_employees(
            skill_ids=skill_ids,
            availability=availability,
            sort_by_exp_desc=sort_by_experience,
            sort_by_prof_desc=sort_by_proficiency,
            identifier_filter=identifier_filter,
            project_id=project_id,
            project_role_id=project_role_id,
            limit=limit,
            offset=offset,
        )
        
        items = [
            {
                "id": emp.id,
                "name": emp.name,
                "email": emp.email,
                "experience": emp.experience,
                "date_of_joining": emp.date_of_joining,
                "system_role_id": emp.system_role_id,
                "system_role_name": system_role_name,  
                "active_project_count": active_count,
            }
            for emp, system_role_name, active_count, avg_prof in records
        ]

        total_pages = math.ceil(total_count / limit) if limit > 0 else 1

        return {
            "items": items,
            "total_pages": total_pages,
            "current_page": page,
            "limit": limit
        }