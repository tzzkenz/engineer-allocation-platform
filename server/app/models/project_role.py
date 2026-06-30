from sqlalchemy import Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from models import Entity


class ProjectRole(Entity):
    __tablename__ = "project_roles"

    name: Mapped[str] = mapped_column(Text, nullable=False)

    project_employees = relationship("ProjectEmployee", back_populates="project_role")

    project_requirement_requests = relationship(
        "ProjectRequirementRequest", back_populates="project_role"
    )
