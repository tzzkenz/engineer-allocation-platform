from models import Entity

from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import (
    Boolean,
    CheckConstraint,
    ForeignKey,
    Integer,
    UniqueConstraint,
    false,
)


class EmployeeSkill(Entity):
    __tablename__ = "employee_skills"

    employee_id: Mapped[int] = mapped_column(
        ForeignKey("employees.id"), nullable=False, index=True
    )
    skill_id: Mapped[int] = mapped_column(
        ForeignKey("skills.id"), nullable=False, index=True
    )

    proficiency: Mapped[int] = mapped_column(Integer, nullable=False)
    is_interest: Mapped[bool] = mapped_column(
        Boolean, nullable=False, server_default=false()
    )

    employee = relationship("Employee", back_populates="employee_skills")
    skill = relationship("Skill", back_populates="employee_skills")

    __table_args__ = (
        UniqueConstraint("employee_id", "skill_id", name="uq_employee_stack"),
        CheckConstraint("proficiency BETWEEN 0 AND 5", name="ck_proficiency_range"),
    )
