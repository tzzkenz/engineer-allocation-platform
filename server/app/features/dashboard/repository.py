from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from models.project import Project
from models.employee import Employee
from models.system_role import SystemRole
from models.project_employee import ProjectEmployee
from models.employee_skill import EmployeeSkill
from models.project_stacks import ProjectStacks


class DashboardRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def project_count(self):
        stmt = select(Project.status, func.count(Project.id)).group_by(Project.status)

        result = await self.db.execute(stmt)
        rows = result.all()

        return {status: count for status, count in rows}

    async def employee_count(self):
        stmt = select(func.count(Employee.id))

        result = await self.db.execute(stmt)
        return result.scalar()

    async def employee_count_by_role(self):
        stmt = (
            select(SystemRole.name, func.count(Employee.id))
            .join(Employee, Employee.system_role_id == SystemRole.id)
            .group_by(SystemRole.name)
        )

        result = await self.db.execute(stmt)
        rows = result.all()

        return {role: count for role, count in rows}

    async def get_project_with_skills(self, project_id: int):
        stmt = (
            select(Project)
            .where(Project.id == project_id)
            .options(
                selectinload(Project.stacks),
                selectinload(Project.project_employees)
                .selectinload(ProjectEmployee.employee)
                .selectinload(Employee.employee_skills)
                .selectinload(EmployeeSkill.skill),
            )
        )

        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def all_project_coverage(self):
        stmt = select(Project).options(
            selectinload(Project.stacks).selectinload(ProjectStacks.skill),
            selectinload(Project.project_employees)
            .selectinload(ProjectEmployee.employee)
            .selectinload(Employee.employee_skills)
            .selectinload(EmployeeSkill.skill),
        )

        result = await self.db.execute(stmt)
        projects = result.scalars().all()

        response = []

        for project in projects:
            required = {}
            total_required = 0

            for req in project.stacks:
                name = req.skill.name
                required[name] = required.get(name, 0) + 1
                total_required += 1

            available = {}

            for pe in project.project_employees:
                for es in pe.employee.employee_skills:
                    name = es.skill.name
                    available[name] = available.get(name, 0) + 1

            filled = 0

            for skill, req_count in required.items():
                avail_count = available.get(skill, 0)
                filled += min(req_count, avail_count)

            coverage = (
                round((filled / total_required) * 100, 2) if total_required else 0
            )

            response.append(
                {
                    "project_id": project.id,
                    "project_name": project.name,
                    "required_positions": total_required,
                    "filled_positions": filled,
                    "skill_coverage": coverage,
                }
            )

        return response
