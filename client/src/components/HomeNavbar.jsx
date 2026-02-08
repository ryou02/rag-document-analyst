import { Link, NavLink } from 'react-router-dom'

export default function HomeNavbar() {
  return (
    <div className="bg-white/90 shadow-md shadow-slate-200/70 backdrop-blur">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between border-b border-slate-200/70 bg-white/80 px-6 py-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="text-lg font-semibold text-slate-900">RAG Document Analyst</div>
        </Link>
        <nav className="flex items-center gap-3 text-sm font-semibold text-slate-600">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `rounded-full px-4 py-2 transition ${
                isActive ? 'bg-blue-50 text-blue-700' : 'hover:bg-slate-100'
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/login"
            className={({ isActive }) =>
              `rounded-full border border-slate-200 px-4 py-2 transition ${
                isActive ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:bg-slate-100'
              }`
            }
          >
            Login
          </NavLink>
        </nav>
      </header>
    </div>
  )
}
