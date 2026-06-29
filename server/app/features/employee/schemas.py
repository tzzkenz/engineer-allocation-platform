from datetime import date, datetime
from pydantic import BaseModel, EmailStr, Field, ConfigDict


# Shared base


class EmployeeBase(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    email: EmailStr
    experience: int = Field(ge=0, description="Years of experience")
    date_of_joining: date
    strengths: list[str] | None = None
    system_role_id: int


# Input schemas


class EmployeeCreate(EmployeeBase):
    password: str = Field(min_length=8, max_length=128)


class EmployeeUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=255)
    email: EmailStr | None = None
    experience: int | None = Field(default=None, ge=0)
    date_of_joining: date | None = None
    strengths: list[str] | None = None
    system_role_id: int | None = None


class EmployeeUpdateSelf(BaseModel):
    experience: int | None = Field(default=None, ge=0)
    strengths: list[str] | None = None


class PasswordChange(BaseModel):
    current_password: str
    new_password: str = Field(min_length=8, max_length=128)


# Output schemas


class EmployeeResponse(EmployeeBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class EmployeeSummary(BaseModel):
    id: int
    name: str
    email: EmailStr

    model_config = ConfigDict(from_attributes=True)
