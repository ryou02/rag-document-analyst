import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from rag.ingestion import ingest_project

app = FastAPI()

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

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/query")
def query(req: QueryRequest):
    # temporary stub so frontend integration works first
    return {
        "status": "ok",
        "project_id": req.project_id,
        "question": req.question,
        "answer": f"Stub answer for: {req.question}",
        "sources": []
    }


@app.post("/ingest")
def ingest(req: IngestRequest):
    return ingest_project(req.project_id)
