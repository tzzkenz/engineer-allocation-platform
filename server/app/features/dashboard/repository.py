from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from models.project import Project
from models.employee import Employee
from models.system_role import SystemRole


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
