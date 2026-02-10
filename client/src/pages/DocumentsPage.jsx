import { useEffect, useMemo, useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import { supabase } from '../lib/supabaseClient.js'
import useAuth from '../hooks/useAuth.js'

export default function DocumentsPage() {
  const { user } = useAuth()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const cardTints = useMemo(
    () => ['bg-purple-50', 'bg-blue-50', 'bg-slate-50', 'bg-emerald-50', 'bg-amber-50'],
    [],
  )

  useEffect(() => {
    const loadProjects = async () => {
      if (!user) return
      setLoading(true)
      setError('')

      const { data, error: fetchError } = await supabase
        .from('projects')
        .select('id, name, emoji, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      setLoading(false)

      if (fetchError) {
        setError(fetchError.message)
        return
      }

      setProjects(data || [])
    }

    loadProjects()
  }, [user])

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-white to-blue-100 text-slate-900">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl px-6 pb-16 pt-8">
        <h1 className="text-3xl font-semibold text-slate-900">Recent projects</h1>
        <p className="mt-2 text-sm text-slate-500">Pick up where you left off or start a new workspace.</p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <button
            type="button"
            className="flex min-h-[220px] flex-col items-center justify-center gap-4 rounded-3xl border border-slate-200 bg-white px-6 py-8 text-left shadow-sm transition hover:border-blue-200 hover:shadow-md"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-3xl text-blue-600">
              +
            </div>
            <div className="text-lg font-semibold text-slate-800">Create new project</div>
          </button>

          {loading ? (
            <div className="flex min-h-[220px] items-center justify-center rounded-3xl border border-slate-200 bg-white px-6 py-6 text-sm text-slate-500 shadow-sm">
              Loading projects...
            </div>
          ) : null}

          {error ? (
            <div className="flex min-h-[220px] items-center justify-center rounded-3xl border border-red-200 bg-red-50 px-6 py-6 text-sm text-red-500 shadow-sm">
              {error}
            </div>
          ) : null}

          {!loading && !error && projects.length === 0 ? (
            <div className="flex min-h-[220px] items-center justify-center rounded-3xl border border-slate-200 bg-white px-6 py-6 text-sm text-slate-500 shadow-sm">
              No projects yet.
            </div>
          ) : null}

          {projects.map((project, index) => (
            <button
              key={project.id}
              type="button"
              className={`flex min-h-[220px] flex-col justify-between rounded-3xl border border-slate-200 px-6 py-6 text-left shadow-sm transition hover:border-blue-200 hover:shadow-md ${
                cardTints[index % cardTints.length]
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="text-2xl">{project.emoji || '📁'}</div>
                <span className="text-lg text-slate-400">⋮</span>
              </div>
              <div>
                <div className="text-2xl font-semibold text-slate-900">{project.name}</div>
                <div className="mt-2 text-sm text-slate-500">
                  {new Date(project.created_at).toLocaleDateString()}
                </div>
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  )
}
