from datetime import date, datetime
from typing import Any

from sqlalchemy.exc import IntegrityError

from features.auth.utils import hash_password, verify_password
from features.employee.repository import EmployeeRepository
from models.employee import Employee
from models.employee_skill import EmployeeSkill  # FIXED: Missing import added
from exceptions import (
    NotFoundException,
    ConflictException,
    BadRequestException,
)
from features.employee.schemas import (
    EmployeeSkillAddMultiple,
    EmployeeSkillResponse,
    UpdateInterest,
    UpdateProficiency,
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

    async def add_skills(self, employee_id: int, payload: EmployeeSkillAddMultiple) -> None:
        await self.get(employee_id)
        
        skills_to_add = []
        for item in payload.skills:
            existing = await self.repo.get_employee_skill(employee_id, item.skill_id)
            if existing is not None:
                continue
            
            skill_link = EmployeeSkill(
                employee_id=employee_id,
                skill_id=item.skill_id,
                proficiency=item.proficiency,
                is_interest=item.is_interest
            )
            skills_to_add.append(skill_link)

        try:
            await self.repo.add_employee_skills(skills_to_add)
            await self.repo.db.commit()
        except IntegrityError:
            await self.repo.db.rollback()
            raise ConflictException("Database violation occurred. Verify that all skill IDs exist.")

    async def update_skill_proficiency(self, employee_id: int, skill_id: int, payload: UpdateProficiency) -> None:
        await self.get(employee_id)
        employee_skill = await self.repo.get_employee_skill(employee_id, skill_id)
        if employee_skill is None:
            raise NotFoundException("Skill connection not found for this employee")

        employee_skill.proficiency = payload.proficiency
        try:
            await self.repo.update_employee_skill(employee_skill)
            await self.repo.db.commit()
        except Exception:
            await self.repo.db.rollback()
            raise BadRequestException("Failed to update proficiency value")

    async def update_skill_interest(self, employee_id: int, skill_id: int, payload: UpdateInterest) -> None:
        await self.get(employee_id)
        employee_skill = await self.repo.get_employee_skill(employee_id, skill_id)
        if employee_skill is None:
            raise NotFoundException("Skill connection not found for this employee")

        employee_skill.is_interest = payload.is_interest
        try:
            await self.repo.update_employee_skill(employee_skill)
            await self.repo.db.commit()
        except Exception:
            await self.repo.db.rollback()
            raise BadRequestException("Failed to update interest flag")

    async def remove_skill(self, employee_id: int, skill_id: int) -> None:
        await self.get(employee_id)
        employee_skill = await self.repo.get_employee_skill(employee_id, skill_id)
        if employee_skill is None:
            raise NotFoundException("Skill connection not found for this employee")

        try:
            await self.repo.remove_employee_skill(employee_skill)
            await self.repo.db.commit()
        except Exception:
            await self.repo.db.rollback()
            raise BadRequestException("Failed to remove skill linkage")
        
    async def get_skills(self, employee_id: int) -> "list[EmployeeSkillResponse]":
        await self.get(employee_id)
        records = await self.repo.get_employee_skills(employee_id)
        
        return [
            EmployeeSkillResponse(
                skill_id=emp_skill.skill_id,
                name=skill.name,
                type=skill.type,
                proficiency=emp_skill.proficiency,
                is_interest=emp_skill.is_interest,
                created_at=emp_skill.created_at,
                updated_at=emp_skill.updated_at
            )
            for emp_skill, skill in records
        ]