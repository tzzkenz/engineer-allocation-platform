from sqlalchemy import CheckConstraint, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

from models import Entity


class ProjectRequirement(Entity):
    __tablename__ = "project_requirements"

    project_id: Mapped[int] = mapped_column(
        ForeignKey("projects.id"), nullable=False, index=True
    )

    project_role_id: Mapped[int] = mapped_column(
        ForeignKey("project_roles.id"), nullable=False, index=True
    )

    required_count: Mapped[int] = mapped_column(Integer, nullable=False)

    project = relationship("Project", back_populates="requirements")
    project_role = relationship("ProjectRole", back_populates="requirements")

    stack_requirements = relationship(
        "ProjectStackRequirement",
        back_populates="project_requirement",
        cascade="all, delete-orphan",
    )

    filled_by = relationship("ProjectEmployee", back_populates="project_requirement")

    __table_args__ = (
        CheckConstraint("required_count > 0", name="ck_required_count_positive"),
    )
