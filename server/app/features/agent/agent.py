"""
Agent construction.

The agent is built per-request (via `make_agent`) rather than as a
module-level singleton, because the tools it uses are bound to a
request-scoped EmployeeService whose `repo` holds a DB session tied to
the current request. Building it once at import time would either leak
that session across requests or fail once the session is closed.

The LLM client itself (`make_llm`) and the checkpointer are safe to keep
at module scope since they hold no per-request state.
"""

from langchain_groq import ChatGroq
from langchain.agents import create_agent
from langgraph.checkpoint.memory import InMemorySaver

from core.config import settings
from features.agent.tools import build_employee_tools
from features.employee.service import EmployeeService
from features.project.service import ProjectService
from features.agent.tools.project_tools import build_project_tools

SYSTEM_PROMPT = """
You are a helpful assistant for the Engineer Allocation Platform.

You can look up employees, their skills, and project staffing/status to
answer HR and lead queries about availability, skillsets, allocations,
and project health (understaffed/overstaffed, nearing completion,
rotation candidates).

Rules:
- Only use the tools provided to answer questions. Never invent or guess
  employee or project data.
- If a tool returns an authorization error, tell the user plainly that they
  don't have permission to see that information rather than working around it.
- Keep answers concise and specific (names, IDs, dates, counts) rather than
  vague summaries when the user asks a factual question.
"""


def make_llm():
    """Create the Groq LLM instance."""
    return ChatGroq(
        api_key=settings.groq_api_key,
        model="openai/gpt-oss-120b",
        temperature=0,
        max_retries=2,
    )


checkpointer = InMemorySaver()


def make_agent(
    employee_service: EmployeeService,
    project_service: ProjectService,
    requesting_role: str | None = None,
):
    tools = build_employee_tools(employee_service, requesting_role=requesting_role)
    tools += build_project_tools(project_service, requesting_role=requesting_role)

    return create_agent(
        model=make_llm(),
        tools=tools,
        system_prompt=SYSTEM_PROMPT,
        checkpointer=checkpointer,
    )
