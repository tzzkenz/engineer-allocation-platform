import enum

from models import Entity

from sqlalchemy import Enum as SQLEnum, ForeignKey, Integer, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship


class ActionType(enum.Enum):
    CREATE = "CREATE"
    UPDATE = "UPDATE"
    DELETE = "DELETE"


class EntityName(enum.Enum):
    EMPLOYEE = "EMPLOYEE"
    PROJECT = "PROJECT"
    PROJECT_EMPLOYEE = "PROJECT_EMPLOYEE"
    PROJECT_REQUIREMENT = "PROJECT_REQUIREMENT"
    PROJECT_REQUIREMENT_REQUEST = "PROJECT_REQUIREMENT_REQUEST"
    FEEDBACK = "FEEDBACK"
    EMPLOYEE_STACK = "EMPLOYEE_STACK"


class AuditLog(Entity):
    __tablename__ = "audit_logs"

    entity_name: Mapped[EntityName] = mapped_column(SQLEnum(EntityName), nullable=False)
    entity_id: Mapped[int] = mapped_column(Integer, nullable=False)
    action: Mapped[ActionType] = mapped_column(SQLEnum(ActionType), nullable=False)
    field_name: Mapped[str] = mapped_column(Text, nullable=True)
    old_value: Mapped[str] = mapped_column(Text, nullable=True)
    new_value: Mapped[str] = mapped_column(Text, nullable=True)
    changed_by_id: Mapped[int] = mapped_column(
        ForeignKey("employees.id"), nullable=False, index=True
    )

    changed_by = relationship("Employee", back_populates="audit_logs")
