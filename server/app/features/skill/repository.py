from datetime import datetime, timezone
from typing import Any
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from models.skill import Skill


class SkillRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, skill_id: int) -> Skill | None:
        stmt = select(Skill).where(
            Skill.id == skill_id, 
            Skill.deleted_at.is_(None)
        )
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_name(self, name: str) -> Skill | None:
        stmt = select(Skill).where(
            Skill.name == name, 
            Skill.deleted_at.is_(None)
        )
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def list_all(self) -> list[Skill]:
        stmt = select(Skill).where(
            Skill.deleted_at.is_(None)
        ).order_by(Skill.name.asc())
        result = await self.db.execute(stmt)
        return list(result.scalars())

    async def create(self, skill_data: dict[str, Any]) -> Skill:
        skill = Skill(**skill_data)
        self.db.add(skill)
        await self.db.flush()
        return skill

    async def update(self, skill: Skill, update_data: dict[str, Any]) -> Skill:
        if skill.deleted_at is not None:
            raise ValueError("Cannot update a soft-deleted skill")

        for field, value in update_data.items():
            setattr(skill, field, value)
        await self.db.flush()
        return skill
    
    async def soft_delete(self, skill: Skill) -> None:
        skill.deleted_at = datetime.now(timezone.utc)
        await self.db.flush()