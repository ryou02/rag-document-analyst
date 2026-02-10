import os
from pathlib import Path

from dotenv import load_dotenv
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings

load_dotenv()

INDEX_ROOT = Path(os.getenv('RAG_INDEX_DIR', 'rag/indexes'))
EMBED_MODEL = os.getenv('RAG_EMBED_MODEL', 'sentence-transformers/all-MiniLM-L6-v2')

embeddings = HuggingFaceEmbeddings(model_name=EMBED_MODEL)


def query_project(project_id: str, question: str, k: int = 4):
  """
  Retrieve the top-k chunks for a project.
  Returns a dict with matches (text + metadata).
  """
  if not project_id:
    raise ValueError('project_id is required')
  if not question:
    raise ValueError('question is required')

  index_path = INDEX_ROOT / project_id
  if not (index_path / 'index.faiss').exists():
    return {
      'status': 'error',
      'message': 'No index found for project',
      'project_id': project_id,
      'matches': [],
    }

  vectorstore = FAISS.load_local(index_path.as_posix(), embeddings, allow_dangerous_deserialization=True)
  results = vectorstore.similarity_search(question, k=k)

  matches = [
    {
      'content': doc.page_content,
      'metadata': doc.metadata,
    }
    for doc in results
  ]

  return {
    'status': 'ok',
    'project_id': project_id,
    'question': question,
    'matches': matches,
  }


if __name__ == '__main__':
  import sys

  if len(sys.argv) < 3:
    raise SystemExit('Usage: python query.py <project_id> <question>')

  result = query_project(sys.argv[1], ' '.join(sys.argv[2:]))
  print(result)
