from langchain_groq import ChatGroq
from langchain.agents import create_agent
from langgraph.checkpoint.memory import InMemorySaver

from core.config import settings
from features.agent.tools import build_employee_tools
from features.employee.service import EmployeeService

SYSTEM_PROMPT = """
You are a helpful assistant for the Engineer Allocation Platform.

You can look up employees and their skills to answer HR and lead queries
about availability, skillsets, and staffing.

Rules:
- Only use the tools provided to answer questions about employees, skills,
  or allocations. Never invent or guess employee data.
- If a tool returns an authorization error, tell the user plainly that they
  don't have permission to see that information rather than working around it.
- Keep answers concise and specific (names, IDs, skill levels) rather than
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


def make_agent(employee_service: EmployeeService, requesting_role: str | None = None):
    """
    Build an agent instance bound to the given (request-scoped) services.

    Add further `build_*_tools(...)` calls here as you introduce more
    services (projects, allocations, etc.) and concatenate their tool lists.
    """
    tools = build_employee_tools(employee_service, requesting_role=requesting_role)

    return create_agent(
        model=make_llm(),
        tools=tools,
        system_prompt=SYSTEM_PROMPT,
        checkpointer=checkpointer,
    )
