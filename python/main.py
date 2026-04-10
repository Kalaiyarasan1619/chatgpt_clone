import os

from dotenv import load_dotenv
from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

from app.routes import api_chat_router, legacy_router

app = FastAPI()

_cors = os.getenv("CORS_ORIGINS", "").strip()
if _cors:
    _origins = [o.strip() for o in _cors.split(",") if o.strip()]
else:
    _origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_chat_router)
app.include_router(legacy_router)


@app.get("/")
def root():
    return {"status": "ok"}


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.head("/health")
def health_head():
    return Response(status_code=200)