from pydantic import BaseModel


class ChatRequest(BaseModel):
    message: str
    pageId: int | None = None


class ChatResponse(BaseModel):
    reply: str


class ChatRow(BaseModel):
    id: int
    message: str
    response: str
    pageId: int
