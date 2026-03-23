'use client'

import { AuthLayout } from '@/components/layouts/auth-layout'
import { TicketCard, type TicketData } from '@/components/ui/ticket-card'
import { ActionCTA } from '@/components/ui/action-cta'

const tickets: TicketData[] = [
  {
    id: '1',
    name: 'CYBERPUNK\nNIGHTS',
    venue: 'NEON DISTRICT HUB',
    date: 'OCT 24',
    year: '2024',
    status: 'active',
  },
  {
    id: '2',
    name: 'SOLANA\nBREAKPOINT',
    venue: 'CONVENTION CENTER',
    date: 'NOV 12',
    year: '2024',
    status: 'active',
  },
  {
    id: '3',
    name: 'SUMMER\nROOFTOP',
    venue: 'SKY GARDEN',
    date: 'AUG 15',
    year: '2024',
    status: 'used',
  },
]

export default function TicketsPage() {
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

        {/* Tickets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              href={`/tickets/${ticket.id}`}
            />
          ))}
        </div>

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
