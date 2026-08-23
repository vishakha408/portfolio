"""
rag/embeddings.py — Embeddings stage of the pipeline.

Thin wrapper around the Gemini embedding API (gemini-embedding-001). Batches
requests since the API accepts a list of strings per call, which matters
once your knowledge base grows past a handful of chunks.
"""

from __future__ import annotations

import os

from google import genai
from google.genai import types

_EMBEDDING_MODEL = os.getenv("GEMINI_EMBEDDING_MODEL", "gemini-embedding-001")
_BATCH_SIZE = 20  # keep requests small and reliable


def _client() -> genai.Client:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key or api_key == "your_gemini_api_key_here":
        raise RuntimeError(
            "GEMINI_API_KEY is not set. Copy .env.example to .env and paste "
            "your key from https://aistudio.google.com/apikey"
        )
    return genai.Client(api_key=api_key)


def embed_texts(texts: list[str], task_type: str = "RETRIEVAL_DOCUMENT") -> list[list[float]]:
    """Embed a list of chunk texts for storage in the vector database."""
    client = _client()
    vectors: list[list[float]] = []

    for i in range(0, len(texts), _BATCH_SIZE):
        batch = texts[i : i + _BATCH_SIZE]
        result = client.models.embed_content(
            model=_EMBEDDING_MODEL,
            contents=batch,
            config=types.EmbedContentConfig(task_type=task_type),
        )
        vectors.extend(e.values for e in result.embeddings)

    return vectors


def embed_query(text: str) -> list[float]:
    """Embed a single user question for similarity search against the index."""
    client = _client()
    result = client.models.embed_content(
        model=_EMBEDDING_MODEL,
        contents=text,
        config=types.EmbedContentConfig(task_type="RETRIEVAL_QUERY"),
    )
    return result.embeddings[0].values
