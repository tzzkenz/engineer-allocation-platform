from datetime import date, datetime
from pydantic import BaseModel, ConfigDict


class InsightReportResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int | None = None
    period_start: date
    period_end: date
    metrics_json: str
    summary_text: str
    generated_by: str
    created_at: datetime | None = None
