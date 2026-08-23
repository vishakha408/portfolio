"""
rag/retriever.py — Vector Database (FAISS) + RAG Retriever stages.

Wraps a FAISS flat L2 index plus a parallel metadata list (source filename
and chunk text for each vector). Persists both to disk under
backend/rag/storage/ so the index only needs to be rebuilt when your
knowledge_base/ files change, not on every server restart.
"""

from __future__ import annotations

import json
from pathlib import Path

import faiss
import numpy as np

STORAGE_DIR = Path(__file__).resolve().parent / "storage"
INDEX_PATH = STORAGE_DIR / "index.faiss"
METADATA_PATH = STORAGE_DIR / "metadata.json"


class Retriever:
    def __init__(self, dim: int | None = None):
        self.dim = dim
        self.index: faiss.IndexFlatL2 | None = None
        self.metadata: list[dict] = []  # parallel to index vectors

    # ---- building ----------------------------------------------------

    def build(self, chunks: list[dict], vectors: list[list[float]]) -> None:
        if len(chunks) != len(vectors):
            raise ValueError("chunks and vectors must be the same length")

        matrix = np.array(vectors, dtype="float32")
        self.dim = matrix.shape[1]
        self.index = faiss.IndexFlatL2(self.dim)
        self.index.add(matrix)
        self.metadata = chunks

    # ---- persistence ---------------------------------------------------

    def save(self) -> None:
        STORAGE_DIR.mkdir(parents=True, exist_ok=True)
        faiss.write_index(self.index, str(INDEX_PATH))
        METADATA_PATH.write_text(
            json.dumps(self.metadata, ensure_ascii=False), encoding="utf-8"
        )

    @classmethod
    def load(cls) -> "Retriever":
        if not INDEX_PATH.exists() or not METADATA_PATH.exists():
            raise FileNotFoundError("No saved index found. Run pipeline.build_index() first.")
        index = faiss.read_index(str(INDEX_PATH))
        metadata = json.loads(METADATA_PATH.read_text(encoding="utf-8", errors="replace"))
        retriever = cls(dim=index.d)
        retriever.index = index
        retriever.metadata = metadata
        return retriever

    @staticmethod
    def exists() -> bool:
        return INDEX_PATH.exists() and METADATA_PATH.exists()

    # ---- search ---------------------------------------------------------

    def search(self, query_vector: list[float], top_k: int = 4) -> list[dict]:
        if self.index is None:
            raise RuntimeError("Index is not built or loaded yet.")

        query = np.array([query_vector], dtype="float32")
        distances, indices = self.index.search(query, top_k)

        results = []
        for dist, idx in zip(distances[0], indices[0]):
            if idx == -1:
                continue
            chunk = self.metadata[idx]
            results.append({**chunk, "distance": float(dist)})
        return results
