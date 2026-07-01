import enum
from datetime import datetime

from models import Entity
from sqlalchemy import (
    CheckConstraint,
    DateTime,
    ForeignKey,
    Integer,
    Enum as SQLEnum,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship


class RequestStatus(enum.Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"


class ProjectRequirementRequest(Entity):
    __tablename__ = "project_requirement_requests"

    project_id: Mapped[int] = mapped_column(
        ForeignKey("projects.id"), nullable=False, index=True
    )

    project_role_id: Mapped[int] = mapped_column(
        ForeignKey("project_roles.id"), nullable=False, index=True
    )

    requested_count: Mapped[int] = mapped_column(Integer, nullable=False)
    assigned_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0, server_default="0")

    requested_by: Mapped[int] = mapped_column(
        ForeignKey("employees.id"), nullable=False, index=True
    )

    resolved_by: Mapped[int | None] = mapped_column(
        ForeignKey("employees.id"), nullable=True, index=True
    )

    resolved_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    status: Mapped[RequestStatus] = mapped_column(
        SQLEnum(RequestStatus), nullable=False
    )

    fulfilled_requirement_id: Mapped[int | None] = mapped_column(
        ForeignKey("project_requirement_requests.id"), nullable=True, index=True
    )

    requested_by_employee = relationship(
        "Employee", foreign_keys=[requested_by], back_populates="requested_requests"
    )

    resolved_by_employee = relationship(
        "Employee", foreign_keys=[resolved_by], back_populates="resolved_requests"
    )

    project = relationship("Project", back_populates="requirement_requests")

    project_role = relationship(
        "ProjectRole", back_populates="project_requirement_requests"
    )

    assigned_employees = relationship(
        "ProjectEmployee",
        back_populates="project_requirement_request",
        cascade="all, delete-orphan",
    )

    stack_requests = relationship(
        "ProjectStackRequirementRequest",
        back_populates="project_requirement_request",
        cascade="all, delete-orphan",
    )

    __table_args__ = (
        CheckConstraint("requested_count > 0", name="ck_requested_count_positive"),
    )
