from datetime import date
from pydantic import BaseModel


class EngineerUtilization(BaseModel):
    employee_id: int
    name: str
    active_real_projects: int
    active_shadow_assignments: int
    status: str


class RotationCandidate(BaseModel):
    employee_id: int
    project_id: int
    date_assigned: date
    days_on_project: int


class UpskillingGap(BaseModel):
    skill_id: int
    skill_name: str
    demand: int
    supply: int
    gap: int


class PeriodicInsights(BaseModel):
    underutilized: list[EngineerUtilization]
    rotation_candidates: list[RotationCandidate]
    upskilling_gaps: list[UpskillingGap]
