import json
import os
import urllib.error
import urllib.request

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pydantic import BaseModel

from rag.ingestion import ingest_project
from rag.query import format_context, query_project

load_dotenv()

app = FastAPI()

if os.getenv("GROQ_API_KEY"):
    print("GROQ_API_KEY loaded.")
else:
    print("GROQ_API_KEY missing.")

cors_origins = os.getenv("CORS_ORIGINS", "*")
origins = [origin.strip() for origin in cors_origins.split(",")] if cors_origins else ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    project_id: str
    question: str


class IngestRequest(BaseModel):
    project_id: str


GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_BASE_URL = os.getenv("GROQ_BASE_URL", "https://api.groq.com/openai/v1")
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/query")
def query(req: QueryRequest):
    if not GROQ_API_KEY:
        raise HTTPException(status_code=500, detail="Missing GROQ_API_KEY")

    retrieval = query_project(req.project_id, req.question, k=4)
    if retrieval.get("status") != "ok":
        raise HTTPException(status_code=400, detail=retrieval.get("message", "Query failed"))

    matches = retrieval.get("matches", [])
    context = format_context(matches)

    system_prompt = (
        "You are a helpful RAG assistant. Use the provided context to answer the question. "
        "If the answer isn't in the context, say you don't know. Keep answers concise and factual."
    )

    user_prompt = (
        f"Context:\\n{context}\\n\\n"
        f"Question: {req.question}\\n"
        "Answer:"
    )

    payload = {
        "model": GROQ_MODEL,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        "temperature": 0.2,
    }

    request = urllib.request.Request(
        f"{GROQ_BASE_URL}/chat/completions",
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {GROQ_API_KEY}",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(request, timeout=60) as response:
            body = json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        error_body = exc.read().decode("utf-8") if exc.fp else ""
        detail = f"GROQ request failed: HTTP {exc.code}. {error_body}"
        raise HTTPException(status_code=502, detail=detail) from exc
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"GROQ request failed: {exc}") from exc

    answer = (
        body.get("choices", [{}])[0]
        .get("message", {})
        .get("content", "")
        .strip()
    )

    sources = [
        {
            "title": match.get("metadata", {}).get("title"),
            "document_id": match.get("metadata", {}).get("document_id"),
            "storage_path": match.get("metadata", {}).get("storage_path"),
            "content": match.get("content"),
        }
        for match in matches
    ]

    return {
        "status": "ok",
        "project_id": req.project_id,
        "question": req.question,
        "answer": answer,
        "sources": sources,
    }


@app.post("/ingest")
def ingest(req: IngestRequest):
    return ingest_project(req.project_id)
