from datetime import date
from pydantic import BaseModel, Field, ConfigDict

from models.project import StatusType

# Input schemas


class ProjectCreate(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    status: StatusType
    start_date: date
    duration: int = Field(ge=1, description="Expected duration in months")


class ProjectUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=255)
    start_date: date | None = None
    duration: int | None = Field(
        ge=0, description="Expected duration in months", default=None
    )


# Output schemas


class ProjectResponse(BaseModel):
    id: int
    name: str
    start_date: date
    duration: int

    model_config = ConfigDict(from_attributes=True)
