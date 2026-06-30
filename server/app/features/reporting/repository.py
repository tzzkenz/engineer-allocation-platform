from datetime import date
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from models import (
    Employee,
    ProjectEmployee,
    Project,
    EmployeeSkill,
    ProjectStacks,
    Skill,
)


class ReportingRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_active_assignments(self) -> list[ProjectEmployee]:
        result = await self.db.execute(
            select(ProjectEmployee).where(
                ProjectEmployee.deleted_at.is_(None),
                ProjectEmployee.date_exited.is_(None),
            )
        )
        return result.scalars().all()

    async def get_all_employees(self) -> list[Employee]:
        result = await self.db.execute(
            select(Employee).where(Employee.deleted_at.is_(None))
        )
        return result.scalars().all()

    async def get_long_tenured_assignments(self, cutoff: date) -> list[ProjectEmployee]:
        result = await self.db.execute(
            select(ProjectEmployee).where(
                ProjectEmployee.deleted_at.is_(None),
                ProjectEmployee.date_exited.is_(None),
                ProjectEmployee.date_assigned <= cutoff,
                ProjectEmployee.is_shadow.is_(False),
            )
        )
        return result.scalars().all()

    async def get_skill_demand_counts(self) -> list[tuple[int, int]]:
        result = await self.db.execute(
            select(ProjectStacks.skill_id, func.count(ProjectStacks.id))
            .join(Project, Project.id == ProjectStacks.project_id)
            .where(
                ProjectStacks.deleted_at.is_(None),
                Project.status == "ONGOING",
            )
            .group_by(ProjectStacks.skill_id)
        )
        return result.all()

    async def get_skill_supply_counts(
        self, min_proficiency: int = 0
    ) -> list[tuple[int, int]]:
        result = await self.db.execute(
            select(EmployeeSkill.skill_id, func.count(EmployeeSkill.id))
            .where(
                EmployeeSkill.deleted_at.is_(None),
                EmployeeSkill.is_interest.is_(False),
                EmployeeSkill.proficiency >= min_proficiency,
            )
            .group_by(EmployeeSkill.skill_id)
        )
        return result.all()

    async def get_all_skills(self) -> dict[int, str]:
        result = await self.db.execute(select(Skill).where(Skill.deleted_at.is_(None)))
        return {s.id: s.name for s in result.scalars().all()}
