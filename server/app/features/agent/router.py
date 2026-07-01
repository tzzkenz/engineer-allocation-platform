import json

from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from features.agent.agent import make_agent
from features.auth.dependencies import get_current_user
from core.dependencies import get_employee_service
from features.employee.service import EmployeeService
from langchain_core.messages import HumanMessage

router = APIRouter(prefix="/agent", tags=["agent"])


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    response: str


@router.post("/chat")
async def chat(
    payload: ChatRequest,
    current_user=Depends(get_current_user),
    employee_service: EmployeeService = Depends(get_employee_service),
):
    agent = make_agent(employee_service)

    async def event_stream():
        messages = {"messages": [HumanMessage(content=payload.message)]}

        config = {"configurable": {"thread_id": f"employee-{current_user.id}"}}

        async for event in agent.astream_events(messages, config=config):
            if event["event"] == "on_chat_model_stream":
                chunk = event["data"]["chunk"]

                if chunk.content:
                    yield (
                        f"data: {json.dumps({'content': chunk.content, 'type': 'delta'})}\n\n"
                    )

        yield "data: [DONE]\n\n"

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
    )
