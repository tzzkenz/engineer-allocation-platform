from datetime import datetime
from pydantic import BaseModel, ConfigDict
from enum import Enum


class ActionType(str, Enum):
    CREATE = "CREATE"
    UPDATE = "UPDATE"
    DELETE = "DELETE"


class EntityName(str, Enum):
    EMPLOYEE = "EMPLOYEE"
    PROJECT = "PROJECT"
    PROJECT_EMPLOYEE = "PROJECT_EMPLOYEE"
    PROJECT_REQUIREMENT = "PROJECT_REQUIREMENT"
    PROJECT_REQUIREMENT_REQUEST = "PROJECT_REQUIREMENT_REQUEST"
    FEEDBACK = "FEEDBACK"
    EMPLOYEE_SKILL = "EMPLOYEE_SKILL"
    SYSTEM_ROLE = "SYSTEM_ROLE"


class AuditLogCreate(BaseModel):
    entity_name: EntityName
    entity_id: int
    action: ActionType
    field_name: str | None = None
    old_value: str | None = None
    new_value: str | None = None
    changed_by_id: int


class AuditLogResponse(BaseModel):
    id: int
    entity_name: EntityName
    entity_id: int
    action: ActionType
    field_name: str | None
    old_value: str | None
    new_value: str | None
    changed_by_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
