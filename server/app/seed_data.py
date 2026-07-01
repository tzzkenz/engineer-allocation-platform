"""
Seed data script (async SQLAlchemy).

USAGE:
    python seed_data.py

ASSUMPTIONS:
    - `core.database` (adjust path if different) exposes `AsyncSessionLocal`,
      an `async_sessionmaker(engine, ...)`.
    - Passwords are hashed with passlib's bcrypt. Swap `hash_password` for
      whatever your auth module already uses if you have one, so seeded
      users can actually log in through your real auth flow.

DESIGN NOTES:
    - Seeding happens in FK-dependency order (parents before children):
      SystemRole, Skill, ProjectRole  ->  Employee  ->  EmployeeSkill,
      Project  ->  ProjectStacks, ProjectRequirementRequest  ->
      ProjectEmployee, ProjectStackRequirementRequest  ->  Feedback  ->
      AuditLog.
    - Each `seed_*` function is idempotent: it checks (via `select`) whether
      data already exists (by a natural key like name/email, or FK pair)
      before inserting, so you can re-run this safely against a dev DB.
    - Each function returns a dict keyed by a human-readable name so later
      functions can look up the right FK id without re-querying.
    - Uses Faker for realistic filler data.
"""

import asyncio
import random
from datetime import date
import bcrypt
from faker import Faker
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import AsyncSessionLocal

from models import (
    SystemRole,
    Skill,
    ProjectRole,
    Employee,
    EmployeeSkill,
    Project,
    ProjectStacks,
    ProjectRequirementRequest,
    ProjectEmployee,
    ProjectStackRequirementRequest,
    Feedback,
    AuditLog,
)
from models.skill import SkillType
from models.audit_log import ActionType, EntityName
from models.feedback import FeedbackType
from models.project import StatusType
from models.project_requirement_request import RequestStatus

fake = Faker()
random.seed(42)
Faker.seed(42)


def hash_password(raw: str) -> str:
    return bcrypt.hashpw(raw.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


async def _count(session: AsyncSession, model) -> int:
    result = await session.execute(select(func.count()).select_from(model))
    return result.scalar_one()


# ---------------------------------------------------------------------------
# Level 0: no FK dependencies
# ---------------------------------------------------------------------------


async def seed_system_roles(session: AsyncSession) -> dict[str, SystemRole]:
    names = ["Admin", "Manager", "Employee"]
    result = await session.execute(select(SystemRole))
    existing = {r.name: r for r in result.scalars().all()}

    for name in names:
        if name not in existing:
            role = SystemRole(name=name)
            session.add(role)
            existing[name] = role
    await session.flush()
    return existing


async def seed_skills(session: AsyncSession) -> dict[str, Skill]:
    catalog = {
        SkillType.STACK: [
            "Python",
            "React",
            "PostgreSQL",
            "Docker",
            "AWS",
            "TypeScript",
        ],
        SkillType.TECHNICAL: ["System Design", "API Design", "Testing", "Debugging"],
        SkillType.NON_TECHNICAL: ["Communication", "Leadership", "Mentoring"],
    }
    result = await session.execute(select(Skill))
    existing = {s.name: s for s in result.scalars().all()}

    for skill_type, names in catalog.items():
        for name in names:
            if name not in existing:
                skill = Skill(name=name, type=skill_type)
                session.add(skill)
                existing[name] = skill
    await session.flush()
    return existing


async def seed_project_roles(session: AsyncSession) -> dict[str, ProjectRole]:
    names = [
        "Tech Lead",
        "Backend Engineer",
        "Frontend Engineer",
        "QA Engineer",
        "Project Manager",
    ]
    result = await session.execute(select(ProjectRole))
    existing = {r.name: r for r in result.scalars().all()}

    for name in names:
        if name not in existing:
            role = ProjectRole(name=name)
            session.add(role)
            existing[name] = role
    await session.flush()
    return existing


# ---------------------------------------------------------------------------
# Level 1: depends on Level 0
# ---------------------------------------------------------------------------


async def seed_employees(
    session: AsyncSession, system_roles: dict[str, SystemRole], count: int = 60
) -> dict[str, Employee]:
    result = await session.execute(select(Employee))
    existing = {e.email: e for e in result.scalars().all()}
    role_names = list(system_roles.keys())

    for _ in range(count):
        email = fake.unique.company_email()
        if email in existing:
            continue
        joined = fake.date_between(start_date="-4y", end_date="-1M")
        employee = Employee(
            name=fake.name(),
            email=email,
            experience=random.randint(0, 15),
            date_of_joining=joined,
            end_date=None,
            password_hash=hash_password("Password123!"),
            system_role_id=system_roles[random.choice(role_names)].id,
        )
        session.add(employee)
        existing[email] = employee
    await session.flush()
    return existing


# ---------------------------------------------------------------------------
# Level 2: depends on Employee / Skill
# ---------------------------------------------------------------------------


async def seed_employee_skills(
    session: AsyncSession, employees: dict[str, Employee], skills: dict[str, Skill]
) -> None:
    result = await session.execute(select(EmployeeSkill))
    existing_pairs = {(es.employee_id, es.skill_id) for es in result.scalars().all()}
    skill_list = list(skills.values())

    for employee in employees.values():
        chosen = random.sample(skill_list, k=min(5, len(skill_list)))
        for skill in chosen:
            if (employee.id, skill.id) in existing_pairs:
                continue
            session.add(
                EmployeeSkill(
                    employee_id=employee.id,
                    skill_id=skill.id,
                    proficiency=random.randint(1, 5),
                    is_interest=random.random() < 0.15,
                )
            )
            existing_pairs.add((employee.id, skill.id))
    await session.flush()


async def seed_projects(session: AsyncSession, count: int = 8) -> dict[str, Project]:
    result = await session.execute(select(Project))
    existing = {p.name: p for p in result.scalars().all()}
    statuses = list(StatusType)

    for _ in range(count):
        name = f"{fake.catch_phrase()} Project"
        if name in existing:
            continue
        start = fake.date_between(start_date="-1y", end_date="today")
        project = Project(
            name=name,
            status=random.choice(statuses),
            start_date=start,
            duration=random.choice([30, 60, 90, 120, 180]),
            end_date=None,
        )
        session.add(project)
        existing[name] = project
    await session.flush()
    return existing


# ---------------------------------------------------------------------------
# Level 3: depends on Project / Skill / ProjectRole / Employee
# ---------------------------------------------------------------------------


async def seed_project_stacks(
    session: AsyncSession, projects: dict[str, Project], skills: dict[str, Skill]
) -> None:
    stack_skills = [s for s in skills.values() if s.type == SkillType.STACK]
    result = await session.execute(select(ProjectStacks))
    existing_pairs = {(ps.project_id, ps.skill_id) for ps in result.scalars().all()}

    for project in projects.values():
        chosen = random.sample(stack_skills, k=min(3, len(stack_skills)))
        for skill in chosen:
            if (project.id, skill.id) in existing_pairs:
                continue
            session.add(ProjectStacks(project_id=project.id, skill_id=skill.id))
            existing_pairs.add((project.id, skill.id))
    await session.flush()


async def seed_requirement_requests(
    session: AsyncSession,
    projects: dict[str, Project],
    project_roles: dict[str, ProjectRole],
    employees: dict[str, Employee],
) -> list[ProjectRequirementRequest]:
    if await _count(session, ProjectRequirementRequest) > 0:
        result = await session.execute(select(ProjectRequirementRequest))
        return list(result.scalars().all())

    role_list = list(project_roles.values())
    employee_list = list(employees.values())
    requests = []

    for project in projects.values():
        for role in random.sample(role_list, k=min(2, len(role_list))):
            requester = random.choice(employee_list)
            status = random.choice(list(RequestStatus))
            req = ProjectRequirementRequest(
                project_id=project.id,
                project_role_id=role.id,
                requested_count=random.randint(1, 3),
                assigned_count=0,
                requested_by=requester.id,
                resolved_by=requester.id if status != RequestStatus.PENDING else None,
                resolved_at=None,
                status=status,
            )
            session.add(req)
            requests.append(req)
    await session.flush()
    return requests


# ---------------------------------------------------------------------------
# Level 4: depends on Level 3
# ---------------------------------------------------------------------------


async def seed_project_employees(
    session: AsyncSession,
    projects: dict[str, Project],
    employees: dict[str, Employee],
    project_roles: dict[str, ProjectRole],
) -> None:
    if await _count(session, ProjectEmployee) > 0:
        return

    role_list = list(project_roles.values())
    employee_list = list(employees.values())

    for project in projects.values():
        team_size = random.randint(4, 8)
        team = random.sample(employee_list, k=min(team_size, len(employee_list)))
        for employee in team:
            assigned = fake.date_between(
                start_date=project.start_date or date.today(), end_date="today"
            )
            session.add(
                ProjectEmployee(
                    project_id=project.id,
                    employee_id=employee.id,
                    project_role_id=random.choice(role_list).id,
                    is_shadow=random.random() < 0.1,
                    date_assigned=assigned,
                    start_date=assigned,
                    date_exited=None,
                )
            )
    await session.flush()


async def seed_stack_requirement_requests(
    session: AsyncSession,
    requests: list[ProjectRequirementRequest],
    skills: dict[str, Skill],
) -> None:
    stack_skills = [s for s in skills.values() if s.type == SkillType.STACK]
    result = await session.execute(select(ProjectStackRequirementRequest))
    existing_pairs = {
        (r.project_requirement_request_id, r.stack_id) for r in result.scalars().all()
    }

    for req in requests:
        for skill in random.sample(stack_skills, k=min(2, len(stack_skills))):
            if (req.id, skill.id) in existing_pairs:
                continue
            session.add(
                ProjectStackRequirementRequest(
                    project_requirement_request_id=req.id,
                    stack_id=skill.id,
                )
            )
            existing_pairs.add((req.id, skill.id))
    await session.flush()


async def seed_feedbacks(
    session: AsyncSession, projects: dict[str, Project], employees: dict[str, Employee]
) -> None:
    if await _count(session, Feedback) > 0:
        return

    employee_list = list(employees.values())
    for project in projects.values():
        for _ in range(random.randint(1, 3)):
            session.add(
                Feedback(
                    project_id=project.id,
                    created_by=random.choice(employee_list).id,
                    feedback_type=random.choice(list(FeedbackType)),
                    note=fake.sentence(nb_words=12),
                )
            )
    await session.flush()


async def seed_audit_logs(
    session: AsyncSession, employees: dict[str, Employee]
) -> None:
    if await _count(session, AuditLog) > 0:
        return

    employee_list = list(employees.values())
    for employee in random.sample(employee_list, k=min(5, len(employee_list))):
        session.add(
            AuditLog(
                entity_name=EntityName.EMPLOYEE,
                entity_id=employee.id,
                action=ActionType.UPDATE,
                field_name="experience",
                old_value=str(max(employee.experience - 1, 0)),
                new_value=str(employee.experience),
                changed_by_id=employee.id,
            )
        )
    await session.flush()


# ---------------------------------------------------------------------------
# Orchestration
# ---------------------------------------------------------------------------


async def run() -> None:
    async with AsyncSessionLocal() as session:
        try:
            system_roles = await seed_system_roles(session)
            skills = await seed_skills(session)
            project_roles = await seed_project_roles(session)

            employees = await seed_employees(session, system_roles)
            await seed_employee_skills(session, employees, skills)

            projects = await seed_projects(session)
            await seed_project_stacks(session, projects, skills)
            requests = await seed_requirement_requests(
                session, projects, project_roles, employees
            )

            await seed_project_employees(session, projects, employees, project_roles)
            await seed_stack_requirement_requests(session, requests, skills)
            await seed_feedbacks(session, projects, employees)
            await seed_audit_logs(session, employees)

            await session.commit()
            print("Seed data created successfully.")
        except Exception:
            await session.rollback()
            raise


if __name__ == "__main__":
    asyncio.run(run())
