import HomeNavbar from '../components/HomeNavbar.jsx'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-white to-blue-100 text-slate-900">
      <HomeNavbar />
      <main className="mx-auto flex min-h-[calc(100vh-88px)] w-full max-w-4xl flex-col items-center justify-center px-6 text-center">
        <h1 className="rise-in mt-6 text-4xl font-semibold">RAG Document Assistant</h1>
        <p className=" rise-in-delay fade-in mt-3 max-w-2xl text-sm text-slate-500">
          Upload documents, search with citations, and chat with your knowledge base in one place.
        </p>
        <a href="/login" className="rise-in-delay mt-4 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-blue-700">
          Get Started
        </a>
      </main>
    </div>
  )
}
