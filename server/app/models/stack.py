from models import Entity

from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Text


class Stack(Entity):
    __tablename__ = "stacks"

    name: Mapped[str] = mapped_column(Text, nullable=False)

    employee_stacks = relationship(
        "EmployeeStack", back_populates="stack", cascade="all, delete-orphan"
    )

    project_requirements = relationship(
        "ProjectStackRequirement", back_populates="stack"
    )

    stack_requests = relationship(
        "ProjectStackRequirementRequest", back_populates="stack"
    )
