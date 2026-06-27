from sqlalchemy import ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models import Entity


class ProjectStackRequirement(Entity):
    __tablename__ = "project_stack_requirements"

    project_requirement_id: Mapped[int] = mapped_column(
        ForeignKey("project_requirements.id"), nullable=False, index=True
    )

    stack_id: Mapped[int] = mapped_column(
        ForeignKey("stacks.id"), nullable=False, index=True
    )

    project_requirement = relationship(
        "ProjectRequirement", back_populates="stack_requirements"
    )

    stack = relationship("Stack", back_populates="project_requirements")

    __table_args__ = (
        UniqueConstraint("project_requirement_id", "stack_id", name="uq_req_stack"),
    )
