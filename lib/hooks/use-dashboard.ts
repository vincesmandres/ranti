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

// Mock data for testing/demo
const MOCK_DASHBOARD_DATA: DashboardData = {
  user: { id: 'mock-user', email: null, walletAddress: '8xJp...mK2q', displayName: 'Demo User' },
  profile: { id: 'mock-profile', wallet_address: '8xJp...mK2q', display_name: 'Demo User', phone: null, phoneVerified: false, participation_score: 2840, level: 4, created_at: new Date().toISOString() },
  participation: { score: 2840, level: 4, progress: 92, nextLevelAt: 3000 },
  tickets: {
    active: [
      { id: '1', token_id: 'TKT-001', status: 'active', statusLabel: 'ACTIVE', tier: 'VIP', qr_code: null, created_at: new Date().toISOString(), events: { id: 'e1', name: 'CYBERPUNK NIGHTS', slug: 'cyberpunk-nights', venue: 'NEON DISTRICT HUB', date: '2024-10-24', cover_url: null } },
      { id: '2', token_id: 'TKT-002', status: 'active', statusLabel: 'ACTIVE', tier: 'GA', qr_code: null, created_at: new Date().toISOString(), events: { id: 'e2', name: 'SOLANA BREAKPOINT', slug: 'solana-breakpoint', venue: 'CONVENTION CENTER', date: '2024-11-12', cover_url: null } },
    ],
    checkedIn: [],
    used: [
      { id: '3', token_id: 'TKT-003', status: 'used', statusLabel: 'USED', tier: 'GA', qr_code: null, created_at: new Date().toISOString(), events: { id: 'e3', name: 'SUMMER ROOFTOP', slug: 'summer-rooftop', venue: 'SKY GARDEN', date: '2024-08-15', cover_url: null } },
    ],
    total: 3
  },
  ticketHistory: [],
  rewards: {
    unlocked: [
      { id: 'r1', type: 'badge', name: 'OG Collector', description: 'EARLY ADOPTER', unlocked: true, unlocked_at: new Date().toISOString(), metadata: {} },
      { id: 'r2', type: 'badge', name: 'Genesis Mint', description: 'SEASON 1 RARE', unlocked: true, unlocked_at: new Date().toISOString(), metadata: {} },
      { id: 'r3', type: 'multiplier', name: 'Airdrop Multiplier', description: 'X1.2 ACTIVE', unlocked: true, unlocked_at: new Date().toISOString(), metadata: {} },
    ],
    locked: [
      { id: 'r4', type: 'badge', name: 'Ticket Confirmed', description: 'UNLOCK AT LEVEL 5', unlocked: false, unlocked_at: null, metadata: {} },
    ],
    total: 4
  },
  activity: [
    { id: 'a1', type: 'check_in', title: 'Check-in Verified', description: 'COLLARMELOON 2024', tx_hash: '8xK3...mN2q', created_at: new Date().toISOString() },
    { id: 'a2', type: 'mint', title: 'Asset Minted', description: 'ATTENDIFY VIP PASS', tx_hash: '7rP1...nK4w', created_at: new Date().toISOString() },
    { id: 'a3', type: 'transfer', title: 'Ticket Transferred', description: 'TO 0xB3...F914', tx_hash: '9qL2...aM5x', created_at: new Date().toISOString() },
  ]
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    // Return mock data for demo/testing when not authenticated
    if (res.status === 401) {
      return MOCK_DASHBOARD_DATA
    }
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
