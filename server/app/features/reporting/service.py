from datetime import date, timedelta

from features.reporting.repository import ReportingRepository
from features.reporting.schemas import (
    EngineerUtilization,
    PeriodicInsights,
    RotationCandidate,
    UpskillingGap,
)


class ReportingService:
    def __init__(self, repository: ReportingRepository):
        self.repository = repository

    async def get_engineer_utilization(self) -> list[EngineerUtilization]:
        active_assignments = await self.repository.get_active_assignments()

        counts: dict[int, dict] = {}
        for a in active_assignments:
            c = counts.setdefault(a.employee_id, {"real": 0, "shadow": 0})
            c["shadow" if a.is_shadow else "real"] += 1

        employees = await self.repository.get_all_employees()
        result = []
        for emp in employees:
            c = counts.get(emp.id, {"real": 0, "shadow": 0})
            real = c["real"]
            status = (
                "idle"
                if real == 0
                else ("has_capacity" if real == 1 else "at_capacity")
            )
            result.append(
                EngineerUtilization(
                    employee_id=emp.id,
                    name=emp.name,
                    active_real_projects=real,
                    active_shadow_assignments=c["shadow"],
                    status=status,
                )
            )
        return result

    async def get_underutilized_engineers(self) -> list[EngineerUtilization]:
        util = await self.get_engineer_utilization()
        return [e for e in util if e.status in ("idle", "has_capacity")]

    async def get_rotation_candidates(
        self, threshold_days: int = 90
    ) -> list[RotationCandidate]:
        cutoff = date.today() - timedelta(days=threshold_days)
        assignments = await self.repository.get_long_tenured_assignments(cutoff)
        return [
            RotationCandidate(
                employee_id=a.employee_id,
                project_id=a.project_id,
                date_assigned=a.date_assigned,
                days_on_project=(date.today() - a.date_assigned).days,
            )
            for a in assignments
        ]

    async def get_upskilling_gaps(
        self, min_proficiency: int = 0
    ) -> list[UpskillingGap]:
        demand = dict(await self.repository.get_skill_demand_counts())
        supply = dict(await self.repository.get_skill_supply_counts(min_proficiency))
        skills = await self.repository.get_all_skills()

        gaps = []
        for skill_id, needed in demand.items():
            have = supply.get(skill_id, 0)
            if needed > have:
                gaps.append(
                    UpskillingGap(
                        skill_id=skill_id,
                        skill_name=skills.get(skill_id, "Unknown"),
                        demand=needed,
                        supply=have,
                        gap=needed - have,
                    )
                )
        return sorted(gaps, key=lambda g: g.gap, reverse=True)

    async def generate_periodic_insights(self) -> PeriodicInsights:
        return PeriodicInsights(
            underutilized=await self.get_underutilized_engineers(),
            rotation_candidates=await self.get_rotation_candidates(),
            upskilling_gaps=await self.get_upskilling_gaps(),
        )
