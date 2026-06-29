from datetime import date, datetime
from typing import Any

from sqlalchemy.exc import IntegrityError

from features.auth.utils import hash_password, verify_password
from features.employee.repository import EmployeeRepository
from models.employee import Employee
from exceptions import (
    NotFoundException,
    ConflictException,
    BadRequestException,
)


def _coerce_date(value: Any) -> date:
    if isinstance(value, date) and not isinstance(value, datetime):
        return value
    if isinstance(value, datetime):
        return value.date()
    if isinstance(value, str):
        return date.fromisoformat(value)
    raise BadRequestException("date_of_joining must be a valid date")


class EmployeeService:
    def __init__(self, repo: EmployeeRepository):
        self.repo = repo

    async def get(self, employee_id: int) -> Employee:
        employee = await self.repo.get_by_id(employee_id)
        if employee is None:
            raise NotFoundException("Employee not found")
        return employee

    async def list(self) -> list[Employee]:
        return await self.repo.list_all()

    async def create(self, employee_data: dict[str, Any]) -> Employee:
        employee_data = dict(employee_data)
        employee_data["email"] = str(employee_data["email"]).strip().lower()

        if "date_of_joining" in employee_data:
            employee_data["date_of_joining"] = _coerce_date(
                employee_data["date_of_joining"]
            )

        existing = await self.repo.get_by_email(employee_data["email"])
        if existing is not None and existing.deleted_at is None:
            raise ConflictException("Email already registered")

        plain_password = employee_data.pop("password")
        employee_data["password_hash"] = hash_password(plain_password)

        try:
            employee = await self.repo.create(employee_data)
            await self.repo.db.commit()
            return employee
        except IntegrityError:
            await self.repo.db.rollback()
            raise ConflictException(
                "Database integrity violation occurred while creating employee"
            )

    async def update(self, employee_id: int, update_data: dict[str, Any]) -> Employee:
        employee = await self.get(employee_id)

        filtered_updates = {k: v for k, v in update_data.items() if v is not None}

        if "email" in filtered_updates:
            filtered_updates["email"] = str(filtered_updates["email"]).strip().lower()
            existing = await self.repo.get_by_email(filtered_updates["email"])
            if existing is not None and existing.id != employee_id and existing.deleted_at is None:
                raise ConflictException("Email already in use by another employee")

        if "date_of_joining" in filtered_updates:
            filtered_updates["date_of_joining"] = _coerce_date(
                filtered_updates["date_of_joining"]
            )

        try:
            employee = await self.repo.update(employee, filtered_updates)
            await self.repo.db.commit()
            await self.repo.db.refresh(employee)
            return employee
        except Exception:
            await self.repo.db.rollback()
            raise BadRequestException("Something went wrong during employee update")

    async def delete(self, employee_id: int) -> None:
        employee = await self.get(employee_id)
        try:
            await self.repo.soft_delete(employee)
            await self.repo.db.commit()
        except Exception:
            await self.repo.db.rollback()
            raise BadRequestException("Something went wrong during employee deletion")

    async def change_password(
        self, employee_id: int, passwords: dict[str, Any]
    ) -> None:
        employee = await self.get(employee_id)

        if not verify_password(passwords["current_password"], employee.password_hash):
            raise BadRequestException("Incorrect current password")

        if passwords["current_password"] == passwords["new_password"]:
            raise BadRequestException("New password cannot be the same as the current password")

        update_data = {"password_hash": hash_password(passwords["new_password"])}

        try:
            await self.repo.update(employee, update_data)
            await self.repo.db.commit()
        except Exception:
            await self.repo.db.rollback()
            raise BadRequestException("Something went wrong while changing the password")