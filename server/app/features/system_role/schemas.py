from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class SystemRoleCreate(BaseModel):
    name: str = Field(min_length=2, max_length=100)


class SystemRolePatch(BaseModel):
    name: str | None = Field(default=None, min_length=2, max_length=100)


class SystemRoleResponse(BaseModel):
    id: int
    name: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
