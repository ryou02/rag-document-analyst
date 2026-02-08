import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient.js'
import HomeNavbar from '../components/HomeNavbar.jsx'
import useAuth from '../hooks/useAuth.js'

export default function LoginPage() {
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [oauthLoading, setOauthLoading] = useState(false)

  useEffect(() => {
    if (user && !authLoading) {
      navigate('/projects')
    }
  }, [user, authLoading, navigate])

  const handleLogin = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')

    if (!email) {
      setError('Enter your email to continue.')
      return
    }

    setLoading(true)
    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/projects`,
      },
    })
    setLoading(false)

    if (authError) {
      setError(authError.message)
      return
    }

    setMessage('Check your email for the sign-in link.')
  }

  const handleGoogleLogin = async () => {
    setError('')
    setMessage('')
    setOauthLoading(true)
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/projects`,
      },
    })
    if (oauthError) {
      setError(oauthError.message)
      setOauthLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-white to-blue-100 text-slate-900">
      <HomeNavbar />
      <main className="mx-auto flex min-h-[calc(100vh-88px)] w-full max-w-3xl items-center justify-center px-6">
        <div className="rise-in w-full rounded-3xl border border-slate-200 bg-white/90 p-10 text-center shadow-sm backdrop-blur">
          <h1 className="mt-6 text-2xl font-semibold">RAG Document Analyst</h1>
          <p className="mt-2 text-sm text-slate-500">Sign in to continue to your workspace.</p>

          <div className="mt-6 space-y-4">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={oauthLoading}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <span className="text-base">G</span>
              {oauthLoading ? 'Connecting to Google...' : 'Continue with Google'}
            </button>

            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="h-px flex-1 bg-slate-200" />
              or sign in with email
              <span className="h-px flex-1 bg-slate-200" />
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-blue-300 focus:outline-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? 'Sending link...' : 'Send magic link'}
              </button>
            </form>
          </div>

          {error ? <p className="mt-4 text-sm text-red-500">{error}</p> : null}
          {message ? <p className="mt-4 text-sm text-green-600">{message}</p> : null}

          <p className="mt-6 text-xs text-slate-400">We will email you a secure sign-in link.</p>
        </div>
      </main>
    </div>
  )
}
