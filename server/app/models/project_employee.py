from datetime import date

from models import Entity
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Boolean, CheckConstraint, Date, ForeignKey
from sqlalchemy.sql.expression import false


class ProjectEmployee(Entity):
    __tablename__ = "project_employees"

    project_id: Mapped[int] = mapped_column(
        ForeignKey("projects.id"), nullable=False, index=True
    )

    employee_id: Mapped[int] = mapped_column(
        ForeignKey("employees.id"), nullable=False, index=True
    )

    project_role_id: Mapped[int] = mapped_column(
        ForeignKey("project_roles.id"), nullable=False, index=True
    )

    is_shadow: Mapped[bool] = mapped_column(
        Boolean, nullable=False, server_default=false()
    )

    date_assigned: Mapped[date] = mapped_column(Date, nullable=False)

    start_date: Mapped[date | None] = mapped_column(Date, nullable=True)

    date_exited: Mapped[date | None] = mapped_column(Date, nullable=True)

    requirement_request_id: Mapped[int | None] = mapped_column(
        ForeignKey("project_requirement_requests.id"), nullable=True, index=True
    )

    project = relationship("Project", back_populates="project_employees")
    employee = relationship("Employee", back_populates="project_employees")
    project_role = relationship("ProjectRole", back_populates="project_employees")

    project_requirement_request = relationship(
        "ProjectRequirementRequest", back_populates="assigned_employees"
    )

    __table_args__ = (
        CheckConstraint(
            "date_exited IS NULL OR date_exited >= date_assigned",
            name="ck_exit_after_assign",
        ),
    )
