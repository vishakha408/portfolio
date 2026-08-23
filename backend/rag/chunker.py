"""
rag/chunker.py — Chunking stage of the pipeline.

Splits each document into overlapping, word-bounded chunks small enough to
embed and retrieve precisely, while keeping enough context that a chunk is
still meaningful on its own. Blank-line-separated paragraphs are preferred
chunk boundaries (so e.g. each job in experience.txt tends to stay whole);
anything longer than chunk_size still gets split with a sliding window.
"""

from __future__ import annotations


def chunk_documents(
    documents: list[dict],
    chunk_size: int = 220,
    chunk_overlap: int = 40,
) -> list[dict]:
    """
    documents: [{"source": str, "text": str}, ...]
    returns:   [{"source": str, "chunk_id": int, "text": str}, ...]
    """
    chunks: list[dict] = []

    for doc in documents:
        paragraphs = [p.strip() for p in doc["text"].split("\n\n") if p.strip()]
        if not paragraphs:
            paragraphs = [doc["text"].strip()]

        chunk_id = 0
        for paragraph in paragraphs:
            for piece in _split_by_words(paragraph, chunk_size, chunk_overlap):
                chunks.append(
                    {
                        "source": doc["source"],
                        "chunk_id": chunk_id,
                        "text": piece,
                    }
                )
                chunk_id += 1

    return chunks


def _split_by_words(text: str, chunk_size: int, chunk_overlap: int) -> list[str]:
    words = text.split()
    if len(words) <= chunk_size:
        return [text]

    step = max(1, chunk_size - chunk_overlap)
    pieces = []
    for start in range(0, len(words), step):
        window = words[start : start + chunk_size]
        if not window:
            break
        pieces.append(" ".join(window))
        if start + chunk_size >= len(words):
            break
    return pieces


if __name__ == "__main__":
    from pathlib import Path

    from loader import load_documents

    base = Path(__file__).resolve().parent.parent.parent / "knowledge_base"
    docs = load_documents(base)
    chunks = chunk_documents(docs)
    print(f"{len(docs)} documents -> {len(chunks)} chunks")
    for c in chunks[:3]:
        print(f"  [{c['source']}#{c['chunk_id']}] {c['text'][:80]}...")
