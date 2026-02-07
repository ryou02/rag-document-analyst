import ChatNavbar from '../components/ChatNavbar.jsx'

const notebooks = [
  {
    title: 'soc100',
    date: 'Jan 20, 2026',
    sources: 5,
    tint: 'bg-purple-50',
    emoji: '🎓',
  },
  {
    title: 'Untitled notebook',
    date: 'Feb 7, 2026',
    sources: 0,
    tint: 'bg-blue-50',
    emoji: '📁',
  },
  {
    title: 'Research sprint',
    date: 'Feb 3, 2026',
    sources: 8,
    tint: 'bg-slate-50',
    emoji: '🧭',
  },
]

export default function DocumentsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-white to-blue-100 text-slate-900">
      <ChatNavbar />
      <main className="mx-auto w-full max-w-6xl px-6 pb-16 pt-8">
        <h1 className="text-3xl font-semibold text-slate-900">Recent notebooks</h1>
        <p className="mt-2 text-sm text-slate-500">Pick up where you left off or start a new workspace.</p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <button
            type="button"
            className="flex min-h-[220px] flex-col items-center justify-center gap-4 rounded-3xl border border-slate-200 bg-white px-6 py-8 text-left shadow-sm transition hover:border-blue-200 hover:shadow-md"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-3xl text-blue-600">
              +
            </div>
            <div className="text-lg font-semibold text-slate-800">Create new notebook</div>
          </button>

          {notebooks.map((notebook) => (
            <button
              key={notebook.title}
              type="button"
              className={`flex min-h-[220px] flex-col justify-between rounded-3xl border border-slate-200 px-6 py-6 text-left shadow-sm transition hover:border-blue-200 hover:shadow-md ${notebook.tint}`}
            >
              <div className="flex items-center justify-between">
                <div className="text-2xl">{notebook.emoji}</div>
                <span className="text-lg text-slate-400">⋮</span>
              </div>
              <div>
                <div className="text-2xl font-semibold text-slate-900">{notebook.title}</div>
                <div className="mt-2 text-sm text-slate-500">
                  {notebook.date} · {notebook.sources} sources
                </div>
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  )
}
