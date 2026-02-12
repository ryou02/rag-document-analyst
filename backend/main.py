from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class QueryRequest(BaseModel):
    project_id: str
    question: str

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
