from datetime import date, datetime
from typing import Any

from sqlalchemy.exc import IntegrityError

from features.auth.utils import hash_password, verify_password
from features.employee.repository import EmployeeRepository
from features.audit.repository import AuditLogRepository
from models.employee import Employee
from models.employee_skill import EmployeeSkill
from models.audit_log import EntityName, ActionType
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
    def __init__(self, repo: EmployeeRepository, audit_repo: AuditLogRepository):
        self.repo = repo
        self.audit_repo = audit_repo

    def _format_employee_response(self, employee: Employee, role_name: str) -> dict[str, Any]:
        return {
            "id": employee.id,
            "name": employee.name,
            "email": employee.email,
            "experience": employee.experience,
            "date_of_joining": employee.date_of_joining,
            "system_role_id": employee.system_role_id,
            "system_role_name": role_name,
            "created_at": employee.created_at,
            "updated_at": employee.updated_at,
        }

    async def _stage_audit_log(
        self,
        entity_name: EntityName,
        entity_id: int,
        action: ActionType,
        changed_by_id: int,
        field_name: str | None = None,
        old_value: str | None = None,
        new_value: str | None = None,
    ) -> None:
        log_data = {
            "entity_name": entity_name,
            "entity_id": entity_id,
            "action": action,
            "field_name": field_name,
            "old_value": old_value,
            "new_value": new_value,
            "changed_by_id": changed_by_id,
        }
        await self.audit_repo.create(log_data)

    async def get(self, employee_id: int) -> dict[str, Any]:
        result = await self.repo.get_by_id_with_role(employee_id)
        if result is None:
            raise NotFoundException("Employee not found")
        return self._format_employee_response(result[0], result[1])

    async def list(self, limit: int | None = None, offset: int | None = None) -> list[dict[str, Any]]:
        records = await self.repo.list_all_with_role(limit=limit, offset=offset)
        return [self._format_employee_response(emp, role_name) for emp, role_name in records]

    async def create(self, employee_data: dict[str, Any], changed_by_id: int) -> dict[str, Any]:
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
            
            await self._stage_audit_log(
                entity_name=EntityName.EMPLOYEE,
                entity_id=employee.id,
                action=ActionType.CREATE,
                changed_by_id=changed_by_id
            )
            
            await self.repo.db.commit()
            
            result = await self.repo.get_by_id_with_role(employee.id)
            return self._format_employee_response(result[0], result[1])
        except IntegrityError:
            await self.repo.db.rollback()
            raise ConflictException(
                "Database integrity violation occurred while creating employee"
            )

    async def update(self, employee_id: int, update_data: dict[str, Any], changed_by_id: int) -> dict[str, Any]:
        employee = await self.repo.get_by_id(employee_id)
        if employee is None:
            raise NotFoundException("Employee not found")

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
            for field, new_val in filtered_updates.items():
                old_val = getattr(employee, field)
                
                old_val_str = str(old_val) if old_val is not None else None
                new_val_str = str(new_val) if new_val is not None else None
                
                if old_val_str != new_val_str:
                    await self._stage_audit_log(
                        entity_name=EntityName.EMPLOYEE,
                        entity_id=employee_id,
                        action=ActionType.UPDATE,
                        field_name=field,
                        old_value=old_val_str,
                        new_value=new_val_str,
                        changed_by_id=changed_by_id
                    )

            await self.repo.update(employee, filtered_updates)
            await self.repo.db.commit()
            
            result = await self.repo.get_by_id_with_role(employee_id)
            return self._format_employee_response(result[0], result[1])
        except Exception:
            await self.repo.db.rollback()
            raise BadRequestException("Something went wrong during employee update")

    async def delete(self, employee_id: int, changed_by_id: int) -> None:
        employee = await self.repo.get_by_id(employee_id)
        if employee is None:
            raise NotFoundException("Employee not found")
        try:
            await self.repo.soft_delete(employee)
            
            await self._stage_audit_log(
                entity_name=EntityName.EMPLOYEE,
                entity_id=employee_id,
                action=ActionType.DELETE,
                changed_by_id=changed_by_id
            )
            
            await self.repo.db.commit()
        except Exception:
            await self.repo.db.rollback()
            raise BadRequestException("Something went wrong during employee deletion")

    async def change_password(
        self, employee_id: int, passwords: dict[str, Any], changed_by_id: int
    ) -> None:
        employee = await self.repo.get_by_id(employee_id)
        if employee is None:
            raise NotFoundException("Employee not found")

        if not verify_password(passwords["current_password"], employee.password_hash):
            raise BadRequestException("Incorrect current password")

        if passwords["current_password"] == passwords["new_password"]:
            raise BadRequestException("New password cannot be the same as the current password")

        update_data = {"password_hash": hash_password(passwords["new_password"])}

        try:
            await self._stage_audit_log(
                entity_name=EntityName.EMPLOYEE,
                entity_id=employee_id,
                action=ActionType.UPDATE,
                field_name="password_hash",
                old_value="[REDACTED]",
                new_value="[REDACTED]",
                changed_by_id=changed_by_id
            )
            
            await self.repo.update(employee, update_data)
            await self.repo.db.commit()
        except Exception:
            await self.repo.db.rollback()
            raise BadRequestException("Something went wrong while changing the password")

    async def add_skills(self, employee_id: int, payload: EmployeeSkillAddMultiple, changed_by_id: int) -> None:
        employee = await self.repo.get_by_id(employee_id)
        if employee is None:
            raise NotFoundException("Employee not found")
        
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
            added_skills = await self.repo.add_employee_skills(skills_to_add)
            
            for skill_link in added_skills:
                await self._stage_audit_log(
                    entity_name=EntityName.EMPLOYEE_SKILL,
                    entity_id=skill_link.skill_id,
                    action=ActionType.CREATE,
                    changed_by_id=changed_by_id,
                    new_value=f"proficiency={skill_link.proficiency}, is_interest={skill_link.is_interest}"
                )
                
            await self.repo.db.commit()
        except IntegrityError:
            await self.repo.db.rollback()
            raise ConflictException("Database violation occurred. Verify that all skill IDs exist.")

    async def update_skill_proficiency(self, employee_id: int, skill_id: int, payload: UpdateProficiency, changed_by_id: int) -> None:
        employee = await self.repo.get_by_id(employee_id)
        if employee is None:
            raise NotFoundException("Employee not found")
            
        employee_skill = await self.repo.get_employee_skill(employee_id, skill_id)
        if employee_skill is None:
            raise NotFoundException("Skill connection not found for this employee")

        old_proficiency = employee_skill.proficiency
        employee_skill.proficiency = payload.proficiency
        
        try:
            if old_proficiency != payload.proficiency:
                await self._stage_audit_log(
                    entity_name=EntityName.EMPLOYEE_SKILL,
                    entity_id=skill_id,
                    action=ActionType.UPDATE,
                    field_name="proficiency",
                    old_value=str(old_proficiency),
                    new_value=str(payload.proficiency),
                    changed_by_id=changed_by_id
                )
                
            await self.repo.update_employee_skill(employee_skill)
            await self.repo.db.commit()
        except Exception:
            await self.repo.db.rollback()
            raise BadRequestException("Failed to update proficiency value")

    async def update_skill_interest(self, employee_id: int, skill_id: int, payload: UpdateInterest, changed_by_id: int) -> None:
        employee = await self.repo.get_by_id(employee_id)
        if employee is None:
            raise NotFoundException("Employee not found")
            
        employee_skill = await self.repo.get_employee_skill(employee_id, skill_id)
        if employee_skill is None:
            raise NotFoundException("Skill connection not found for this employee")

        old_interest = employee_skill.is_interest
        employee_skill.is_interest = payload.is_interest
        
        try:
            if old_interest != payload.is_interest:
                await self._stage_audit_log(
                    entity_name=EntityName.EMPLOYEE_SKILL,
                    entity_id=skill_id,
                    action=ActionType.UPDATE,
                    field_name="is_interest",
                    old_value=str(old_interest),
                    new_value=str(payload.is_interest),
                    changed_by_id=changed_by_id
                )
                
            await self.repo.update_employee_skill(employee_skill)
            await self.repo.db.commit()
        except Exception:
            await self.repo.db.rollback()
            raise BadRequestException("Failed to update interest flag")

    async def remove_skill(self, employee_id: int, skill_id: int, changed_by_id: int) -> None:
        employee = await self.repo.get_by_id(employee_id)
        if employee is None:
            raise NotFoundException("Employee not found")
            
        employee_skill = await self.repo.get_employee_skill(employee_id, skill_id)
        if employee_skill is None:
            raise NotFoundException("Skill connection not found for this employee")

        try:
            await self._stage_audit_log(
                entity_name=EntityName.EMPLOYEE_SKILL,
                entity_id=skill_id,
                action=ActionType.DELETE,
                changed_by_id=changed_by_id
            )
            
            await self.repo.remove_employee_skill(employee_skill)
            await self.repo.db.commit()
        except Exception:
            await self.repo.db.rollback()
            raise BadRequestException("Failed to remove skill linkage")
        
    async def get_skills(self, employee_id: int) -> "list[EmployeeSkillResponse]":
        employee = await self.repo.get_by_id(employee_id)
        if employee is None:
            raise NotFoundException("Employee not found")
            
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