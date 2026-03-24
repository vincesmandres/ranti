'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/lib/hooks/use-auth'
import { useWallet } from '@solana/wallet-adapter-react'
import type { OrganizerData, OrganizerEvent } from '@/lib/contracts/dashboard'

interface CommunityMember {
  user_id: string
  name: string
  wallet: string
  participation: number
  status: 'Verified' | 'Syncing' | 'Pending'
}

interface OrganizerStats {
  totalEvents: number
  activeEvents: number
  totalTicketsSold: number
  totalMembers: number
}

interface CreateEventData {
  name: string
  event_id: string
  wallet_address?: string
  description?: string
  event_date?: string
  venue?: string
  max_capacity?: number
  image_url?: string
}

interface TransactionData {
  user_signature: string
  organizer_signature: string
  asset_id: string
  transaction_hash: string
  proof_mode?: 'demo-backend-record' | 'onchain'
  network?: string
  reference_url?: string | null
}

const ENABLE_ORGANIZER_DEMO_FALLBACK =
  process.env.NEXT_PUBLIC_ENABLE_ORGANIZER_DEMO_FALLBACK !== 'false'

export function useOrganizer() {
  const { user, loading: authLoading } = useAuth()
  const { connected, publicKey } = useWallet()
  const hasWallet = connected && Boolean(publicKey)
  const [data, setData] = useState<OrganizerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    if (authLoading) return
    if (!user && !hasWallet) {
      setData(null)
      setError('No autenticado. Inicia sesion o conecta wallet para ver Organizer.')
      setLoading(false)
      console.info('[useOrganizer] no session/wallet; skipping /api/organizer request')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/organizer')
      
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        const serverError = payload?.error as string | undefined
        if (response.status === 401) {
          if (ENABLE_ORGANIZER_DEMO_FALLBACK) {
            console.warn('[useOrganizer] 401 from /api/organizer; using explicit demo fallback dataset')
            setData({
              profile: null,
              events: [
                { id: '1', name: 'NEON\nGENESIS', status: 'ACTIVE', event_date: '2024-05-24', venue: 'Warehouse 01', tickets_sold: 482, max_capacity: 500, image_url: '/placeholder.svg?height=120&width=200' },
                { id: '2', name: 'SOLANA\nSUMMIT', status: 'PAST', event_date: '2024-03-12', venue: 'The Block', tickets_sold: 1200, max_capacity: 1200, image_url: '/placeholder.svg?height=120&width=200' },
                { id: '3', name: 'VOXEL ART\nEXPO', status: 'ACTIVE', event_date: '2024-06-15', venue: 'Meta-Gallery', tickets_sold: 156, max_capacity: 300, image_url: '/placeholder.svg?height=120&width=200' },
              ],
              members: [
                { user_id: '1', name: 'Alex Rivera', wallet: '8xJp...mK2q', participation: 4, status: 'Verified' },
                { user_id: '2', name: 'Satoshi Nakamoto', wallet: '1A1z...P5QG', participation: 5, status: 'Verified' },
                { user_id: '3', name: 'Elena Vance', wallet: 'f9rX...2pL1', participation: 1, status: 'Syncing' },
                { user_id: '4', name: 'Marcus Holloway', wallet: 'W9q2...aA8s', participation: 3, status: 'Verified' },
                { user_id: '5', name: 'Sarah Connor', wallet: 'T800...Skyn', participation: 2, status: 'Verified' },
              ],
              stats: { totalEvents: 3, activeEvents: 2, totalTicketsSold: 1838, totalMembers: 1284 },
              source: 'demo-fallback',
            })
            return
          }
          throw new Error(serverError || 'No autenticado. Inicia sesion para ver Organizer.')
        }
        if (response.status === 403) {
          throw new Error(serverError || 'No autorizado para Organizer.')
        }
        throw new Error(serverError || 'Failed to fetch organizer data')
      }

      const result = await response.json()
      const payload = result?.data ?? result
      const normalizedEvents: OrganizerEvent[] = (payload?.events || []).map((event: any) => ({
        id: event.id,
        name: event.name,
        status: event.status,
        event_date: event.event_date || event.date || new Date().toISOString(),
        venue: event.venue || 'TBD',
        tickets_sold: Number(event.tickets_sold || 0),
        max_capacity: Number(event.max_capacity || 0),
        image_url: event.image_url || event.image || '/placeholder.svg?height=120&width=200',
      }))
      setData({
        ...payload,
        events: normalizedEvents,
        source: 'live',
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [authLoading, user, hasWallet])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const createEvent = async (eventData: CreateEventData): Promise<{ success: boolean; transaction?: TransactionData; error?: string }> => {
    try {
      const response = await fetch('/api/organizer/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData)
      })

      if (!response.ok) {
        const error = await response.json()
        return { success: false, error: error.error || 'Failed to create event' }
      }

      const result = await response.json()
      
      // Refresh data after creating event
      await fetchData()

      return { 
        success: true, 
        transaction: result.transaction 
      }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
    }
  }

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    createEvent
  }
}
