from fastapi import APIRouter
from app.schemas import ChatRequest, ChatResponse
from app.service import get_ai_response

router = APIRouter()

@router.post("/ai", response_model=ChatResponse)
def chat(req: ChatRequest):

    reply = get_ai_response(req.message)

    return {"reply": reply}