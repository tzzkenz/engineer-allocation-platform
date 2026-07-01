from langchain_groq import ChatGroq
from langchain.agents import create_agent
from langgraph.checkpoint.memory import InMemorySaver

from core.config import settings
from features.agent.tools.employee_tools import make_employees_tools
from features.employee.service import EmployeeService
from features.agent.tools.project_tools import make_project_tools
from features.project.service import ProjectService


SYSTEM_PROMPT = """
You are an internal assistant for KeyValue, an engineer allocation platform.

Your responsibilities:
- Help users find employees and projects
- Use tools whenever data is required (DO NOT guess)
- Always return structured, clear responses

Rules:
- Be concise and professional
- Never hallucinate data
- Always use tools when data is required.
- Tool responses are in this format:
  {
    "success": boolean,
    "data": ...,
    "error": string | null
  }

- If success is false:
  - Do NOT crash
  - Inform the user politely
  - Suggest retrying or refining the query

- Never expose raw errors directly unless necessary.
"""


def make_llm():
    return ChatGroq(
        api_key=settings.groq_api_key,
        model="openai/gpt-oss-120b",
        temperature=0,
        max_retries=2,
    )


checkpointer = InMemorySaver()


def make_agent(employee_service: EmployeeService, project_service: ProjectService):

    tools = make_employees_tools(employee_service)
    tools += make_project_tools(project_service)

    return create_agent(
        model=make_llm(),
        system_prompt=SYSTEM_PROMPT,
        tools=tools,
        checkpointer=checkpointer,
    )
