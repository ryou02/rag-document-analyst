import os
import tempfile
from pathlib import Path

from dotenv import load_dotenv
from supabase import create_client
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

load_dotenv()

SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY') or os.getenv('SUPABASE_ANON_KEY')
STORAGE_BUCKET = os.getenv('SUPABASE_STORAGE_BUCKET', 'documents')
INDEX_ROOT = Path(os.getenv('RAG_INDEX_DIR', 'rag/indexes'))
EMBED_MODEL = os.getenv('RAG_EMBED_MODEL', 'sentence-transformers/all-MiniLM-L6-v2')


if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY/SUPABASE_ANON_KEY')

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
embeddings = HuggingFaceEmbeddings(model_name=EMBED_MODEL)


def _load_existing_index(index_path: Path):
    if (index_path / 'index.faiss').exists():
        return FAISS.load_local(index_path.as_posix(), embeddings, allow_dangerous_deserialization=True)
    return None


def _existing_document_ids(vectorstore):
    if not vectorstore:
        return set()
    try:
        return {
            doc.metadata.get('document_id')
            for doc in vectorstore.docstore._dict.values()
            if doc.metadata.get('document_id')
        }
    except Exception:
        return set()


def ingest_project(project_id: str):
    """
    Ingest all PDFs for a project from Supabase Storage into a FAISS index.
    Stores a local index at rag/indexes/<project_id>.
    """
    if not project_id:
        raise ValueError('project_id is required')

    index_path = INDEX_ROOT / project_id
    index_path.mkdir(parents=True, exist_ok=True)

    vectorstore = _load_existing_index(index_path)
    seen_document_ids = _existing_document_ids(vectorstore)

    response = (
        supabase.table('documents')
        .select('id, title, storage_path, created_at')
        .eq('project_id', project_id)
        .order('created_at', desc=True)
        .execute()
    )

    documents = response.data or []
    if not documents:
        return {'status': 'ok', 'message': 'No documents to ingest', 'project_id': project_id}

    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=150)
    all_chunks = []

    for doc in documents:
        document_id = doc.get('id')
        storage_path = doc.get('storage_path')
        title = doc.get('title') or 'Untitled document'

        if not document_id or not storage_path:
            continue

        if document_id in seen_document_ids:
            continue

        file_bytes = supabase.storage.from_(STORAGE_BUCKET).download(storage_path)

        with tempfile.TemporaryDirectory() as temp_dir:
            temp_path = Path(temp_dir) / f"{document_id}.pdf"
            temp_path.write_bytes(file_bytes)

            loader = PyPDFLoader(temp_path.as_posix())
            pages = loader.load()

        for page in pages:
            page.metadata.update(
                {
                    'project_id': project_id,
                    'document_id': document_id,
                    'title': title,
                    'storage_path': storage_path,
                }
            )

        chunks = text_splitter.split_documents(pages)
        all_chunks.extend(chunks)

    if not all_chunks:
        return {'status': 'ok', 'message': 'No new documents to ingest', 'project_id': project_id}

    if vectorstore:
        vectorstore.add_documents(all_chunks)
    else:
        vectorstore = FAISS.from_documents(all_chunks, embeddings)

    vectorstore.save_local(index_path.as_posix())

    return {
        'status': 'ok',
        'message': f'Ingested {len(all_chunks)} chunks',
        'project_id': project_id,
    }


if __name__ == '__main__':
    import sys

    if len(sys.argv) < 2:
        raise SystemExit('Usage: python ingestion.py <project_id>')

    result = ingest_project(sys.argv[1])
    print(result)
