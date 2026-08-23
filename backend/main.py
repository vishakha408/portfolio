"""
main.py — FastAPI application entrypoint.

Run locally:
    cd backend
    uvicorn main:app --reload --port 8000
"""

from __future__ import annotations

import os
from contextlib import asynccontextmanager
from pathlib import Path

from dotenv import load_dotenv

# Ensure backend/.env is loaded even if run from project root
env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=env_path)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.chat import router as chat_router
from rag.pipeline import build_index


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Runs on startup: builds or loads the FAISS index
    build_index()
    yield
    # Cleanup logic (if any) runs on shutdown


app = FastAPI(title="AI Portfolio RAG Backend", lifespan=lifespan)

# Allow multiple comma-separated origins from FRONTEND_ORIGIN or default to localhost
raw_origin = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")
allowed_origins = [origin.strip() for origin in raw_origin.split(",") if origin.strip()]

# Include standard local origins for convenience during dev/testing
default_local_origins = ["http://localhost:5173", "http://127.0.0.1:5173"]
for local_origin in default_local_origins:
    if local_origin not in allowed_origins:
        allowed_origins.append(local_origin)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router, prefix="/api")


@app.post("/api/reindex")
def reindex() -> dict:
    """Rebuild the vector index after you've edited knowledge_base/ files."""
    build_index(force_rebuild=True)
    return {"status": "reindexed"}


@app.get("/api/health")
def health() -> dict:
    """Healthcheck endpoint for deployment platforms & uptime monitors."""
    return {"status": "ok"}