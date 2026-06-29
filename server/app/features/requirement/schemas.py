from pydantic import BaseModel
from typing import Optional
from datetime import datetime

from models.project_requirement_request import RequestStatus


class RequirementCreate(BaseModel):
    project_id: int
    project_role_id: int
    requested_count: int
    requested_by: int


class RequirementUpdate(BaseModel):
    requested_count: Optional[int] = None
    status: Optional[RequestStatus] = None
    resolved_by: Optional[int] = None
    resolved_at: Optional[datetime] = None


class RequirementResponse(BaseModel):
    id: int
    project_id: int
    project_role_id: int
    requested_count: int
    requested_by: int
    resolved_by: int | None
    resolved_at: datetime | None
    status: RequestStatus

    class Config:
        from_attributes = True
