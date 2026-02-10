import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient.js'

export default function ProjectsNavbar() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <div className="bg-white/90 shadow-md shadow-slate-200/70 backdrop-blur">
      <header className="mx-auto flex w-full items-center justify-between border-b border-slate-200/70 bg-white/80 px-6 py-4">
        <div />
        <div className="flex items-center gap-3">
          <button
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 active:translate-y-0 active:scale-[0.98]"
            onClick={handleLogout}
            type="button"
          >
            Log out
          </button>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 text-xs font-semibold text-white">
            J
          </div>
        </div>
      </header>
    </div>
  )
}
