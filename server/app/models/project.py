from datetime import date, timedelta
import enum

from models import Entity

from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Date, Enum as SQLEnum, Integer, Text


class StatusType(enum.Enum):
    NOT_STARTED = "NOT_STARTED"
    ONGOING = "ONGOING"
    COMPLETED = "COMPLETED"
    STOPPED = "STOPPED"
    DISCARDED = "DISCARDED"


class Project(Entity):
    __tablename__ = "projects"

    name: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[StatusType] = mapped_column(
        SQLEnum(StatusType), nullable=False, server_default="'NOT_STARTED'"
    )
    start_date: Mapped[date] = mapped_column(Date, nullable=True)
    duration: Mapped[int] = mapped_column(Integer, nullable=True)
    end_date: Mapped[date | None] = mapped_column(Date, nullable=True)

    project_employees = relationship(
        "ProjectEmployee", back_populates="project", cascade="all, delete-orphan"
    )

    feedbacks = relationship(
        "Feedback", back_populates="project", cascade="all, delete-orphan"
    )

    requirement_requests = relationship(
        "ProjectRequirementRequest",
        back_populates="project",
        cascade="all, delete-orphan",
    )

    stacks = relationship("ProjectStacks", back_populates="project")

    @property
    def expected_end_date(self) -> date:
        return self.start_date + timedelta(days=self.duration)
