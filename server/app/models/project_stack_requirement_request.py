from sqlalchemy import ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from models import Entity


class ProjectStackRequirementRequest(Entity):
    __tablename__ = "project_stack_requirement_requests"

    project_requirement_request_id: Mapped[int] = mapped_column(
        ForeignKey("project_requirement_requests.id"), nullable=False, index=True
    )

    stack_id: Mapped[int] = mapped_column(
        ForeignKey("stacks.id"), nullable=False, index=True
    )

    project_requirement_request = relationship(
        "ProjectRequirementRequest", back_populates="stack_requests"
    )

    stack = relationship("Stack", back_populates="stack_requests")

    __table_args__ = (
        UniqueConstraint(
            "project_requirement_request_id", "stack_id", name="uq_request_stack"
        ),
    )
