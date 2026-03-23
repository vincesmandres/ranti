'use client'

import { useState, useEffect, useCallback } from 'react'

interface OrganizerEvent {
  id: string
  name: string
  status: 'ACTIVE' | 'PAST'
  event_date: string
  venue: string
  tickets_sold: number
  max_capacity: number
  image: string
}

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

interface OrganizerData {
  profile: any
  events: OrganizerEvent[]
  members: CommunityMember[]
  stats: OrganizerStats
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
}

export function useOrganizer() {
  const [data, setData] = useState<OrganizerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/organizer')
      
      if (!response.ok) {
        if (response.status === 401) {
          // Return mock data for demo purposes when not authenticated
          setData({
            profile: null,
            events: [
              { id: '1', name: 'NEON\nGENESIS', status: 'ACTIVE', event_date: '2024-05-24', venue: 'Warehouse 01', tickets_sold: 482, max_capacity: 500, image: '/placeholder.svg?height=120&width=200' },
              { id: '2', name: 'SOLANA\nSUMMIT', status: 'PAST', event_date: '2024-03-12', venue: 'The Block', tickets_sold: 1200, max_capacity: 1200, image: '/placeholder.svg?height=120&width=200' },
              { id: '3', name: 'VOXEL ART\nEXPO', status: 'ACTIVE', event_date: '2024-06-15', venue: 'Meta-Gallery', tickets_sold: 156, max_capacity: 300, image: '/placeholder.svg?height=120&width=200' },
            ],
            members: [
              { user_id: '1', name: 'Alex Rivera', wallet: '8xJp...mK2q', participation: 4, status: 'Verified' },
              { user_id: '2', name: 'Satoshi Nakamoto', wallet: '1A1z...P5QG', participation: 5, status: 'Verified' },
              { user_id: '3', name: 'Elena Vance', wallet: 'f9rX...2pL1', participation: 1, status: 'Syncing' },
              { user_id: '4', name: 'Marcus Holloway', wallet: 'W9q2...aA8s', participation: 3, status: 'Verified' },
              { user_id: '5', name: 'Sarah Connor', wallet: 'T800...Skyn', participation: 2, status: 'Verified' },
            ],
            stats: { totalEvents: 3, activeEvents: 2, totalTicketsSold: 1838, totalMembers: 1284 }
          })
          return
        }
        throw new Error('Failed to fetch organizer data')
      }

      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [])

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
