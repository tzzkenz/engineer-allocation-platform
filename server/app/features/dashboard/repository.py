from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from models.project import Project


class DashboardRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def project_count(self):
        stmt = select(Project.status, func.count(Project.id)).group_by(Project.status)

        result = await self.db.execute(stmt)
        rows = result.all()

        return {status: count for status, count in rows}
