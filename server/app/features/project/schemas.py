from datetime import date
from pydantic import BaseModel, Field, ConfigDict, field_validator

from models.project import StatusType


# Create Schema
class ProjectCreate(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    start_date: date
    duration: int = Field(ge=1, description="Expected duration in months")
    status: StatusType

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


# Response Schema
class ProjectResponse(BaseModel):
    id: int
    name: str
    status: StatusType
    start_date: date
    duration: int

    model_config = ConfigDict(from_attributes=True)
