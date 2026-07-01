from langchain_groq import ChatGroq
from langchain.agents import create_agent
from langgraph.checkpoint.memory import InMemorySaver

from core.config import settings
from features.agent.tools.employee_tools import make_employees_tools
from features.employee.service import EmployeeService


SYSTEM_PROMPT = """
You are a helpful assistant for KeyValue
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


def make_agent(employee_service: EmployeeService):

    tools = make_employees_tools(employee_service)

    return create_agent(
        model=make_llm(),
        system_prompt=SYSTEM_PROMPT,
        tools=tools,
        checkpointer=checkpointer,
    )
