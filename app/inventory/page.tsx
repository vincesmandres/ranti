'use client'

import Link from 'next/link'
import { useState } from 'react'
import DashboardHeader from '@/components/dashboard-header'

const tickets = [
  { id: 1, name: 'CYBERPUNK NIGHTS', venue: 'NEON DISTRICT HUB', date: '24 OCT 2024', code: '#8812', organizer: 'Neon Syndicates' },
  { id: 2, name: 'SOLANA BREAKPOINT', venue: 'CONVENTION CENTER', date: '12 NOV 2024', code: '#4521', organizer: 'Solana Foundation' },
]

export default function Inventory() {
  const [selectedTicket, setSelectedTicket] = useState(tickets[0])

  return (
    <main className="min-h-screen bg-background">
      <DashboardHeader />
      <div className="p-8">
        <h2 className="text-4xl font-bold text-primary mb-8" style={{ fontFamily: 'var(--font-climate)' }}>INVENTORY</h2>

        <div className="flex gap-8">
          {/* Tickets List */}
          <div className="w-64 space-y-4">
            {tickets.map((ticket) => (
              <button
                key={ticket.id}
                onClick={() => setSelectedTicket(ticket)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selectedTicket.id === ticket.id 
                    ? 'bg-primary/10 border-primary' 
                    : 'bg-card border-border hover:border-primary/30'
                }`}
              >
                <p className="text-sm font-bold text-primary" style={{ fontFamily: 'var(--font-climate)' }}>
                  {ticket.name}
                </p>
                <p className="text-xs text-muted mt-1">{ticket.venue}</p>
              </button>
            ))}
          </div>

          {/* Ticket Detail */}
          <div className="flex-1 bg-card border border-border rounded-2xl p-8">
            <div className="flex gap-8">
              {/* QR Code */}
              <div className="flex-shrink-0">
                <div className="w-48 h-48 bg-background border border-primary/30 rounded-xl p-4">
                  <div className="w-full h-full grid grid-cols-8 grid-rows-8 gap-1">
                    {Array.from({ length: 64 }).map((_, i) => (
                      <div 
                        key={i} 
                        className={`rounded-sm ${Math.random() > 0.5 ? 'bg-primary' : 'bg-transparent'}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-center text-xs text-muted mt-2">Escanear Codigo</p>
              </div>

              {/* Details */}
              <div className="flex-1">
                <div className="mb-6">
                  <p className="text-xs text-muted uppercase tracking-wide mb-1">Autorizado Por</p>
                  <p className="text-sm font-bold text-foreground">{selectedTicket.organizer}</p>
                </div>

                <h3 className="text-3xl font-bold text-primary mb-2" style={{ fontFamily: 'var(--font-climate)' }}>
                  {selectedTicket.name}
                </h3>
                <p className="text-sm text-muted mb-6">{selectedTicket.venue}</p>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div>
                    <p className="text-xs text-muted uppercase tracking-wide mb-1">ID</p>
                    <p className="text-lg font-bold text-secondary" style={{ fontFamily: 'var(--font-grotesk)' }}>{selectedTicket.code}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted uppercase tracking-wide mb-1">Fecha</p>
                    <p className="text-lg font-bold text-primary" style={{ fontFamily: 'var(--font-grotesk)' }}>{selectedTicket.date}</p>
                  </div>
                </div>

                <button className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-colors">
                  Activate Access Key
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
