import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient.js'

export default function Navbar() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <div className="bg-white/90 shadow-md shadow-slate-200/70 backdrop-blur">
      <header className="mx-auto flex w-full items-center justify-between border-b border-slate-200/70 bg-white/80 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-blue-200 bg-white text-blue-600 shadow-sm">
            RD
          </div>
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Workspace</div>
            <div className="text-lg font-semibold">soc100</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm">
            Share
          </button>
          <button className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm">
            Settings
          </button>
          <button className="rounded-full bg-blue-600 px-5 py-2 text-xs font-semibold text-white shadow-md shadow-blue-200">
            Create notebook
          </button>
          <button
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm"
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
