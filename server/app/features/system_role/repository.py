from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.system_role import SystemRole


class SystemRoleRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, role_id: int) -> SystemRole | None:
        stmt = select(SystemRole).where(
            SystemRole.id == role_id, SystemRole.deleted_at.is_(None)
        )
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_name(self, name: str) -> SystemRole | None:
        stmt = select(SystemRole).where(
            SystemRole.name == name, SystemRole.deleted_at.is_(None)
        )
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def list_all(self) -> list[SystemRole]:
        stmt = select(SystemRole).where(SystemRole.deleted_at.is_(None))
        result = await self.db.execute(stmt)
        return list(result.scalars())

    async def create(self, name: str) -> SystemRole:
        role = SystemRole(name=name)
        self.db.add(role)
        await self.db.flush()
        return role

    async def update(self, role: SystemRole, name: str) -> SystemRole:
        role.name = name
        await self.db.flush()
        return role

    async def soft_delete(self, role: SystemRole) -> None:
        role.deleted_at = datetime.now(timezone.utc)
        await self.db.flush()
