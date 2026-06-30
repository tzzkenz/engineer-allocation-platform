from datetime import datetime, timezone, date
from typing import Any

from sqlalchemy.orm import selectinload
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from models.project import Project, StatusType
from models.project_employee import ProjectEmployee
from models.project_stacks import ProjectStacks


class ProjectRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, project_id: int) -> Project | None:
        stmt = (
            select(Project)
            .options(selectinload(Project.stacks).selectinload(ProjectStacks.skill))
            .where(Project.id == project_id, Project.deleted_at.is_(None))
        )
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_name(self, name: str) -> Project | None:
        stmt = select(Project).where(Project.name == name, Project.deleted_at.is_(None))
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def list_all(self) -> list[Project]:
        stmt = (
            select(Project)
            .options(selectinload(Project.stacks).selectinload(ProjectStacks.skill))
            .where(Project.deleted_at.is_(None))
        )
        result = await self.db.execute(stmt)
        return result.scalars().all()

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
        self, allocation_data: dict[str, Any]
    ) -> ProjectEmployee:
        allocation = ProjectEmployee(**allocation_data)
        self.db.add(allocation)
        await self.db.flush()
        return allocation
