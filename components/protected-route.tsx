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
  const { connected, publicKey, connecting, disconnecting } = useWallet()
  const router = useRouter()
  const [isReady, setIsReady] = useState(false)
  const [hasChecked, setHasChecked] = useState(false)

  // Consider authenticated if user exists OR wallet is connected
  const isAuthenticated = !!user || (connected && !!publicKey)
  
  // Still loading if auth is loading, wallet is connecting, or wallet hasn't settled
  const isWalletLoading = connecting || disconnecting
  const loading = authLoading || isWalletLoading

  // Bypass auth for testing mode
  if (BYPASS_AUTH_FOR_TESTING) {
    return <>{children}</>
  }

  // Wait for wallet adapter to fully initialize (autoConnect needs time)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true)
    }, 500) // Increased to 500ms to allow autoConnect to complete
    return () => clearTimeout(timer)
  }, [])

  // Only redirect after we're sure the wallet state has settled
  useEffect(() => {
    if (isReady && !loading && !hasChecked) {
      setHasChecked(true)
      console.log('[v0] ProtectedRoute check:', { connected, publicKey: publicKey?.toBase58(), user: !!user, isAuthenticated })
      if (!isAuthenticated) {
        router.push('/')
      }
    }
  }, [isReady, loading, isAuthenticated, hasChecked, router, connected, publicKey, user])

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
