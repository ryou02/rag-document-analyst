import { useMemo, useState } from 'react'
import { getUserAvatarCandidates, getUserInitial } from '../lib/userAvatar.js'

export default function UserAvatar({ user, title, className = '' }) {
  const candidates = useMemo(() => getUserAvatarCandidates(user), [user])
  const [index, setIndex] = useState(0)
  const src = candidates[index] || ''
  const initial = getUserInitial(user)

  return (
    <div
      title={title}
      className={`flex items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white text-xs font-semibold text-slate-700 ${className}`}
    >
      {src ? (
        <img
          src={src}
          alt={title || 'User avatar'}
          className="h-full w-full object-cover"
          onError={() => setIndex((prev) => prev + 1)}
        />
      ) : (
        initial
      )}
    </div>
  )
}
