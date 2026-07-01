from datetime import date, timedelta
from typing import Any

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

    async def list_all(
        self,
        page: int = 1,
        limit: int = 10,
        status: StatusType | None = None,
        identifier: str | None = None,
        skill_ids: list[int] | None = None,
    ) -> dict[str, Any]:
        import math

        identifier_filter = None
        if identifier:
            identifier = identifier.strip()
            # If the text is purely digits, treat it as an explicit Project ID search
            if identifier.isdigit():
                identifier_filter = ("id", int(identifier))
            # Otherwise, evaluate as a partial project name filter
            else:
                identifier_filter = ("name", identifier)

        # Calculate database window dimension offset
        offset = (page - 1) * limit

        projects, total_count = await self.repo.list_all(
            limit=limit,
            offset=offset,
            status_filter=status,
            identifier_filter=identifier_filter,
            skill_ids=skill_ids,
        )

        total_pages = math.ceil(total_count / limit) if limit > 0 else 1

        return {
            "items": projects,
            "total_pages": total_pages,
            "current_page": page,
            "limit": limit,
        }

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

        if data.status is not None:
            update_data["status"] = data.status

        if not update_data and data.skill_ids is None:
            return project

        try:
            # --- AUDIT LOG (field mutations) ---
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

            if update_data:
                project = await self.repo.update(project, **update_data)

            if data.skill_ids is not None:
                old_skill_ids = sorted(ps.skill_id for ps in project.stacks)
                new_skill_ids = sorted(set(data.skill_ids))

                if old_skill_ids != new_skill_ids:
                    await self.repo.set_stacks(project, data.skill_ids)

                    await self._stage_audit_log(
                        entity_name=EntityName.PROJECT,
                        entity_id=project_id,
                        action=ActionType.UPDATE,
                        field_name="stacks",
                        old_value=str(old_skill_ids),
                        new_value=str(new_skill_ids),
                        changed_by_id=changed_by_id,
                    )

            await self.repo.db.commit()

            return await self.repo.get_by_id(project_id)

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
        # Fetch requirement request information
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
            for emp_data in data.employees:
                emp_id = emp_data.employee_id
                is_shadow = emp_data.is_shadow

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
                    "is_shadow": is_shadow,
                    "requirement_request_id": data.requirement_request_id,
                    "date_assigned": today_date,
                    "start_date": emp_data.start_date,
                }

                allocation = await self.repo.allocate_employee(
                    allocation_dict, requirement_request_id=req_request.id
                )
                allocations.append(allocation)

            await self.repo.db.flush()

            for allocation in allocations:
                await self._stage_audit_log(
                    entity_name=EntityName.PROJECT_EMPLOYEE,
                    entity_id=allocation.id,
                    action=ActionType.CREATE,
                    changed_by_id=changed_by_id,
                )

            await self.repo.db.commit()

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

    async def get_project_staffing_status(self, project_id: int):
        """
        Calculates staffing metrics comparing active allocations vs non-rejected requirements.
        """
        await self.get(project_id)

        total_requested = await self.repo.get_total_requested_count(project_id)
        active_allocated = await self.repo.get_active_allocation_count(project_id)

        staffing_balance = active_allocated - total_requested

        if staffing_balance > 0:
            status_label = f"Overstaffed by {staffing_balance}"
        elif staffing_balance < 0:
            status_label = f"Understaffed by {abs(staffing_balance)}"
        else:
            status_label = "Correctly Staffed"

        return {
            "project_id": project_id,
            "total_requested": total_requested,
            "active_allocated": active_allocated,
            "staffing_balance": staffing_balance,
            "status_label": status_label,
        }

    async def get_project_employees(self, project_id: int) -> list[Any]:
        """
        Validates project existence and returns active employee allocations
        populated with project role names and start dates.
        """
        await self.get(project_id)

        return await self.repo.get_assigned_employees(project_id)

    async def remove_employee_by_details(
        self,
        project_id: int,
        employee_id: int,
        project_role_id: int,
        changed_by_id: int,
    ) -> None:
        """Finds an active allocation by project, employee, and role IDs and removes them."""

        # 1. Find the active allocation using the existing repository method
        allocation = await self.repo.get_active_allocation(
            project_id=project_id,
            employee_id=employee_id,
            project_role_id=project_role_id,
        )

        if allocation is None:
            raise NotFoundException(
                "Active employee allocation not found for the provided details."
            )

        try:
            await self.repo.exit_employee_from_project(allocation)

            await self._stage_audit_log(
                entity_name=EntityName.PROJECT_EMPLOYEE,
                entity_id=allocation.id,
                action=ActionType.UPDATE,
                field_name="date_exited",
                old_value="None",
                new_value=str(allocation.date_exited),
                changed_by_id=changed_by_id,
            )

            await self.repo.db.commit()

        except Exception as e:
            await self.repo.db.rollback()
            raise UnknownException(f"Failed to remove employee from project: {str(e)}")

    ######################################################################
    ######################################################################
    ######################################################################
    ###########################AGENT######################################
    ######################################################################
    ######################################################################
    ######################################################################

    def serialize_project(self, p):
        return {
            "id": p.id,
            "name": p.name,
            "status": p.status,
            "start_date": p.start_date.isoformat() if p.start_date else None,
            "end_date": p.end_date.isoformat() if p.end_date else None,
        }

    async def list_all_for_agent(
        self,
        status: StatusType | None = None,
        identifier: str | None = None,
        skill_ids: list[int] | None = None,
    ) -> dict[str, Any]:

        identifier_filter = None
        if identifier:
            identifier = identifier.strip()
            if identifier.isdigit():
                identifier_filter = ("id", int(identifier))
            else:
                identifier_filter = ("name", identifier)

        projects, total_count = await self.repo.list_all(
            status_filter=status,
            identifier_filter=identifier_filter,
            skill_ids=skill_ids,
        )

        serialized_projects = [self.serialize_project(p) for p in projects]

        return serialized_projects
