from datetime import date, timedelta

from sqlalchemy import select
from sqlalchemy.exc import IntegrityError

from exceptions import ConflictException, NotFoundException, UnknownException
from features.project.repository import ProjectRepository
from models.project import Project, StatusType
from features.project.schemas import (
    ProjectCreate,
    ProjectEmployeeBatchCreate,
    ProjectUpdate,
)
from features.audit.schemas import ActionType, EntityName
from models.project_employee import ProjectEmployee
from models.project_requirement_request import ProjectRequirementRequest
from features.audit.repository import AuditLogRepository


class ProjectService:
    def __init__(self, repo: ProjectRepository, audit_repo: AuditLogRepository):
        self.repo = repo
        self.audit_repo = audit_repo

    async def _stage_audit_log(
        self,
        entity_name: EntityName,
        entity_id: int,
        action: ActionType,
        changed_by_id: int,
        field_name: str | None = None,
        old_value: str | None = None,
        new_value: str | None = None,
    ) -> None:
        log_data = {
            "entity_name": entity_name,
            "entity_id": entity_id,
            "action": action,
            "field_name": field_name,
            "old_value": old_value,
            "new_value": new_value,
            "changed_by_id": changed_by_id,
        }
        await self.audit_repo.create(log_data)

    async def get(self, project_id: int) -> Project:
        project = await self.repo.get_by_id(project_id)
        if project is None:
            raise NotFoundException("Project not found in DB")
        return project

    async def list_all(self) -> list[Project]:
        return await self.repo.list_all()

    async def create(self, data: ProjectCreate, changed_by_id: int) -> Project:
        name = data.name.strip()

        existing = await self.repo.get_by_name(name)
        if existing is not None:
            raise ConflictException(f"Project with name '{name}' already exists")

        try:
            project = await self.repo.create(
                name=name,
                status=data.status,
                start_date=data.start_date,
                duration=data.duration,
                skill_ids=data.skill_ids,
            )
            await self.repo.db.flush()

            # --- AUDIT LOG ADDED ---
            await self._stage_audit_log(
                entity_name=EntityName.PROJECT,
                entity_id=project.id,
                action=ActionType.CREATE,
                changed_by_id=changed_by_id,
            )

            await self.repo.db.commit()
            # await self.repo.db.refresh(project)
            return await self.repo.get_by_id(project.id)

        except IntegrityError:
            await self.repo.db.rollback()
            raise ConflictException(f"Project with name '{name}' already exists")
        except Exception as e:
            await self.repo.db.rollback()
            raise UnknownException(str(e))

    async def update(
        self, project_id: int, data: ProjectUpdate, changed_by_id: int
    ) -> Project:
        project = await self.get(project_id)

        update_data = {}
        if data.name is not None:
            name = data.name.strip()
            existing = await self.repo.get_by_name(name)
            if existing is not None and existing.id != project_id:
                raise ConflictException(f"Project with name '{name}' already exists")
            update_data["name"] = name

        if data.start_date is not None:
            update_data["start_date"] = data.start_date

        if data.duration is not None:
            update_data["duration"] = data.duration

        if not update_data:
            return project

        try:
            # --- AUDIT LOG ADDED (Track specific field mutations) ---
            for field, new_val in update_data.items():
                old_val = getattr(project, field)
                old_val_str = str(old_val) if old_val is not None else None
                new_val_str = str(new_val) if new_val is not None else None

                if old_val_str != new_val_str:
                    await self._stage_audit_log(
                        entity_name=EntityName.PROJECT,
                        entity_id=project_id,
                        action=ActionType.UPDATE,
                        field_name=field,
                        old_value=old_val_str,
                        new_value=new_val_str,
                        changed_by_id=changed_by_id,
                    )

            project = await self.repo.update(project, **update_data)
            await self.repo.db.commit()
            await self.repo.db.refresh(project)
            return project

        except IntegrityError:
            await self.repo.db.rollback()
            raise UnknownException("Database integrity error during update")
        except Exception as e:
            await self.repo.db.rollback()
            raise UnknownException(str(e))

    async def delete(self, project_id: int, changed_by_id: int) -> None:
        project = await self.get(project_id)

        try:
            await self.repo.soft_delete(project)

            # --- AUDIT LOG ADDED ---
            await self._stage_audit_log(
                entity_name=EntityName.PROJECT,
                entity_id=project_id,
                action=ActionType.DELETE,
                changed_by_id=changed_by_id,
            )

            await self.repo.db.commit()

        except IntegrityError:
            await self.repo.db.rollback()
            raise ConflictException("Cannot delete project as it is in use")
        except Exception as e:
            await self.repo.db.rollback()
            raise UnknownException(str(e))

    async def get_nearing_completion(self, days: int = 14) -> list[Project]:
        projects = await self.repo.list_all()
        today = date.today()
        cutoff = today + timedelta(days=days)

        result = []
        for project in projects:
            if (
                project.status != StatusType.ONGOING
                or project.start_date is None
                or project.duration is None
            ):
                continue

            end_date = project.start_date + timedelta(weeks=project.duration)

            if today <= end_date <= cutoff:
                result.append(project)

        return result

    async def allocate_employees_batch(
        self, data: ProjectEmployeeBatchCreate, changed_by_id: int
    ) -> list[ProjectEmployee]:
        stmt = select(ProjectRequirementRequest).where(
            ProjectRequirementRequest.id == data.requirement_request_id,
            ProjectRequirementRequest.deleted_at.is_(None),
        )
        result = await self.repo.db.execute(stmt)
        req_request = result.scalar_one_or_none()

        if req_request is None:
            raise NotFoundException("Requirement request not found or has been deleted")

        allocations = []
        today_date = date.today()

        try:
            for emp_id in data.employee_ids:
                existing_active = await self.repo.get_active_allocation(
                    project_id=req_request.project_id,
                    employee_id=emp_id,
                    project_role_id=req_request.project_role_id,
                )

                if existing_active is not None:
                    raise ConflictException(
                        f"Employee with ID {emp_id} is already actively assigned to this project under the same role."
                    )

                allocation_dict = {
                    "project_id": req_request.project_id,
                    "project_role_id": req_request.project_role_id,
                    "employee_id": emp_id,
                    "is_shadow": data.is_shadow,
                    "requirement_request_id": data.requirement_request_id,
                    "date_assigned": today_date,
                }

                allocation = await self.repo.allocate_employee(allocation_dict)
                allocations.append(allocation)

            # 1. Flush allocations to generate their unique record primary keys (`id`)
            await self.repo.db.flush()

            # 2. Stage the audit trail entries *while the session transaction is open*
            for allocation in allocations:
                await self._stage_audit_log(
                    entity_name=EntityName.PROJECT_EMPLOYEE,
                    entity_id=allocation.id,
                    action=ActionType.CREATE,
                    changed_by_id=changed_by_id,
                )

            # 3. Commit both allocations and audit entries atomically
            await self.repo.db.commit()

            # 4. Refresh objects for the return payload safely
            for allocation in allocations:
                await self.repo.db.refresh(allocation)

            return allocations

        except (ConflictException, NotFoundException):
            await self.repo.db.rollback()
            raise
        except IntegrityError:
            await self.repo.db.rollback()
            raise ConflictException(
                "Database integrity violation occurred. Verify that all employee IDs exist."
            )
        except Exception as e:
            await self.repo.db.rollback()
            raise UnknownException(f"Failed to allocate employees batch: {str(e)}")
