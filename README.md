# RAG Doc Analyst

RAG Doc Analyst is a full-stack app where users upload PDFs into projects and chat with an AI assistant grounded on those files.  
Frontend uses React + Vite + Supabase. Backend uses FastAPI + LangChain + FAISS + Groq.

![RAG Document Analyst Preview](preview/prev1.png)

## How It Works
1. User signs in and creates a project.
2. User uploads PDF files to Supabase Storage, and metadata is stored in `documents`.
3. Frontend calls `POST /ingest` with `project_id`.
4. Backend reads project PDFs, chunks text, embeds chunks, and stores a FAISS index at `backend/rag/indexes/<project_id>/`.
5. When the user asks a question, frontend calls `POST /query`.
6. Backend retrieves relevant chunks from FAISS and sends context + question to Groq.
7. The answer is returned to chat and messages are saved per project in Supabase `messages`.

## How To Setup
1. Create `client/.env`:
```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_SUPABASE_STORAGE_BUCKET=documents
VITE_API_URL=http://localhost:8000
```
2. Create `backend/.env`:
```env
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
SUPABASE_STORAGE_BUCKET=documents

GROQ_API_KEY=...
GROQ_MODEL=llama-3.3-70b-versatile
GROQ_BASE_URL=https://api.groq.com/openai/v1

RAG_INDEX_DIR=rag/indexes
RAG_EMBED_MODEL=sentence-transformers/all-MiniLM-L6-v2
CORS_ORIGINS=http://localhost:5173
```
3. Install and run backend:
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install fastapi uvicorn python-dotenv supabase \
  langchain-community langchain-text-splitters langchain-huggingface \
  faiss-cpu pypdf sentence-transformers
uvicorn main:app --reload
```
4. Install and run frontend:
```bash
cd client
npm install
npm run dev
```
