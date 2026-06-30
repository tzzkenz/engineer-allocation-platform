from datetime import date, datetime
from pydantic import BaseModel, Field, ConfigDict, field_validator

from models.project import StatusType


# Create Schema
class ProjectCreate(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    start_date: date | None = Field(default=None)
    duration: int | None = Field(
        default=None, ge=1, description="Expected duration in months"
    )
    status: StatusType = StatusType.NOT_STARTED

    @field_validator("start_date")
    @classmethod
    def validate_start_date(cls, v: date):
        if v < date.today():
            raise ValueError("start_date cannot be in the past")
        return v


# Update Schema
class ProjectUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=255)
    status: StatusType | None = None
    start_date: date | None = None
    duration: int | None = Field(
        default=None,
        ge=1,
        description="Expected duration in months",
    )

    @field_validator("start_date")
    @classmethod
    def validate_start_date(cls, v: date | None):
        if v is not None and v < date.today():
            raise ValueError("start_date cannot be in the past")
        return v


class ProjectResponse(BaseModel):
    id: int
    name: str
    status: StatusType
    start_date: date | None = None
    duration: int | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)




class ProjectEmployeeBatchCreate(BaseModel):
    requirement_request_id: int
    employee_ids: list[int] = Field(..., min_length=1, description="List of employee IDs to allocate")
    is_shadow: bool = False


class ProjectEmployeeResponse(BaseModel):
    id: int
    project_id: int
    employee_id: int
    project_role_id: int
    is_shadow: bool
    date_assigned: date
    date_exited: date | None
    requirement_request_id: int | None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class ProjectStaffingStatusResponse(BaseModel):
    project_id: int
    total_requested: int
    active_allocated: int
    staffing_balance: int
    status_label: str