# RAG Document Analyst

End-to-end project for uploading PDFs, indexing them with FAISS, and chatting with a Groq-powered RAG assistant.  
Frontend: React + Vite + Supabase auth/storage.  
Backend: FastAPI + LangChain + FAISS.

## What This Includes
- Email + Google OAuth via Supabase
- Projects + documents stored in Supabase
- PDF ingestion into per-project FAISS indexes
- Chat endpoint that retrieves relevant chunks and calls Groq LLM

## Architecture
- **Client** (`client/`)
  - React app with routes: `/`, `/login`, `/projects`, `/projects/:id`
  - Uploads PDFs to Supabase Storage and inserts into `documents`
  - Calls backend `/ingest` after upload
  - Calls backend `/query` for chat
- **Backend** (`backend/`)
  - FastAPI API
  - `rag/ingestion.py`: downloads PDFs from storage, chunks, embeds, stores FAISS
  - `rag/query.py`: similarity search over FAISS

## Supabase Schema
Tables used (fields inferred from the code):
- `projects`
  - `id` (uuid)
  - `user_id` (uuid)
  - `name` (text)
  - `emoji` (text)
  - `created_at` (timestamptz)
- `documents`
  - `id` (uuid)
  - `user_id` (uuid)
  - `title` (text)
  - `storage_path` (text)
  - `project_id` (uuid, FK → projects.id)
  - `created_at` (timestamp)

Storage bucket:
- `documents` (default; configurable)

## Environment Variables

### Frontend (`client/.env`)
```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_SUPABASE_STORAGE_BUCKET=documents
VITE_API_URL=http://localhost:8000
```

### Backend (`backend/.env`)
```
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

Notes:
- Use the **service role key** on the backend only.
- `SUPABASE_STORAGE_BUCKET` defaults to `documents` if not provided.

## Install & Run

### Backend
From repo root:
```
cd backend
python -m venv .venv
source .venv/bin/activate
pip install fastapi uvicorn python-dotenv supabase \
  langchain-community langchain-text-splitters langchain-huggingface \
  faiss-cpu pypdf
uvicorn main:app --reload
```

### Frontend
```
cd client
npm install
npm run dev
```

## How Indexing Works
1. Upload a PDF in the UI.
2. The client stores it in Supabase Storage and inserts a row in `documents`.
3. The client calls `POST /ingest` with the `project_id`.
4. The backend creates/updates a FAISS index at:
   `backend/rag/indexes/<project_id>/`

## How Chat Works
1. The client calls `POST /query` with `project_id` and `question`.
2. Backend retrieves top-k chunks from FAISS.
3. Backend calls Groq (`llama-3.3-70b-versatile`) with the context.
4. Response is returned to the UI along with source metadata.

## Notes / Troubleshooting
- If you see `No index found for project`, run ingestion by uploading a PDF or calling `/ingest`.
- If Groq returns 403/401, verify `GROQ_API_KEY` and your network (Cloudflare may block mobile hotspots).
- Supabase delete constraints can require cascading deletes or deleting documents before deleting a project.
