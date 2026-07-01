from pydantic import BaseModel, ConfigDict, EmailStr
from typing import Optional
from datetime import date, datetime

from models.project_requirement_request import RequestStatus
from enum import Enum

class AvailabilityFilter(str, Enum):
    AVAILABLE = "AVAILABLE"
    UNAVAILABLE = "UNAVAILABLE"
    ALL = "ALL"


class RequirementCreate(BaseModel):
    project_role_id: int
    requested_count: int
    stack_ids: list[int] = []


class RequirementUpdate(BaseModel):
    requested_count: Optional[int] = None
    status: Optional[RequestStatus] = None
    resolved_by: Optional[int] = None
    resolved_at: Optional[datetime] = None


class StackRequirementResponse(BaseModel):
    id: int
    project_requirement_request_id: int
    stack_id: int
    stack_name: str

    model_config = ConfigDict(from_attributes=True)


class RequirementResponse(BaseModel):
    id: int
    project_id: int
    project_role_id: int
    project_role_name: str
    requested_count: int
    requested_by: int
    requested_by_name: str
    resolved_by: int | None
    resolved_at: datetime | None
    status: RequestStatus
    stack_requests: list[StackRequirementResponse] = []

    model_config = ConfigDict(from_attributes=True)


class StackRequirementCreate(BaseModel):
    stack_id: int





class MatchedEmployeeResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    experience: int
    date_of_joining: date
    system_role_id: int
    system_role_name: str
    active_project_count: int

    model_config = ConfigDict(from_attributes=True)



class MatchedEmployeePaginatedResponse(BaseModel):
    items: list[MatchedEmployeeResponse]
    total_pages: int
    current_page: int
    limit: int

