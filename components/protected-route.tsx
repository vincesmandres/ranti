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
  const [demoPhoneVerified, setDemoPhoneVerified] = useState(false)
  const isOrganizerRoute = pathname?.startsWith('/organizer')

  const isAuthenticated =
    Boolean(user) ||
    (connected && Boolean(publicKey)) ||
    (!isOrganizerRoute && demoPhoneVerified)
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

  useEffect(() => {
    const raw = sessionStorage.getItem('ranti_phone_verified_demo')
    const value = raw === 'true'
    setDemoPhoneVerified(value)
    // #region agent log
    fetch('http://127.0.0.1:7670/ingest/ea11d0db-326d-430d-a16f-2c89927c1050',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'faf176'},body:JSON.stringify({sessionId:'faf176',runId:'post-fix',hypothesisId:'H6',location:'components/protected-route.tsx:demo-phone-check',message:'protected route read demo phone verification flag',data:{pathname,raw,value},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
  }, [pathname])

  // Redirect only once after auth settles.
  useEffect(() => {
    if (isReady && !loading && !hasChecked) {
      setHasChecked(true)
      // #region agent log
      fetch('http://127.0.0.1:7670/ingest/ea11d0db-326d-430d-a16f-2c89927c1050',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'faf176'},body:JSON.stringify({sessionId:'faf176',runId:'initial',hypothesisId:'H1',location:'components/protected-route.tsx:guard-check',message:'protected route evaluated auth',data:{pathname,authLoading,connected,hasPublicKey:Boolean(publicKey),isReady,loading,isAuthenticated,hasChecked},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
      if (!isAuthenticated) {
        const roleHint = pathname?.startsWith('/organizer') ? 'organizer' : 'user'
        const next = encodeURIComponent(pathname || '/dashboard')
        const target = `/?modal=login&role=${roleHint}&next=${next}`
        console.info('[auth] ProtectedRoute redirecting unauthenticated user to login flow:', target)
        // #region agent log
        fetch('http://127.0.0.1:7670/ingest/ea11d0db-326d-430d-a16f-2c89927c1050',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'faf176'},body:JSON.stringify({sessionId:'faf176',runId:'initial',hypothesisId:'H1',location:'components/protected-route.tsx:redirect',message:'protected route redirecting to home login flow',data:{pathname,target},timestamp:Date.now()})}).catch(()=>{});
        // #endregion
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
