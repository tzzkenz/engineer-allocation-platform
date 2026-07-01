from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from models.project import Project
from models.project_stacks import ProjectStacks
from models.project_employee import ProjectEmployee
from models.employee import Employee
from models.employee_skill import EmployeeSkill
from models.skill import Skill


class DashboardRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def employee_count(self):
        stmt = select(func.count(Employee.id)).where(Employee.deleted_at.is_(None))
        result = await self.db.execute(stmt)
        return result.scalar()

    async def employee_count_by_role(self):
        stmt = (
            select(Employee.system_role_id, func.count(Employee.id))
            .where(Employee.deleted_at.is_(None))
            .group_by(Employee.system_role_id)
        )

        result = await self.db.execute(stmt)
        return dict(result.all())

    async def project_count(self):
        stmt = select(func.count(Project.id)).where(Project.deleted_at.is_(None))
        result = await self.db.execute(stmt)
        return result.scalar()

    async def project_count_with_status(self):
        stmt = (
            select(Project.status, func.count(Project.id))
            .where(Project.deleted_at.is_(None))
            .group_by(Project.status)
        )

        result = await self.db.execute(stmt)
        return dict(result.all())

    async def skill_coverage_by_skill(self):

        required_stmt = (
            select(
                Skill.name.label("skill"),
                func.count(ProjectStacks.id).label("required"),
            )
            .select_from(ProjectStacks)
            .join(Project, Project.id == ProjectStacks.project_id)
            .join(Skill, Skill.id == ProjectStacks.skill_id)
            .where(Project.deleted_at.is_(None))
            .group_by(Skill.name)
        )

        required_result = await self.db.execute(required_stmt)
        required_data = {row.skill: row.required for row in required_result.all()}

        filled_stmt = (
            select(
                Skill.name.label("skill"),
                func.count(ProjectEmployee.id).label("filled"),
            )
            .select_from(ProjectEmployee)
            .join(Project, Project.id == ProjectEmployee.project_id)
            .join(Employee, Employee.id == ProjectEmployee.employee_id)
            .join(EmployeeSkill, EmployeeSkill.employee_id == Employee.id)
            .join(Skill, Skill.id == EmployeeSkill.skill_id)
            .where(Project.deleted_at.is_(None))
            .group_by(Skill.name)
        )

        filled_result = await self.db.execute(filled_stmt)
        filled_data = {row.skill: row.filled for row in filled_result.all()}

        all_skills = set(required_data.keys()) | set(filled_data.keys())

        return {
            skill: {
                "required": required_data.get(skill, 0),
                "filled": filled_data.get(skill, 0),
            }
            for skill in all_skills
        }
