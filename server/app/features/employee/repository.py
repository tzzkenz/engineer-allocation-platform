from datetime import datetime, timezone
from typing import Any

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from models.employee import Employee


class EmployeeRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, employee_id: int) -> Employee | None:
        stmt = select(Employee).where(
            Employee.id == employee_id, Employee.deleted_at.is_(None)
        )
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_email(self, email: str) -> Employee | None:
        stmt = select(Employee).where(
            Employee.email == email, Employee.deleted_at.is_(None)
        )
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def list_all(self) -> list[Employee]:
        stmt = select(Employee).where(Employee.deleted_at.is_(None))
        result = await self.db.execute(stmt)
        return list(result.scalars())

    async def create(self, employee_data: dict[str, Any]) -> Employee:
        employee = Employee(**employee_data)
        self.db.add(employee)
        await self.db.flush()
        return employee

    async def update(self, employee: Employee, update_data: dict[str, Any]) -> Employee:
        for field, value in update_data.items():
            setattr(employee, field, value)
        await self.db.flush()
        return employee

    async def soft_delete(self, employee: Employee) -> None:
        employee.deleted_at = datetime.now(timezone.utc)
        await self.db.flush()
