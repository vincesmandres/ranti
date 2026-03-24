'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface User {
  id: string
  email?: string
  wallet_address?: string
  user_metadata?: any
}

interface UseAuthReturn {
  user: User | null
  loading: boolean
  error: string | null
  logout: () => Promise<void>
}

/**
 * Hook to manage authentication state and session
 */
export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()

    // Get current session
    const getSession = async () => {
      try {
        const {
          data: { session },
          error: err,
        } = await supabase.auth.getSession()

        // #region agent log
        fetch('http://127.0.0.1:7670/ingest/ea11d0db-326d-430d-a16f-2c89927c1050',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'faf176'},body:JSON.stringify({sessionId:'faf176',runId:'initial',hypothesisId:'H2',location:'lib/hooks/use-auth.ts:getSession',message:'supabase auth getSession result',data:{hasSession:Boolean(session),hasUser:Boolean(session?.user),userId:session?.user?.id||null,error:err?.message||null},timestamp:Date.now()})}).catch(()=>{});
        // #endregion

        if (err) throw err

        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email,
            wallet_address: session.user.user_metadata?.wallet_address,
            user_metadata: session.user.user_metadata,
          })
        }
      } catch (err) {
        console.error('Session error:', err)
        setError(err instanceof Error ? err.message : 'Session error')
      } finally {
        setLoading(false)
      }
    }

    getSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      // #region agent log
      fetch('http://127.0.0.1:7670/ingest/ea11d0db-326d-430d-a16f-2c89927c1050',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'faf176'},body:JSON.stringify({sessionId:'faf176',runId:'initial',hypothesisId:'H2',location:'lib/hooks/use-auth.ts:onAuthStateChange',message:'supabase auth state changed',data:{event:_event,hasSession:Boolean(session),hasUser:Boolean(session?.user),userId:session?.user?.id||null},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          wallet_address: session.user.user_metadata?.wallet_address,
          user_metadata: session.user.user_metadata,
        })
      } else {
        setUser(null)
      }
    })

    return () => subscription?.unsubscribe()
  }, [])

  const logout = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/auth/logout', { method: 'POST' })

      if (!response.ok) throw new Error('Logout failed')

      setUser(null)
      router.push('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Logout failed')
    } finally {
      setLoading(false)
    }
  }

  return { user, loading, error, logout }
}
