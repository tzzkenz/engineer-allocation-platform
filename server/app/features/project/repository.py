from datetime import datetime, timezone, date

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from models.project import Project, StatusType


class ProjectRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, project_id: int) -> Project | None:
        stmt = select(Project).where(
            Project.id == project_id, Project.deleted_at.is_(None)
        )
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_name(self, name: str) -> Project | None:
        stmt = select(Project).where(Project.name == name, Project.deleted_at.is_(None))
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def list_all(self) -> list[Project]:
        stmt = select(Project).where(Project.deleted_at.is_(None))
        result = await self.db.execute(stmt)
        return result.scalars().all()

    async def create(
        self,
        name: str,
        status: StatusType,
        start_date: date,
        duration: int,
    ) -> Project:
        project = Project(
            name=name,
            status=status,
            start_date=start_date,
            duration=duration,
        )
        self.db.add(project)
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

    async def soft_delete(self, project: Project) -> None:
        project.deleted_at = datetime.now(timezone.utc)
        await self.db.flush()
