from pydoc import text

from sqlalchemy import ForeignKey, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship

from models import Entity


class ProjectStacks(Entity):
    __tablename__ = "project_stacks"

    project_id: Mapped[int] = mapped_column(
        ForeignKey("projects.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    skill_id: Mapped[int] = mapped_column(
        ForeignKey("skills.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    __table_args__ = (
        Index(
            "uq_project_skill_active",
            "project_id",
            "skill_id",
            unique=True,
            postgresql_where=text("deleted_at IS NULL"),
        ),
    )

    project = relationship("Project", back_populates="stacks")
    skill = relationship("Skill", back_populates="project_stacks")
