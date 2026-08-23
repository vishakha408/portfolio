"""
rag/pipeline.py — orchestrates the full flow from the architecture diagram:

  Document Loader -> Chunking -> Embeddings -> Vector Database (FAISS)
                                                        |
  USER QUESTION -----------------------------------------
                                                        v
                                              RAG RETRIEVER
                                                        |
                                          Relevant information
                                                        v
                                                       LLM
                                                        |
                                                Final Answer
"""

from __future__ import annotations

import os
from pathlib import Path

from . import embeddings
from .chunker import chunk_documents
from .loader import load_documents
from .retriever import Retriever

KNOWLEDGE_BASE_DIR = Path(__file__).resolve().parent.parent.parent / "knowledge_base"

_retriever: Retriever | None = None


def build_index(force_rebuild: bool = False) -> Retriever:
    """
    Runs Document Loader -> Chunking -> Embeddings -> Vector Database.
    Reuses a saved index unless force_rebuild=True or none exists yet.
    """
    global _retriever

    if not force_rebuild and Retriever.exists():
        _retriever = Retriever.load()
        return _retriever

    documents = load_documents(KNOWLEDGE_BASE_DIR)
    chunks = chunk_documents(documents)
    vectors = embeddings.embed_texts([c["text"] for c in chunks])

    retriever = Retriever()
    retriever.build(chunks, vectors)
    retriever.save()

    _retriever = retriever
    return retriever


def get_retriever() -> Retriever:
    global _retriever
    if _retriever is None:
        _retriever = build_index()
    return _retriever


def answer_question(question: str, top_k: int | None = None) -> dict:
    """
    Runs USER QUESTION -> RAG RETRIEVER -> Relevant information -> LLM -> Final Answer.
    Returns {"answer": str, "sources": [str, ...]}.
    """
    top_k = top_k or int(os.getenv("RAG_TOP_K", "4"))

    retriever = get_retriever()
    query_vector = embeddings.embed_query(question)
    matches = retriever.search(query_vector, top_k=top_k)

    # local import avoids a hard dependency for callers that only need retrieval
    from llm.model import generate_answer

    answer = generate_answer(question, matches)
    sources = sorted({m["source"] for m in matches})

    return {"answer": answer, "sources": sources}
