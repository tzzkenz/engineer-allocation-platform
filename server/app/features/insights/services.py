import json
from datetime import date
from typing import Any

from exceptions import NotFoundException
from models.insight_report import InsightReport
from features.insights.repository import InsightRepository

SUMMARY_SYSTEM_PROMPT = """
You are an HR staffing analyst for KeyValue. Given structured JSON data about
engineer utilization, rotation needs, and skill gaps, write a concise report
with three short sections: Underutilization, Rotation, Upskilling. Flag the
top 2-3 risks in each. Be specific, reference employee/project IDs, no fluff.
"""


class InsightService:
    def __init__(self, repo: InsightRepository, llm):
        self.repo = repo
        self.llm = llm  # pass in the same ChatGroq instance used by the agent

    async def _get_underutilized_employees(self) -> list[dict[str, Any]]:
        active_counts = await self.repo.get_active_project_counts()
        employees = await self.repo.get_active_employees()

        return [
            {
                "employee_id": emp.id,
                "name": emp.name,
                "active_projects": active_counts.get(emp.id, 0),
            }
            for emp in employees
            if active_counts.get(emp.id, 0) < 2
        ]

    async def _get_rotation_candidates(self) -> list[dict[str, Any]]:
        rows = await self.repo.get_stale_assignments()
        return [
            {
                "employee_id": pe.employee_id,
                "project_name": project_name,
                "days_on_project": (date.today() - pe.date_assigned).days,
            }
            for pe, project_name in rows
        ]

    async def _get_skill_gaps(self) -> list[dict[str, Any]]:
        open_requests = await self.repo.get_open_requirement_requests()

        gaps = []
        for req in open_requests:
            stack_ids = [sr.stack_id for sr in req.stack_requests]
            if not stack_ids:
                continue

            qualified_count = await self.repo.count_qualified_employees(stack_ids)
            upskilling_candidates = (
                await self.repo.get_interested_low_proficiency_employees(stack_ids)
            )

            gaps.append(
                {
                    "project_id": req.project_id,
                    "role_id": req.project_role_id,
                    "unmet_count": req.requested_count - req.assigned_count,
                    "skill_ids": stack_ids,
                    "qualified_employees_available": qualified_count,
                    "upskilling_candidates": upskilling_candidates,
                }
            )
        return gaps

    async def compute_metrics(self) -> dict[str, Any]:
        return {
            "underutilized": await self._get_underutilized_employees(),
            "rotation_candidates": await self._get_rotation_candidates(),
            "skill_gaps": await self._get_skill_gaps(),
        }

    async def _generate_summary(self, metrics: dict[str, Any]) -> str:
        messages = [
            ("system", SUMMARY_SYSTEM_PROMPT),
            ("user", json.dumps(metrics, default=str)),
        ]
        response = await self.llm.ainvoke(messages)
        return response.content

    async def generate_report(self, generated_by: str = "system") -> InsightReport:
        metrics = await self.compute_metrics()
        summary = await self._generate_summary(metrics)

        report = await self.repo.create_report(
            {
                "period_start": date.today().replace(day=1),
                "period_end": date.today(),
                "metrics_json": json.dumps(metrics, default=str),
                "summary_text": summary,
                "generated_by": generated_by,
            }
        )
        await self.repo.db.commit()
        await self.repo.db.refresh(report)
        return report

    async def get_latest_report(self) -> InsightReport:
        report = await self.repo.get_latest_report()
        if report is None:
            raise NotFoundException("No insight report has been generated yet")
        return report
