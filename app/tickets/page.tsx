'use client'

import { useEffect, useState } from 'react'
import { AuthLayout } from '@/components/layouts/auth-layout'
import { TicketCard, type TicketData } from '@/components/ui/ticket-card'
import { ActionCTA } from '@/components/ui/action-cta'

type ApiTicket = {
  id: string
  status: string
  events: {
    name: string
    venue: string | null
    date: string | null
  } | null
}

function mapStatus(status: string): TicketData['status'] {
  if (['used', 'expired', 'cancelled'].includes(status)) return 'used'
  if (['checked_in', 'claimed', 'completed', 'rewarded'].includes(status)) return 'pending'
  return 'active'
}

export default function TicketsPage() {
  const [tickets, setTickets] = useState<TicketData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadTickets = async () => {
      try {
        const response = await fetch('/api/tickets')
        if (!response.ok) return
        const json = await response.json()
        const mapped: TicketData[] = ((json.data as ApiTicket[]) || []).map((ticket) => {
          const eventDate = ticket.events?.date ? new Date(ticket.events.date) : new Date()
          return {
            id: ticket.id,
            name: (ticket.events?.name || 'EVENTO').replaceAll(' ', '\n'),
            venue: ticket.events?.venue || 'TBA',
            date: eventDate
              .toLocaleDateString('es-MX', { month: 'short', day: '2-digit' })
              .toUpperCase(),
            year: String(eventDate.getFullYear()),
            status: mapStatus(ticket.status),
          }
        })
        setTickets(mapped)
      } finally {
        setLoading(false)
      }
    }

    void loadTickets()
  }, [])

  return (
    <AuthLayout>
      <div className="p-4 md:p-6 lg:p-8 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'var(--font-climate)' }}>
              Mis Tickets
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              {tickets.length} tickets en tu coleccion
            </p>
          </div>
          <ActionCTA
            href="/marketplace"
            variant="outline"
            size="sm"
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            }
            iconPosition="left"
          >
            Adquirir
          </ActionCTA>
        </div>

        {loading ? (
          <div className="py-10 text-sm text-muted-foreground">Cargando tickets...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tickets.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                href={`/tickets/${ticket.id}`}
              />
            ))}
          </div>
        )}

        {/* Empty state placeholder */}
        {tickets.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">No tienes tickets</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
              Explora el marketplace para encontrar eventos y adquirir tus primeros tickets.
            </p>
            <ActionCTA href="/marketplace" variant="primary" size="md">
              Explorar Marketplace
            </ActionCTA>
          </div>
        )}
      </div>
    </AuthLayout>
  )
}
