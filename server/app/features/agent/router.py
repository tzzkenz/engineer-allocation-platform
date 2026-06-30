"""
Chat endpoint for the AI assistant.

Assumes you already have:
  - a `get_employee_service` dependency that yields a request-scoped
    EmployeeService (DB session per request)
  - a `get_current_user` dependency that yields the authenticated user,
    used both for the thread_id (so conversation memory is per-user) and
    for role-based tool authorization
"""

from fastapi import APIRouter, Depends
from pydantic import BaseModel

from features.agent.agent import make_agent
from core.dependencies import get_employee_service, get_project_service
from features.auth.dependencies import get_current_user

router = APIRouter(prefix="/agent", tags=["agent"])


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    response: str


@router.post("/chat", response_model=ChatResponse)
async def chat(
    payload: ChatRequest,
    employee_service=Depends(get_employee_service),
    project_service=Depends(get_project_service),
    current_user=Depends(get_current_user),
):
    agent = make_agent(
        employee_service,
        project_service,
        requesting_role=current_user.system_role_id,
    )

    result = await agent.ainvoke(
        {"messages": [{"role": "user", "content": payload.message}]},
        config={"configurable": {"thread_id": f"employee-{current_user.id}"}},
    )

    last_message = result["messages"][-1]
    return ChatResponse(response=last_message.content)
