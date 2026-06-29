from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from models.project_role import ProjectRole


class ProjectRoleRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, role_id: int) -> ProjectRole | None:
        stmt = select(ProjectRole).where(
            ProjectRole.id == role_id,
            ProjectRole.deleted_at.is_(None),
        )
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_name(self, name: str) -> ProjectRole | None:
        stmt = select(ProjectRole).where(
            ProjectRole.name == name,
            ProjectRole.deleted_at.is_(None),
        )
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def list_all(self) -> list[ProjectRole]:
        stmt = select(ProjectRole).where(ProjectRole.deleted_at.is_(None))
        result = await self.db.execute(stmt)
        return list(result.scalars())

    async def create(self, name: str) -> ProjectRole:
        role = ProjectRole(name=name)
        self.db.add(role)
        await self.db.flush()
        return role

    async def update(self, role: ProjectRole, name: str) -> ProjectRole:
        role.name = name
        await self.db.flush()
        return role

    async def soft_delete(self, role: ProjectRole) -> None:
        role.deleted_at = datetime.now(timezone.utc)
        await self.db.flush()
