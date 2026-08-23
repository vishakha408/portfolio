"""
llm/model.py — LLM stage of the pipeline.

Wraps the Gemini generation API. Takes the user's question plus the chunks
the retriever pulled back, builds a grounded prompt, and returns the final
answer text.
"""

from __future__ import annotations

import logging
import os
import time

from google import genai
from google.genai.errors import APIError, ClientError, ServerError

logger = logging.getLogger(__name__)

# Use high-quota flash models by default
_PRIMARY_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
_FALLBACK_MODEL = os.getenv("GEMINI_FALLBACK_MODEL", "gemini-1.5-flash")

_SYSTEM_INSTRUCTION = """You are the AI assistant embedded in a personal portfolio website.
Answer questions about the portfolio owner using ONLY the context chunks provided below,
which were retrieved from their resume, skills, projects, experience, and education.

Rules:
- Stay grounded in the provided context. Do not invent facts, dates, or numbers.
- If the context doesn't contain the answer, say so plainly and suggest what the
  visitor could ask instead — don't guess.
- Answer in first person, as if you were speaking for the portfolio owner
  ("I worked on..." not "They worked on...").
- Keep answers concise: a few sentences, not an essay, unless the question
  genuinely calls for more detail.
"""


def _client() -> genai.Client:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key or api_key == "your_gemini_api_key_here":
        raise RuntimeError(
            "GEMINI_API_KEY is not set. Copy .env.example to .env and paste "
            "your key from https://aistudio.google.com/apikey"
        )
    return genai.Client(api_key=api_key)


def generate_answer(
    question: str, context_chunks: list[dict], max_retries: int = 2
) -> str:
    """context_chunks: [{"source": str, "text": str}, ...] from the retriever."""
    context_block = "\n\n".join(
        f"[Source: {c.get('source', 'unknown')}]\n{c.get('text', '')}"
        for c in context_chunks
    )

    prompt = (
        f"Context:\n{context_block}\n\n"
        f"Question: {question}\n\n"
        "Answer as the portfolio owner, grounded strictly in the context above."
    )

    client = _client()
    config = {"system_instruction": _SYSTEM_INSTRUCTION}

    # Helper function to call a specific model
    def _call_model(model_name: str) -> str | None:
        resp = client.models.generate_content(
            model=model_name,
            contents=prompt,
            config=config,
        )
        if resp and resp.text:
            return resp.text.strip()
        return None

    # 1. Attempt Primary Model
    for attempt in range(max_retries):
        try:
            result = _call_model(_PRIMARY_MODEL)
            if result:
                return result
        except ServerError as err:
            logger.warning(
                "Primary model %s hit 503 spike (attempt %d/%d): %s",
                _PRIMARY_MODEL,
                attempt + 1,
                max_retries,
                err,
            )
            if attempt < max_retries - 1:
                time.sleep(1.5 * (attempt + 1))
                continue
        except ClientError as err:
            # Catches 429 Quota Exceeded on primary model immediately without retrying
            logger.warning("Primary model %s quota exceeded (429): %s", _PRIMARY_MODEL, err)
            break
        except Exception as e:
            logger.error("Primary model error: %s", e)
            break

    # 2. Attempt Fallback Model
    try:
        logger.info("Attempting fallback model: %s", _FALLBACK_MODEL)
        fallback_result = _call_model(_FALLBACK_MODEL)
        if fallback_result:
            return fallback_result
    except Exception as fallback_err:
        logger.error("Fallback model error: %s", fallback_err)

    return (
        "The AI model is currently handling high traffic or quota limits. "
        "Please try asking your question again in a moment."
    )