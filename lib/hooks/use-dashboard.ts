'use client'

import { useEffect } from 'react'
import useSWR from 'swr'
import { useAuth } from '@/lib/hooks/use-auth'
import { useWallet } from '@solana/wallet-adapter-react'
import type { DashboardData } from '@/lib/contracts/dashboard'

const buildDemoDashboard = (): DashboardData => ({
  user: {
    id: 'demo-user',
    email: null,
    walletAddress: null,
    displayName: 'Demo User',
  },
  profile: {
    id: 'demo-user',
    wallet_address: null,
    display_name: 'Demo User',
    phone: null,
    phoneVerified: false,
    participation_score: 0,
    level: 1,
    created_at: new Date().toISOString(),
  },
  participation: { score: 0, level: 1, progress: 0, nextLevelAt: 1000 },
  tickets: { active: [], checkedIn: [], used: [], total: 0 },
  ticketHistory: [],
  rewards: { unlocked: [], locked: [], total: 0 },
  activity: [],
  source: 'demo-fallback',
})

const fetcher = async (url: string, allowDemoFallback: boolean) => {
  // #region agent log
  fetch('http://127.0.0.1:7670/ingest/ea11d0db-326d-430d-a16f-2c89927c1050',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'faf176'},body:JSON.stringify({sessionId:'faf176',runId:'initial',hypothesisId:'H5',location:'lib/hooks/use-dashboard.ts:fetcher:start',message:'dashboard fetch started',data:{url,allowDemoFallback},timestamp:Date.now()})}).catch(()=>{});
  // #endregion
  const res = await fetch(url)
  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    if (res.status === 401) {
      if (allowDemoFallback) {
        console.warn('[useDashboard] 401 from /api/dashboard; using demo fallback dataset')
        // #region agent log
        fetch('http://127.0.0.1:7670/ingest/ea11d0db-326d-430d-a16f-2c89927c1050',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'faf176'},body:JSON.stringify({sessionId:'faf176',runId:'initial',hypothesisId:'H5',location:'lib/hooks/use-dashboard.ts:fetcher:401-fallback',message:'dashboard switched to demo fallback after 401',data:{status:res.status,error:error.error||null},timestamp:Date.now()})}).catch(()=>{});
        // #endregion
        return buildDemoDashboard()
      }
      throw new Error(error.error || 'No autenticado. Inicia sesion para ver el dashboard.')
    }
    if (res.status === 403) {
      throw new Error(error.error || 'No autorizado para ver este dashboard.')
    }
    throw new Error(error.error || 'Failed to fetch dashboard')
  }
  const json = await res.json()
  // #region agent log
  fetch('http://127.0.0.1:7670/ingest/ea11d0db-326d-430d-a16f-2c89927c1050',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'faf176'},body:JSON.stringify({sessionId:'faf176',runId:'initial',hypothesisId:'H5',location:'lib/hooks/use-dashboard.ts:fetcher:success',message:'dashboard fetch succeeded',data:{status:res.status,hasData:Boolean(json?.data),ticketsTotal:json?.data?.tickets?.total??null,source:json?.data?.source??'live'},timestamp:Date.now()})}).catch(()=>{});
  // #endregion
  return json.data as DashboardData
}

export function useDashboard() {
  const { user, loading: authLoading } = useAuth()
  const { connected, publicKey } = useWallet()
  const isDemoPhoneVerified =
    typeof window !== 'undefined' && window.sessionStorage.getItem('ranti_phone_verified_demo') === 'true'
  const hasWallet = connected && Boolean(publicKey)
  const canFetch = !authLoading && (Boolean(user) || hasWallet || isDemoPhoneVerified)
  const allowDemoFallback = (hasWallet || isDemoPhoneVerified) && !user
  const { data, error, isLoading, mutate } = useSWR<DashboardData>(
    canFetch ? '/api/dashboard' : null,
    (url: string) => fetcher(url, allowDemoFallback),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 5000,
    }
  )

  useEffect(() => {
    if (!authLoading && !user && !hasWallet) {
      console.info('[useDashboard] no session/wallet; skipping /api/dashboard request')
    }
  }, [authLoading, user, hasWallet])

  return {
    data,
    isLoading: authLoading || (canFetch && isLoading),
    isError: !!error,
    error: error?.message,
    isEmpty: !isLoading && !error && (!data || data.tickets.total === 0),
    refetch: mutate,
  }
}
