  # RAG Document Analyst

   An analyst that lets you upload PDFs and chat with a Groq-powered RAG assistant.

  Frontend: React + Supabase auth/storage.  
  Backend: FastAPI + LangChain + FAISS.

  ![RAG Document Analyst Preview](./preview/prev1.png)

  ## Architecture
  - **Client** (`client/`)
    - Calls backend `/ingest` after each PDF upload
    - Calls backend `/query` for chat
  - **Backend** (`backend/`)
    - FastAPI API
    - `rag/ingestion.py`: downloads PDFs from storage, chunks, embeds, stores FAISS
    - `rag/query.py`: similarity search over FAISS

  ## How the Indexing Works
  1. Upload a PDF in the UI.
  2. The client stores it in Supabase Storage and inserts a row in `documents`.
  3. The client calls `POST /ingest` with the `project_id`.
  4. The backend creates/updates a FAISS index at:
    `backend/rag/indexes/<project_id>/`

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
  - `messages`
    - `id` (uuid)
    - `project_id` (uuid, FK → projects.id)
    - `user_id` (uuid, FK → auth.users.id)
    - `role` (text)
    - `content` (text)
    - `created_at` (timestamptz)

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

