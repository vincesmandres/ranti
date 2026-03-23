'use client'

import Link from 'next/link'
import DashboardHeader from '@/components/dashboard-header'

const events = [
  { id: '1', name: 'CYBERPUNK NIGHTS', venue: 'NEON DISTRICT HUB', date: 'OCT 24, 2024', price: '2.45 SOL', category: 'TECH' },
  { id: '2', name: 'SOLANA BREAKPOINT', venue: 'CONVENTION CENTER', date: 'NOV 12, 2024', price: '5.20 SOL', category: 'CONFERENCE' },
  { id: '3', name: 'SUMMER ROOFTOP', venue: 'SKY GARDEN', date: 'DEC 05, 2024', price: '1.80 SOL', category: 'SOCIAL' },
  { id: '4', name: 'HACKER HOUSE', venue: 'UNDERGROUND LAB', date: 'DEC 15, 2024', price: '0.90 SOL', category: 'TECH' },
  { id: '5', name: 'RETROWAVE EXPO', venue: 'NEON ARENA', date: 'JAN 10, 2025', price: '3.10 SOL', category: 'CULTURE' },
  { id: '6', name: 'ZEN GARDEN', venue: 'BOTANIC CENTER', date: 'JAN 25, 2025', price: '1.50 SOL', category: 'SOCIAL' },
]

export default function EventosPage() {
  return (
    <div className="min-h-screen bg-[#0E150C] flex flex-col">
      <DashboardHeader />

      <div className="flex-1 p-6 md:p-8">
        <h1
          className="text-4xl md:text-5xl font-bold text-primary mb-8 uppercase"
          style={{ fontFamily: 'var(--font-climate)' }}
        >
          Eventos
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {events.map((event) => (
            <Link
              key={event.id}
              href={`/marketplace/${event.id}`}
              className="bg-[#161D14] border border-[#404A38]/20 rounded-2xl overflow-hidden hover:border-primary/40 transition-all group cursor-pointer hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="aspect-video bg-gradient-to-br from-[#1A2217] to-[#252C21] relative flex items-center justify-center">
                <span
                  className="text-5xl font-bold text-primary/20 select-none group-hover:text-primary/30 transition-colors"
                  style={{ fontFamily: 'var(--font-climate)' }}
                >
                  {event.name.charAt(0)}
                </span>
                <span className={`absolute top-3 left-3 text-[9px] font-bold px-2 py-1 rounded uppercase tracking-wider ${
                  event.category === 'TECH' ? 'bg-primary/20 text-primary border border-primary/30' :
                  event.category === 'CONFERENCE' ? 'bg-secondary/20 text-secondary border border-secondary/30' :
                  'bg-[#252C21] text-muted border border-[#404A38]/30'
                }`}>
                  {event.category}
                </span>
              </div>
              <div className="p-4">
                <h3
                  className="text-lg font-bold text-primary mb-1 group-hover:text-primary/90 transition-colors"
                  style={{ fontFamily: 'var(--font-climate)' }}
                >
                  {event.name}
                </h3>
                <p className="text-[10px] font-bold text-muted uppercase tracking-wide mb-3">{event.venue}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted">{event.date}</span>
                  <span
                    className="text-sm font-bold text-primary"
                    style={{ fontFamily: 'var(--font-grotesk)' }}
                  >
                    {event.price}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
