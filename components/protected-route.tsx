'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/use-auth'
import { useWallet } from '@solana/wallet-adapter-react'

interface ProtectedRouteProps {
  children: React.ReactNode
}

// Optional local bypass for controlled testing.
const BYPASS_AUTH_FOR_TESTING = process.env.NEXT_PUBLIC_BYPASS_AUTH_FOR_TESTING === 'true'

/**
 * Client-side gate for “app shell” routes. Middleware only refreshes Supabase cookies
 * and cannot validate access by itself. In demo mode, wallet connection is accepted
 * so the original onboarding flow (wallet/phone -> role -> dashboard) keeps working.
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading: authLoading } = useAuth()
  const { connected, publicKey, connecting, disconnecting } = useWallet()
  const router = useRouter()
  const pathname = usePathname()
  const [isReady, setIsReady] = useState(false)
  const [hasChecked, setHasChecked] = useState(false)

  const isAuthenticated = Boolean(user) || (connected && Boolean(publicKey))
  const loading = authLoading || connecting || disconnecting

  // Bypass auth for testing mode
  if (BYPASS_AUTH_FOR_TESTING) {
    return <>{children}</>
  }

  // Give client auth hydration a brief settle window.
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true)
    }, 500) // Increased to 500ms to allow autoConnect to complete
    return () => clearTimeout(timer)
  }, [])

  // Redirect only once after auth settles.
  useEffect(() => {
    if (isReady && !loading && !hasChecked) {
      setHasChecked(true)
      if (!isAuthenticated) {
        const roleHint = pathname?.startsWith('/organizer') ? 'organizer' : 'user'
        const next = encodeURIComponent(pathname || '/dashboard')
        const target = `/?modal=login&role=${roleHint}&next=${next}`
        console.info('[auth] ProtectedRoute redirecting unauthenticated user to login flow:', target)
        router.push(target)
      }
    }
  }, [isReady, loading, isAuthenticated, hasChecked, router, pathname])

  if (!isReady || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
