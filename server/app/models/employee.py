from datetime import date

from models import Entity

from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Date, ForeignKey, Integer, Text


class Employee(Entity):
    __tablename__ = "employees"

    name: Mapped[str] = mapped_column(Text, nullable=False)
    email: Mapped[str] = mapped_column(Text, nullable=False, unique=True)
    experience: Mapped[int] = mapped_column(Integer, nullable=False)
    date_of_joining: Mapped[date] = mapped_column(Date, nullable=False)
    password_hash: Mapped[str] = mapped_column(Text, nullable=False)
    system_role_id: Mapped[int] = mapped_column(ForeignKey("system_roles.id"))

    role = relationship("SystemRole", back_populates="employees")
    audit_logs = relationship("AuditLog", back_populates="changed_by")

    employee_stacks = relationship(
        "EmployeeSkill", back_populates="employee", cascade="all, delete-orphan"
    )

    employee_skills = relationship(
        "EmployeeSkill", back_populates="employee", cascade="all, delete-orphan"
    )

    feedbacks = relationship("Feedback", back_populates="creator")

    project_employees = relationship("ProjectEmployee", back_populates="employee")

    requested_requests = relationship(
        "ProjectRequirementRequest",
        foreign_keys="[ProjectRequirementRequest.requested_by]",
        back_populates="requested_by_employee",
    )

    resolved_requests = relationship(
        "ProjectRequirementRequest",
        foreign_keys="[ProjectRequirementRequest.resolved_by]",
        back_populates="resolved_by_employee",
    )
