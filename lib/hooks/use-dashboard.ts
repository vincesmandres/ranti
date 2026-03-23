'use client'

import useSWR from 'swr'

export interface DashboardData {
  user: {
    id: string
    email: string | null
    walletAddress: string | null
    displayName: string
  }
  profile: {
    id: string
    wallet_address: string | null
    display_name: string | null
    phone: string | null
    phoneVerified: boolean
    participation_score: number
    level: number
    created_at: string
  }
  participation: {
    score: number
    level: number
    progress: number
    nextLevelAt: number
  }
  tickets: {
    active: Ticket[]
    checkedIn: Ticket[]
    used: Ticket[]
    total: number
  }
  ticketHistory: TicketHistoryItem[]
  rewards: {
    unlocked: Reward[]
    locked: Reward[]
    total: number
  }
  activity: ActivityItem[]
}

export interface Ticket {
  id: string
  token_id: string | null
  status: 'issued' | 'active' | 'checked_in' | 'used' | 'expired' | 'cancelled'
  statusLabel: string
  tier: string
  qr_code: string | null
  created_at: string
  events: {
    id: string
    name: string
    slug: string
    venue: string | null
    date: string
    cover_url: string | null
  } | null
}

export interface TicketHistoryItem {
  id: string
  status: string
  created_at: string
  events: { name: string } | null
}

export interface Reward {
  id: string
  type: string
  name: string
  description: string | null
  unlocked: boolean
  unlocked_at: string | null
  metadata: Record<string, unknown>
}

export interface ActivityItem {
  id: string
  type: string
  title: string
  description: string | null
  tx_hash: string | null
  created_at: string
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to fetch')
  }
  const json = await res.json()
  return json.data as DashboardData
}

export function useDashboard() {
  const { data, error, isLoading, mutate } = useSWR<DashboardData>(
    '/api/dashboard',
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 5000,
    }
  )

  return {
    data,
    isLoading,
    isError: !!error,
    error: error?.message,
    isEmpty: !isLoading && !error && (!data || data.tickets.total === 0),
    refetch: mutate,
  }
}
