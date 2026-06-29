from sqlalchemy import Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from models import Entity


class SystemRole(Entity):
    __tablename__ = "system_roles"

    name: Mapped[str] = mapped_column(Text, nullable=False)
    employees = relationship("Employee", back_populates="role")
