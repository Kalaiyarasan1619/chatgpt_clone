from fastapi import FastAPI
from dotenv import load_dotenv

# ✅ FIRST load env
load_dotenv()

from app.routes import router

app = FastAPI()

app.include_router(router)