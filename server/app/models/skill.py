import enum

from models import Entity

from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Enum as SQLEnum, Text


class SkillType(enum.Enum):
    STACK = "STACK"
    TECHNICAL = "TECHNICAL"
    NON_TECHNICAL = "NON_TECHNICAL"


class Skill(Entity):
    __tablename__ = "skills"

    name: Mapped[str] = mapped_column(Text, nullable=False)
    type: Mapped[SkillType] = mapped_column(SQLEnum(SkillType), nullable=False)

    employee_skills = relationship(
        "EmployeeSkill", back_populates="skill", cascade="all, delete-orphan"
    )

    stack_requests = relationship(
        "ProjectStackRequirementRequest", back_populates="stack"
    )
