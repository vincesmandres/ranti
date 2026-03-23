'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/use-auth'
import { useWallet } from '@solana/wallet-adapter-react'

interface ProtectedRouteProps {
  children: React.ReactNode
}

// Optional local bypass for controlled testing.
const BYPASS_AUTH_FOR_TESTING = process.env.NEXT_PUBLIC_BYPASS_AUTH_FOR_TESTING === 'true'

/**
 * Wrapper component to protect routes behind authentication
 * Accepts either traditional auth OR a connected Solana wallet
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading: authLoading } = useAuth()
  const { connected, publicKey } = useWallet()
  const router = useRouter()
  const [isReady, setIsReady] = useState(false)

  // Consider authenticated if user exists OR wallet is connected
  const isAuthenticated = !!user || (connected && !!publicKey)
  const loading = authLoading && !connected

  // Bypass auth for testing mode
  if (BYPASS_AUTH_FOR_TESTING) {
    return <>{children}</>
  }

  useEffect(() => {
    // Wait a tick for wallet state to initialize
    const timer = setTimeout(() => {
      setIsReady(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (isReady && !loading && !isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, loading, router, isReady])

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
