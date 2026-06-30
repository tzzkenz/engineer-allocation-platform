from pydantic import BaseModel


class ChatRequest(BaseModel):
    content: str
    user_id: str
