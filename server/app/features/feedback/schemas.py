from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict

from models.feedback import FeedbackType


# Input schemas
class FeedbackCreate(BaseModel):
    note: str = Field(min_length=10, max_length=255)
    feedback_type: FeedbackType


class FeedbackUpdate(BaseModel):
    note: str | None = Field(default=None, min_length=10, max_length=255)
    feedback_type: FeedbackType | None = None


# Response schemas
class FeedbackResponse(BaseModel):
    id: int
    note: str
    feedback_type: FeedbackType
    created_at: datetime
    updated_at: datetime | None = None
    created_by: int
    model_config = ConfigDict(from_attributes=True)
