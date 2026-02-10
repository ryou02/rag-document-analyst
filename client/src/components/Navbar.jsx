import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient.js'

export default function Navbar({ title = 'Project', emoji = '📁', editable = false, onTitleSave }) {
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [draftTitle, setDraftTitle] = useState(title)

  useEffect(() => {
    setDraftTitle(title)
  }, [title])

  const commitTitle = async () => {
    const nextTitle = draftTitle.trim()
    setIsEditing(false)
    if (!nextTitle || nextTitle === title) return
    await onTitleSave?.(nextTitle)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <div className="bg-white/90 shadow-md shadow-slate-200/70 backdrop-blur">
      <header className="mx-auto flex w-full items-center justify-between border-b border-slate-200/70 bg-white/80 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-lg shadow-sm">
            {emoji}
          </div>
          {editable ? (
            <div>
              {isEditing ? (
                <input
                  value={draftTitle}
                  onChange={(event) => setDraftTitle(event.target.value)}
                  onBlur={commitTitle}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      commitTitle()
                    }
                    if (event.key === 'Escape') {
                      setDraftTitle(title)
                      setIsEditing(false)
                    }
                  }}
                  className="w-64 rounded-lg border border-slate-200 bg-white px-3 py-1 text-lg font-semibold text-slate-900 shadow-sm focus:border-blue-300 focus:outline-none"
                  autoFocus
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="text-left text-lg font-semibold text-slate-900 transition hover:text-blue-700"
                >
                  {title}
                </button>
              )}
            </div>
          ) : (
            <div className="text-lg font-semibold text-slate-900">{title}</div>
          )}
        </div>
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
