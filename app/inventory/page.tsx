'use client'

import Link from 'next/link'
import { useState } from 'react'

const tickets = [
  { id: 1, name: 'CYBERPUNK NIGHTS', venue: 'NEON DISTRICT HUB', date: '24 OCT 2024', code: '#8812', organizer: 'Neon Syndicates' },
  { id: 2, name: 'SOLANA BREAKPOINT', venue: 'CONVENTION CENTER', date: '12 NOV 2024', code: '#4521', organizer: 'Solana Foundation' },
]

export default function Inventory() {
  const [selectedTicket, setSelectedTicket] = useState(tickets[0])

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/dashboard">
            <h1 className="text-2xl font-bold text-primary" style={{ fontFamily: 'var(--font-climate)' }}>RANTI</h1>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 text-muted hover:text-foreground transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
          <button className="p-2 text-muted hover:text-foreground transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </header>

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
