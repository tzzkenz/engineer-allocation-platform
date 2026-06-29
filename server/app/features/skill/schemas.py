from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict
from enum import Enum


class SkillType(str, Enum):
    STACK = "STACK"
    TECHNICAL = "TECHNICAL"
    NON_TECHNICAL = "NON_TECHNICAL"


class SkillCreate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True, extra="ignore")

    name: str = Field(..., min_length=1, max_length=100, description="Name of the skill")
    type: SkillType = Field(..., description="Type classification of the skill")





class SkillPatch(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True, extra="ignore")

    name: str | None = Field(default=None, min_length=1, max_length=100, description="Name of the skill")
    type: SkillType | None = Field(default=None, description="Type classification of the skill")

#Response

class SkillResponse(BaseModel):
    id: int
    name: str
    type: SkillType
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)