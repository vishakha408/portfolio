"""
api/chat.py — the "Portfolio Chatbot" box at the bottom of the diagram.

Exposes POST /api/chat, exactly matching what ChatWidget.jsx already sends:
  request:  { "question": "..." }
  response: { "answer": "...", "sources": ["resume.pdf", "projects.txt"] }
"""

from __future__ import annotations

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from rag.pipeline import answer_question

router = APIRouter()


class ChatRequest(BaseModel):
    question: str = Field(..., min_length=1, max_length=1000)


class ChatResponse(BaseModel):
    answer: str
    sources: list[str]


@router.post("/chat", response_model=ChatResponse)
def chat(payload: ChatRequest) -> ChatResponse:
    question = payload.question.strip()
    if not question:
        raise HTTPException(status_code=400, detail="question cannot be empty")

    try:
        result = answer_question(question)
        return ChatResponse(**result)
    except RuntimeError as e:
        # e.g. missing GEMINI_API_KEY
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to answer question: {e}")
