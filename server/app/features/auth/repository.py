from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from models.employee import Employee


class AuthRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_email(self, email: str) -> Employee | None:
        stmt = select(Employee).where(
            Employee.email == email, Employee.deleted_at.is_(None)
        )
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()
