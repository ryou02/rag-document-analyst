export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-white to-blue-100 text-slate-900">
      <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center justify-center px-6">
        <div className="w-full rounded-3xl border border-slate-200 bg-white/90 p-10 text-center shadow-sm backdrop-blur">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-200 bg-white text-blue-600 shadow-sm">
            ✳︎
          </div>
          <h1 className="mt-6 text-2xl font-semibold">RAG Document Assistant</h1>
          <p className="mt-2 text-sm text-slate-500">Sign in to continue to your workspace.</p>
          <button className="mt-6 w-full rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200">
            Continue
          </button>
        </div>
      </main>
    </div>
  )
}
