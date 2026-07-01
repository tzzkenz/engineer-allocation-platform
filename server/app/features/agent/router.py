from fastapi import APIRouter, Depends
from pydantic import BaseModel

from features.agent.agent import make_agent
from features.auth.dependencies import get_current_user

router = APIRouter(prefix="/agent", tags=["agent"])


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    response: str


@router.post("/chat", response_model=ChatResponse)
async def chat(
    payload: ChatRequest,
    current_user=Depends(get_current_user),
):
    agent = make_agent(
        requesting_role=current_user.system_role_id,
    )

    result = await agent.ainvoke(
        {"messages": [{"role": "user", "content": payload.message}]},
        config={"configurable": {"thread_id": f"employee-{current_user.id}"}},
    )

    last_message = result["messages"][-1]
    return ChatResponse(response=last_message.content)
