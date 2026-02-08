import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import FileUpload from '../components/FileUpload.jsx'
import { supabase } from '../lib/supabaseClient.js'
import useAuth from '../hooks/useAuth.js'

const STORAGE_BUCKET = import.meta.env.VITE_SUPABASE_STORAGE_BUCKET || 'documents'

export default function ChatPage() {
  const { user } = useAuth()
  const [selectedSources, setSelectedSources] = useState([])
  const [sources, setSources] = useState([])
  const [loadingSources, setLoadingSources] = useState(false)
  const [sourcesError, setSourcesError] = useState('')
  const [showUploader, setShowUploader] = useState(false)

  const toggleSource = (index) => {
    setSelectedSources((prev) =>
      prev.includes(index) ? prev.filter((item) => item !== index) : [...prev, index],
    )
  }

  const loadSources = async () => {
    if (!user) return
    setLoadingSources(true)
    setSourcesError('')

    const { data, error } = await supabase.storage.from(STORAGE_BUCKET).list(user.id, {
      limit: 100,
      offset: 0,
      sortBy: { column: 'name', order: 'desc' },
    })

    setLoadingSources(false)

    if (error) {
      setSourcesError(error.message)
      return
    }

    const files = (data || [])
      .filter((item) => item.name && !item.name.endsWith('/'))
      .map((item) => item.name)

    setSources(files)
    setSelectedSources(files.map((_, index) => index))
  }

  useEffect(() => {
    loadSources()
  }, [user])

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-white to-blue-100 text-slate-900">
      <Navbar />
      {showUploader ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-6 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white shadow-2xl">
            <FileUpload
              onClose={() => setShowUploader(false)}
              onUploaded={() => {
                loadSources()
              }}
            />
          </div>
        </div>
      ) : null}
      <main className="mx-auto w-full max-w-7xl px-6 pb-10 pt-6">
        <div className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
          <section className="min-h-[620px] rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-700">Sources</h2>
              <button className="text-xs font-medium text-slate-400">II</button>
            </div>
            <button
              type="button"
              onClick={() => setShowUploader((prev) => !prev)}
              className="mt-4 w-full rounded-2xl border border-slate-200 bg-blue-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-blue-200 hover:bg-blue-100"
            >
              + Add sources
            </button>
            <div className="mt-4 space-y-3 text-sm">
              {loadingSources ? (
                <div className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-4 text-xs text-slate-500">
                  Loading sources...
                </div>
              ) : null}
              {sourcesError ? (
                <div className="rounded-2xl border border-red-100 bg-red-50 px-3 py-4 text-xs text-red-500">
                  {sourcesError}
                </div>
              ) : null}
              {!loadingSources && !sourcesError && sources.length === 0 ? (
                <div className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-4 text-xs text-slate-500">
                  No sources yet. Add a PDF to get started.
                </div>
              ) : null}
              {sources.map((item, index) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleSource(index)}
                  className="flex w-full items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2 text-left transition hover:border-blue-200 hover:bg-blue-50"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-red-50 text-[10px] font-semibold text-red-500">
                    PDF
                  </div>
                  <div className="truncate text-slate-700">{item}</div>
                  <div
                    className={`ml-auto flex h-5 w-5 items-center justify-center rounded-md text-[10px] font-bold leading-none ${
                      selectedSources.includes(index)
                        ? 'bg-slate-300 text-slate-800'
                        : 'bg-slate-200 text-transparent'
                    }`}
                  >
                    ✓
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className="flex min-h-[620px] flex-col rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-700">Chat</h2>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>+</span>
                <span>⋮</span>
              </div>
            </div>

            <div className="mt-4 flex-1 space-y-5 text-sm text-slate-600">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-600">
                  AI
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700">
                  Cultural norms and ideology are part of the shared belief system that makes a social
                  order feel normal. They reinforce who holds power by shaping what people see as natural
                  or expected.
                </div>
              </div>

              <div className="flex items-start justify-end gap-3">
                <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-slate-700">
                  Can you summarize how cultural norms and ideology relate to social structure?
                </div>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-600">
                  J
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-600">
                  AI
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700">
                  Stratification organizes society into layers, and those layers determine access to
                  resources. That access shapes life chances like education, health, and income.
                </div>
              </div>

              <div className="flex items-start justify-end gap-3">
                <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-slate-700">
                  And how does stratification connect to life chances?
                </div>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-600">
                  J
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500">
              <span className="flex-1">Start typing...</span>
              <button className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white shadow-md shadow-blue-200">
                ↑
              </button>
            </div>
          </section>

        </div>
      </main>
    </div>
  )
}
