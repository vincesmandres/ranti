'use client'

import DashboardHeader from '@/components/dashboard-header'

const events = [
  { id: 1, name: 'CYBERPUNK NIGHTS', venue: 'NEON DISTRICT HUB', date: 'OCT 24, 2024', price: '2.45 SOL', category: 'TECH' },
  { id: 2, name: 'SOLANA BREAKPOINT', venue: 'CONVENTION CENTER', date: 'NOV 12, 2024', price: '5.20 SOL', category: 'CONFERENCE' },
  { id: 3, name: 'SUMMER ROOFTOP', venue: 'SKY GARDEN', date: 'DEC 05, 2024', price: '1.80 SOL', category: 'SOCIAL' },
  { id: 4, name: 'HACKER HOUSE', venue: 'UNDERGROUND LAB', date: 'DEC 15, 2024', price: '0.90 SOL', category: 'TECH' },
  { id: 5, name: 'RETROWAVE EXPO', venue: 'NEON ARENA', date: 'JAN 10, 2025', price: '3.10 SOL', category: 'CULTURE' },
  { id: 6, name: 'ZEN GARDEN', venue: 'BOTANIC CENTER', date: 'JAN 25, 2025', price: '1.50 SOL', category: 'SOCIAL' },
]

export default function EventosPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DashboardHeader />

      <div className="flex-1 p-8">
        <h1
          className="text-4xl font-bold text-primary mb-8 uppercase"
          style={{ fontFamily: 'var(--font-climate)' }}
        >
          Eventos
        </h1>

        <div className="grid grid-cols-3 gap-5">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all group cursor-pointer"
            >
              <div className="aspect-video bg-gradient-to-br from-primary/10 via-secondary/5 to-transparent relative flex items-center justify-center">
                <span
                  className="text-5xl font-bold text-primary/20 select-none"
                  style={{ fontFamily: 'var(--font-climate)' }}
                >
                  {event.name.charAt(0)}
                </span>
                <span className="absolute top-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded border border-primary/30 text-primary bg-primary/10">
                  {event.category}
                </span>
              </div>
              <div className="p-4">
                <h3
                  className="text-lg font-bold text-primary mb-1"
                  style={{ fontFamily: 'var(--font-climate)' }}
                >
                  {event.name}
                </h3>
                <p className="text-[10px] font-bold text-muted uppercase tracking-wide mb-3">{event.venue}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted">{event.date}</span>
                  <span
                    className="text-sm font-bold text-secondary"
                    style={{ fontFamily: 'var(--font-grotesk)' }}
                  >
                    {event.price}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
