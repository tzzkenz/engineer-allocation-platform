# @tool
# def refer_docs(query: str) -> str:
#     """
#     Search HR policy documents using the RAG pipeline.
#     """
#     return get_result(query)


# @app.post("/chatbot/stream")
# async def chatbot(req: ChatRequest):
#     """
#     Stream chatbot responses using Server-Sent Events (SSE).
#     """
#     config: RunnableConfig = {"configurable": {"thread_id": req.user_id}}

#     async def event_stream():
#         messages = {
#             "messages": [
#                 HumanMessage(content=req.content)
#             ]
#         }

#         async for event in agent.astream_events(messages, config=config):
#             if event["event"] == "on_chat_model_stream":
#                 chunk = event["data"]["chunk"]

#                 if chunk.content:
#                     yield (
#                         f"data: {json.dumps({'content': chunk.content, 'type': 'delta'})}\n\n"
#                     )

#         yield "data: [DONE]\n\n"

#     return StreamingResponse(
#         event_stream(),
#         media_type="text/event-stream",
#     )


# @app.post("/chatbot/file_upload")
# async def file_upload(file: UploadFile = File(...)):
#     """
#     Upload HR documents and refresh the vector database.
#     """

#     if file.content_type not in ("application/jpeg", "text/plain", "text/md"):
#         raise HTTPException(405, "Unsupported file type")

#     filename = Path(file.filename).name
#     file_path = Path(DATA_DIR) / filename

#     with open(file_path, "wb") as buffer:
#         shutil.copyfileobj(file.file, buffer)

#     load_files(DATA_DIR)

#     return {
#         "message": "File uploaded successfully.",
#         "file_path": file_path,
#     }


from langchain_groq import ChatGroq
from langchain.agents import create_agent
from langgraph.checkpoint.memory import InMemorySaver

from core.config import settings


SYSTEM_PROMPT = """
  You are a helpful chat assistant
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


agent = create_agent(
    model=make_llm(), system_prompt=SYSTEM_PROMPT, checkpointer=checkpointer
)
