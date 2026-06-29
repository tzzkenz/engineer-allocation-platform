from pydantic import BaseModel, ConfigDict, Field


class ProjectRoleCreate(BaseModel):
    name: str = Field(min_length=1, max_length=255)


class ProjectRoleUpdate(BaseModel):
    name: str = Field(min_length=1, max_length=255)


class ProjectRoleResponse(BaseModel):
    id: int
    name: str

    model_config = ConfigDict(from_attributes=True)
