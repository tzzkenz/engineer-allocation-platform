import enum

from sqlalchemy import ForeignKey, Text, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from models import Entity


class FeedbackType(enum.Enum):
    GENERAL = "GENERAL"
    PERFORMANCE = "PERFORMANCE"
    ISSUE = "ISSUE"


class Feedback(Entity):
    __tablename__ = "feedbacks"

    project_id: Mapped[int] = mapped_column(
        ForeignKey("projects.id"), nullable=False, index=True
    )
    created_by: Mapped[int] = mapped_column(
        ForeignKey("employees.id"), nullable=False, index=True
    )
    feedback_type: Mapped[FeedbackType] = mapped_column(
        SQLEnum(FeedbackType), nullable=False
    )
    note: Mapped[str] = mapped_column(Text, nullable=False)

    project = relationship("Project", back_populates="feedbacks")
    creator = relationship("Employee", back_populates="feedbacks")
