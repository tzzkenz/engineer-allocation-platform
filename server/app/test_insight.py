import asyncio
from unittest.mock import MagicMock
from features.agent.agent import make_llm
from features.insights.services import InsightService

SUMMARY_SYSTEM_PROMPT = """
You are an HR staffing analyst for KeyValue. Given structured JSON data about
engineer utilization, rotation needs, and skill gaps, write a concise report
with three short sections: Underutilization, Rotation, Upskilling. Flag the
top 2-3 risks in each. Be specific, reference employee/project IDs, no fluff.
"""

DUMMY_METRICS = {
    "underutilized": [
        {"employee_id": 3, "name": "Amal Thomas", "active_projects": 0},
        {"employee_id": 7, "name": "Kenz E S", "active_projects": 1},
    ],
    "rotation_candidates": [
        {
            "employee_id": 5,
            "project_name": "Engineer Allocation",
            "days_on_project": 132,
        },
    ],
    "skill_gaps": [
        {
            "project_id": 2,
            "role_id": 4,
            "unmet_count": 1,
            "skill_ids": [11],
            "qualified_employees_available": 0,
            "upskilling_candidates": [3, 6],
        }
    ],
}


async def main():
    # repo isn't needed for this call, so a mock is fine
    service = InsightService(repo=MagicMock(), llm=make_llm())
    summary = await service._generate_summary(DUMMY_METRICS)
    print(summary)


if __name__ == "__main__":
    asyncio.run(main())
