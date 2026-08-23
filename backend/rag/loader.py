"""
rag/loader.py — Document Loader stage of the pipeline.

Reads every file in knowledge_base/ (about.txt, skills.txt, experience.txt,
projects.txt, education.txt, resume.pdf, ...) and returns a flat list of
{"source": filename, "text": raw_text} dicts. This is the first box in the
architecture diagram: "YOUR PORTFOLIO DATA -> Document Loader".
"""

from __future__ import annotations

import os
from pathlib import Path

from pypdf import PdfReader

SUPPORTED_TEXT_EXT = {".txt", ".md"}
SUPPORTED_PDF_EXT = {".pdf"}


def load_documents(knowledge_base_dir: str | Path) -> list[dict]:
    """Load every supported file in knowledge_base_dir into raw text documents."""
    kb_dir = Path(knowledge_base_dir)
    if not kb_dir.exists():
        raise FileNotFoundError(f"knowledge_base directory not found: {kb_dir}")

    documents: list[dict] = []

    for path in sorted(kb_dir.iterdir()):
        if not path.is_file():
            continue

        ext = path.suffix.lower()

        if ext in SUPPORTED_TEXT_EXT:
            text = path.read_text(encoding="utf-8", errors="ignore").strip()
            if text:
                documents.append({"source": path.name, "text": text})

        elif ext in SUPPORTED_PDF_EXT:
            text = _load_pdf(path)
            if text.strip():
                documents.append({"source": path.name, "text": text})

        # silently skip anything else (e.g. .DS_Store, .gitkeep)

    if not documents:
        raise ValueError(
            f"No readable documents found in {kb_dir}. "
            "Add .txt or .pdf files to knowledge_base/."
        )

    return documents


def _load_pdf(path: Path) -> str:
    reader = PdfReader(str(path))
    pages = [page.extract_text() or "" for page in reader.pages]
    return "\n".join(pages)


if __name__ == "__main__":
    # Quick manual check: python -m rag.loader
    base = Path(__file__).resolve().parent.parent.parent / "knowledge_base"
    docs = load_documents(base)
    for d in docs:
        print(f"{d['source']}: {len(d['text'])} chars")
