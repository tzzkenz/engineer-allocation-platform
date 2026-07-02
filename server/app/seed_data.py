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
# Level 0
# ---------------------------------------------------------------------------


async def seed_system_roles(session: AsyncSession):
    names = ["Admin", "Manager", "Employee", "HR"]  # HR added
    result = await session.execute(select(SystemRole))
    existing = {r.name: r for r in result.scalars().all()}

    for name in names:
        if name not in existing:
            role = SystemRole(name=name)
            session.add(role)
            existing[name] = role

    await session.flush()
    return existing


async def seed_skills(session: AsyncSession):
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


async def seed_project_roles(session: AsyncSession):
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
# Employees
# ---------------------------------------------------------------------------


async def seed_employees(session, system_roles, count=100):  # 100 employees
    result = await session.execute(select(Employee))
    existing = {e.email: e for e in result.scalars().all()}

    role_names = list(system_roles.keys())

    for _ in range(count):
        email = fake.unique.company_email()
        if email in existing:
            continue

        joined = fake.date_between(start_date="-4y", end_date="-1M")

        # weighted role distribution
        role = random.choices(
            population=role_names,
            weights=[1, 2, 5, 2],  # Admin, Manager, Employee, HR
            k=1,
        )[0]

        employee = Employee(
            name=fake.name(),
            email=email,
            experience=random.randint(0, 15),
            date_of_joining=joined,
            end_date=None,
            password_hash=hash_password("Password123!"),
            system_role_id=system_roles[role].id,
        )

        session.add(employee)
        existing[email] = employee

    await session.flush()
    return existing


# ---------------------------------------------------------------------------
# Relationships
# ---------------------------------------------------------------------------


async def seed_employee_skills(session, employees, skills):
    result = await session.execute(select(EmployeeSkill))
    existing_pairs = {(es.employee_id, es.skill_id) for es in result.scalars().all()}

    skill_list = list(skills.values())

    for employee in employees.values():
        chosen = random.sample(skill_list, k=min(7, len(skill_list)))  # more skills

        for skill in chosen:
            if (employee.id, skill.id) in existing_pairs:
                continue

            session.add(
                EmployeeSkill(
                    employee_id=employee.id,
                    skill_id=skill.id,
                    proficiency=random.randint(1, 5),
                    is_interest=random.random() < 0.2,
                )
            )

            existing_pairs.add((employee.id, skill.id))

    await session.flush()


async def seed_projects(session, count=25):  # more projects
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


async def seed_project_stacks(session, projects, skills):
    stack_skills = [s for s in skills.values() if s.type == SkillType.STACK]

    result = await session.execute(select(ProjectStacks))
    existing_pairs = {(ps.project_id, ps.skill_id) for ps in result.scalars().all()}

    for project in projects.values():
        chosen = random.sample(stack_skills, k=min(4, len(stack_skills)))  # more stacks

        for skill in chosen:
            if (project.id, skill.id) in existing_pairs:
                continue

            session.add(ProjectStacks(project_id=project.id, skill_id=skill.id))
            existing_pairs.add((project.id, skill.id))

    await session.flush()


async def seed_requirement_requests(session, projects, project_roles, employees):
    role_list = list(project_roles.values())
    employee_list = list(employees.values())

    requests = []

    for project in projects.values():
        for role in random.sample(role_list, k=min(3, len(role_list))):  # more roles
            requester = random.choice(employee_list)

            req = ProjectRequirementRequest(
                project_id=project.id,
                project_role_id=role.id,
                requested_count=random.randint(2, 5),
                assigned_count=0,
                requested_by=requester.id,
                status=random.choice(list(RequestStatus)),
            )

            session.add(req)
            requests.append(req)

    await session.flush()
    return requests


async def seed_project_employees(session, projects, employees, project_roles):
    role_list = list(project_roles.values())
    employee_list = list(employees.values())

    # Weight role selection so engineering roles (Backend/Frontend/QA Engineer)
    # make up a clear majority of each project's assigned employees.
    engineer_names = {"Backend Engineer", "Frontend Engineer", "QA Engineer"}
    role_weights = [3 if role.name in engineer_names else 1 for role in role_list]

    for project in projects.values():
        team_size = random.randint(6, 12)  # bigger teams
        team = random.sample(employee_list, k=min(team_size, len(employee_list)))

        for employee in team:
            assigned = fake.date_between(
                start_date=project.start_date or date.today(), end_date="today"
            )

            chosen_role = random.choices(
                population=role_list, weights=role_weights, k=1
            )[0]

            session.add(
                ProjectEmployee(
                    project_id=project.id,
                    employee_id=employee.id,
                    project_role_id=chosen_role.id,
                    is_shadow=random.random() < 0.1,
                    date_assigned=assigned,
                    start_date=assigned,
                )
            )

    await session.flush()


async def seed_stack_requirement_requests(session, requests, skills):
    stack_skills = [s for s in skills.values() if s.type == SkillType.STACK]

    for req in requests:
        for skill in random.sample(stack_skills, k=min(2, len(stack_skills))):
            session.add(
                ProjectStackRequirementRequest(
                    project_requirement_request_id=req.id,
                    stack_id=skill.id,
                )
            )

    await session.flush()


async def seed_feedbacks(session, projects, employees):
    employee_list = list(employees.values())

    for project in projects.values():
        for _ in range(random.randint(3, 6)):  # more feedback
            session.add(
                Feedback(
                    project_id=project.id,
                    created_by=random.choice(employee_list).id,
                    feedback_type=random.choice(list(FeedbackType)),
                    note=fake.sentence(nb_words=12),
                )
            )

    await session.flush()


async def seed_audit_logs(session, employees):
    employee_list = list(employees.values())

    for employee in random.sample(
        employee_list, k=min(15, len(employee_list))
    ):  # more logs
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
# RUN
# ---------------------------------------------------------------------------


async def run():
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
