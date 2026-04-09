from fastapi import APIRouter

from app.chat_store import append_turn, get_recent_first_row_per_page, get_thread
from app.schemas import ChatRequest, ChatResponse, ChatRow
from app.service import get_ai_response

api_chat_router = APIRouter(prefix="/api/chat", tags=["chat"])
legacy_router = APIRouter(tags=["legacy"])


def _resolve_page_id(page_id: int | None) -> int:
    if page_id is None or page_id <= 0:
        return 1
    return page_id


@api_chat_router.post("", response_model=ChatResponse)
def chat(req: ChatRequest):
    page_id = _resolve_page_id(req.pageId)
    reply = get_ai_response(req.message)
    append_turn(req.message, reply, page_id)
    return ChatResponse(reply=reply)


@api_chat_router.get("/recent", response_model=list[ChatRow])
def recent_chats_per_page():
    return [ChatRow.model_validate(r) for r in get_recent_first_row_per_page()]


@api_chat_router.get("/page/{page_id}", response_model=list[ChatRow])
def chats_by_page(page_id: int):
    return [ChatRow.model_validate(r) for r in get_thread(page_id)]


@legacy_router.post("/ai", response_model=ChatResponse)
def legacy_chat(req: ChatRequest):
    page_id = _resolve_page_id(req.pageId)
    reply = get_ai_response(req.message)
    append_turn(req.message, reply, page_id)
    return ChatResponse(reply=reply)
