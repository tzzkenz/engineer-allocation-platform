from app.models import Entity

from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import CheckConstraint, ForeignKey, Integer, UniqueConstraint


class EmployeeStack(Entity):
    __tablename__ = "employee_stacks"

    employee_id: Mapped[int] = mapped_column(
        ForeignKey("employees.id"), nullable=False, index=True
    )
    stack_id: Mapped[int] = mapped_column(
        ForeignKey("stacks.id"), nullable=False, index=True
    )

    proficiency: Mapped[int] = mapped_column(Integer, nullable=False)
    interest: Mapped[int] = mapped_column(Integer, nullable=False)

    employee = relationship("Employee", back_populates="employee_stacks")
    stack = relationship("Stack", back_populates="employee_stacks")

    __table_args__ = (
        UniqueConstraint("employee_id", "stack_id", name="uq_employee_stack"),
        CheckConstraint("proficiency BETWEEN 0 AND 5", name="ck_proficiency_range"),
        CheckConstraint("interest BETWEEN 0 AND 5", name="ck_interest_range"),
    )
