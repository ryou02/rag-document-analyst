import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient.js'
import AuthContext from './AuthContextBase.js'

export default function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const init = async () => {
      const { data, error } = await supabase.auth.getSession()
      if (error) {
        console.error(error)
      }
      if (isMounted) {
        setSession(data?.session ?? null)
        setUser(data?.session?.user ?? null)
        setLoading(false)
      }
    }

    init()

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setUser(nextSession?.user ?? null)
      setLoading(false)
    })

    return () => {
      isMounted = false
      subscription?.subscription?.unsubscribe()
    }
  }, [])

  const value = useMemo(
    () => ({
      user,
      session,
      loading,
    }),
    [user, session, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
