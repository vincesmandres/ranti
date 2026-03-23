'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/use-auth'

interface ProtectedRouteProps {
  children: React.ReactNode
}

// Optional local bypass for controlled testing.
const BYPASS_AUTH_FOR_TESTING = process.env.NEXT_PUBLIC_BYPASS_AUTH_FOR_TESTING === 'true'

/**
 * Wrapper component to protect routes behind authentication
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  // Bypass auth for testing mode
  if (BYPASS_AUTH_FOR_TESTING) {
    return <>{children}</>
  }

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}
