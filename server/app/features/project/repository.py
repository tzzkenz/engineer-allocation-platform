from datetime import datetime, timezone, date
from typing import Any

from sqlalchemy.orm import selectinload
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from models.project import Project, StatusType
from models.project_employee import ProjectEmployee
from models.project_stacks import ProjectStacks
from models.project_requirement_request import ProjectRequirementRequest, RequestStatus
from models.project_role import ProjectRole


class ProjectRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, project_id: int) -> Project | None:
        stmt = (
            select(Project)
            .options(selectinload(Project.stacks).selectinload(ProjectStacks.skill))
            .where(Project.id == project_id, Project.deleted_at.is_(None))
            .execution_options(populate_existing=True)
        )
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_name(self, name: str) -> Project | None:
        stmt = select(Project).where(Project.name == name, Project.deleted_at.is_(None))
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def list_all(
        self,
        limit: int | None = None,
        offset: int | None = None,
        status_filter: StatusType | None = None,
        identifier_filter: tuple[str, Any] | None = None,
        skill_ids: list[int] | None = None,
        current_user_id: int | None = None,
        is_hr: bool = False,
    ) -> tuple[list[Project], int]:
        stmt = (
            select(Project)
            .options(selectinload(Project.stacks).selectinload(ProjectStacks.skill))
            .where(Project.deleted_at.is_(None))
        )

        if not is_hr and current_user_id is not None:
            my_projects_stmt = (
                select(ProjectEmployee.project_id)
                .where(
                    ProjectEmployee.employee_id == current_user_id,
                    ProjectEmployee.date_exited.is_(None),
                    ProjectEmployee.deleted_at.is_(None),
                )
            )
            stmt = stmt.where(Project.id.in_(my_projects_stmt))

        if status_filter is not None:
            stmt = stmt.where(Project.status == status_filter)

        if identifier_filter is not None:
            id_type, value = identifier_filter
            if id_type == "id":
                stmt = stmt.where(Project.id == value)
            elif id_type == "name":
                stmt = stmt.where(Project.name.ilike(f"%{value}%"))

        if skill_ids:
            stmt = stmt.join(Project.stacks).where(ProjectStacks.skill_id.in_(skill_ids))
            stmt = stmt.distinct()

        count_stmt = select(func.count()).select_from(stmt.subquery())
        paged_stmt = stmt.order_by(Project.id.asc())

        if offset is not None:
            paged_stmt = paged_stmt.offset(offset)
        if limit is not None:
            paged_stmt = paged_stmt.limit(limit)

        count_result = await self.db.execute(count_stmt)
        total_count = count_result.scalar_one()

        result = await self.db.execute(paged_stmt)
        projects = list(result.scalars().unique().all())
        return projects, total_count

    async def create(
        self,
        name: str,
        status: StatusType,
        start_date: date,
        duration: int,
        skill_ids: list[int] | None = None,
    ) -> Project:
        project = Project(
            name=name,
            status=status,
            start_date=start_date,
            duration=duration,
        )
        self.db.add(project)
        await self.db.flush()

        for skill_id in skill_ids or []:
            self.db.add(ProjectStacks(project_id=project.id, skill_id=skill_id))

        await self.db.flush()
        return project

    async def update(
        self,
        project: Project,
        name: str | None = None,
        status: StatusType | None = None,
        start_date: date | None = None,
        duration: int | None = None,
    ) -> Project:
        if name is not None:
            project.name = name
        if status is not None:
            project.status = status
        if start_date is not None:
            project.start_date = start_date
        if duration is not None:
            project.duration = duration

        await self.db.flush()
        return project

    async def set_stacks(self, project: Project, skill_ids: list[int]) -> None:
        for ps in project.stacks:
            await self.db.delete(ps)
        await self.db.flush()
        for skill_id in skill_ids:
            self.db.add(ProjectStacks(project_id=project.id, skill_id=skill_id))
        await self.db.flush()

    async def soft_delete(self, project: Project) -> None:
        project.deleted_at = datetime.now(timezone.utc)
        await self.db.flush()

    async def get_active_allocation(
        self, project_id: int, employee_id: int, project_role_id: int
    ) -> ProjectEmployee | None:
        """
        Checks if the employee is already assigned to the project with the same role and hasn't exited.
        """
        stmt = select(ProjectEmployee).where(
            ProjectEmployee.project_id == project_id,
            ProjectEmployee.employee_id == employee_id,
            ProjectEmployee.project_role_id == project_role_id,
            ProjectEmployee.date_exited.is_(None),  # Not exited yet
            ProjectEmployee.deleted_at.is_(None),  # Soft-delete safety check
        )
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def allocate_employee(
        self, allocation_data: dict[str, Any], requirement_request_id: int | None = None
    ) -> ProjectEmployee:
        allocation = ProjectEmployee(**allocation_data)
        self.db.add(allocation)

        if requirement_request_id is not None:
            stmt = select(ProjectRequirementRequest).where(
                ProjectRequirementRequest.id == requirement_request_id,
                ProjectRequirementRequest.deleted_at.is_(None),
            )
            result = await self.db.execute(stmt)
            requirement = result.scalar_one_or_none()

            if requirement is not None:
                requirement.assigned_count += 1

        await self.db.flush()
        return allocation

    async def get_total_requested_count(self, project_id: int) -> int:
        """
        Sums up requested_count for a project where the request status is not REJECTED.
        """
        stmt = select(func.sum(ProjectRequirementRequest.requested_count)).where(
            ProjectRequirementRequest.project_id == project_id,
            ProjectRequirementRequest.status != RequestStatus.REJECTED,
            ProjectRequirementRequest.deleted_at.is_(None),
        )
        result = await self.db.execute(stmt)
        return result.scalar() or 0

    async def get_active_allocation_count(self, project_id: int) -> int:
        """
        Counts current active allocations for a project where date_exited is None.
        """
        stmt = select(func.count(ProjectEmployee.id)).where(
            ProjectEmployee.project_id == project_id,
            ProjectEmployee.date_exited.is_(None),
            ProjectEmployee.deleted_at.is_(None),
        )
        result = await self.db.execute(stmt)
        return result.scalar() or 0

    async def get_assigned_employees(self, project_id: int) -> list[Any]:
        """
        Retrieves active employee allocations, dynamically selecting the project's start_date
        and the project role's name from their respective tables.
        """
        stmt = (
            select(
                ProjectEmployee,
                ProjectRole.name.label("project_role_name"),
                Project.start_date.label("start_date"),
            )
            .join(ProjectRole, ProjectEmployee.project_role_id == ProjectRole.id)
            .join(Project, ProjectEmployee.project_id == Project.id)
            .options(selectinload(ProjectEmployee.employee))
            .where(
                ProjectEmployee.project_id == project_id,
                ProjectEmployee.date_exited.is_(None),
                ProjectEmployee.deleted_at.is_(None),
            )
        )

        result = await self.db.execute(stmt)

        allocations = []
        for row in result.all():
            emp_allocation = row[0]
            emp_allocation.project_role_name = row.project_role_name
            emp_allocation.start_date = row.start_date
            allocations.append(emp_allocation)

        return allocations

    async def get_allocation_by_id(self, allocation_id: int) -> ProjectEmployee | None:
        """Fetch an active allocation record by its ID."""
        stmt = select(ProjectEmployee).where(
            ProjectEmployee.id == allocation_id, ProjectEmployee.deleted_at.is_(None)
        )
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def exit_employee_from_project(
        self, allocation: ProjectEmployee
    ) -> ProjectEmployee:
        """Sets the exit date to today and decrements the requirement request count."""
        # Set exited date to today
        allocation.date_exited = date.today()

        # Decrement assigned_count if tied to a requirement request
        if allocation.requirement_request_id is not None:
            stmt = select(ProjectRequirementRequest).where(
                ProjectRequirementRequest.id == allocation.requirement_request_id,
                ProjectRequirementRequest.deleted_at.is_(None),
            )
            result = await self.db.execute(stmt)
            requirement = result.scalar_one_or_none()

            # Ensure it doesn't drop below 0
            if requirement is not None and requirement.assigned_count > 0:
                requirement.assigned_count -= 1

        await self.db.flush()
        return allocation
