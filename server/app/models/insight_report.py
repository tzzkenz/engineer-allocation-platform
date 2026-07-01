from datetime import date

from models import Entity
from sqlalchemy import Date, Text
from sqlalchemy.orm import Mapped, mapped_column


class InsightReport(Entity):
    __tablename__ = "insight_reports"

    period_start: Mapped[date] = mapped_column(Date, nullable=False)
    period_end: Mapped[date] = mapped_column(Date, nullable=False)
    metrics_json: Mapped[str] = mapped_column(Text, nullable=False)
    summary_text: Mapped[str] = mapped_column(Text, nullable=True)
    generated_by: Mapped[str] = mapped_column(Text, nullable=False, default="system")
