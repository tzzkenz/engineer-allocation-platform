from datetime import date, datetime
from pydantic import BaseModel, EmailStr, Field, ConfigDict


class EmployeeBase(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True, extra="ignore")

    name: str = Field(..., min_length=1, max_length=255)
    email: EmailStr
    experience: int = Field(..., ge=0)
    date_of_joining: date
    system_role_id: int


class EmployeeCreate(EmployeeBase):
    model_config = ConfigDict(str_strip_whitespace=True, extra="ignore")

    password: str = Field(..., min_length=8, max_length=128)


class EmployeeUpdate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True, extra="ignore")

    name: str | None = Field(default=None, min_length=1, max_length=255)
    email: EmailStr | None = None
    experience: int | None = Field(default=None, ge=0)
    date_of_joining: date | None = None
    system_role_id: int | None = None


class EmployeeUpdateSelf(BaseModel):
    experience: int | None = Field(default=None, ge=0)


class PasswordChange(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True, extra="ignore")

    current_password: str
    new_password: str = Field(..., min_length=8, max_length=128)


# Response
class EmployeeResponse(EmployeeBase):
    id: int
    system_role_id: int
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)


class EmployeeSummary(BaseModel):
    id: int
    name: str
    email: EmailStr

    model_config = ConfigDict(from_attributes=True)
