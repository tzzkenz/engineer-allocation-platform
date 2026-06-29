from typing import Any
from sqlalchemy.exc import IntegrityError

from models.skill import Skill
from features.skill.repository import SkillRepository
from exceptions import ConflictException, NotFoundException


class SkillService:
    def __init__(self, repo: SkillRepository):
        self.repo = repo

    async def list(self) -> list[Skill]:
        return await self.repo.list_all()
    
    async def get_by_id(self, skill_id: int) -> Skill:
        skill = await self.repo.get_by_id(skill_id)
        if skill is None:
            raise NotFoundException("Skill not found")
        return skill

    async def create(self, skill_data: dict[str, Any]) -> Skill:
        skill_data["name"] = skill_data["name"].strip()
        
        existing = await self.repo.get_by_name(skill_data["name"])
        if existing is not None:
            raise ConflictException("Skill name already exists")
            
        try:
            skill = await self.repo.create(skill_data)
            await self.repo.db.commit()
            return skill
        except IntegrityError:
            await self.repo.db.rollback()
            raise ConflictException("Database integrity violation occurred while creating skill")

    async def update(self, skill_id: int, update_data: dict[str, Any]) -> Skill:
        skill = await self.get_by_id(skill_id)

        filtered_updates = update_data
        if not filtered_updates:
            return skill

        if "name" in filtered_updates:
            existing = await self.repo.get_by_name(filtered_updates["name"])
            if existing is not None and existing.id != skill_id:
                raise ConflictException("Skill name already exists")

        try:
            skill = await self.repo.update(skill, filtered_updates)
            await self.repo.db.commit()
            await self.repo.db.refresh(skill)
            return skill
        except IntegrityError:
            await self.repo.db.rollback()
            raise ConflictException("Database integrity violation occurred while updating skill")
    
    
    async def delete(self, skill_id: int) -> None:
        skill = await self.get_by_id(skill_id)
        try:
            await self.repo.soft_delete(skill)
            await self.repo.db.commit()
        except Exception:
            await self.repo.db.rollback()
            raise Exception("Something went wrong during skill deletion")