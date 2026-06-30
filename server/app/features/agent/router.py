import json

from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from features.agent.schemas import ChatRequest
from features.agent.chatbot import agent
from langchain_core.runnables import RunnableConfig
from langchain.messages import HumanMessage

router = APIRouter(prefix="/agent", tags=["Agent"])


@router.post("/chatbot/stream")
async def chatbot(req: ChatRequest):
    """
    Stream chatbot responses using Server-Sent Events (SSE).
    """
    config: RunnableConfig = {"configurable": {"thread_id": req.user_id}}

    async def event_stream():
        messages = {"messages": [HumanMessage(content=req.content)]}

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
