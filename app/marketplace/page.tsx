'use client'

import Link from 'next/link'
import DashboardHeader from '@/components/dashboard-header'

const upcomingEvents = [
  { 
    id: '1', 
    name: 'SOLANA\nSUMMER FEST', 
    price: 4.5, 
    date: 'JUNE 28, 2024',
    venue: 'OCEANVIEW',
    badge: 'COMMUNITY'
  },
  { 
    id: '3', 
    name: 'DARK MODE\nSUMMIT', 
    price: 12.0, 
    date: 'JULY 15, 2024',
    venue: 'SINGAPORE',
    badge: 'VIP PRESALE'
  },
  { 
    id: '4', 
    name: 'RANTI LAUNCH\nPARTY', 
    price: 0.05, 
    date: 'AUGUST 01, 2024',
    venue: 'NEW YORK',
    badge: 'EARLY'
  },
]

const futureEvents = [
  { id: '5', organizer: 'Solana Labs', event: 'Breakpoint Workshop Series', venue: '12 OCT 2025', price: 2.5 },
  { id: '6', organizer: 'Mean DAO', event: 'Cross-Chain Liquidity Night', venue: '24 OCT 2025', price: 1.8 },
  { id: '7', organizer: 'AI DAO', event: 'Autonomous Agents Meetup', venue: '05 NOV 2025', price: 3.2 },
  { id: '8', organizer: 'World Stunning', event: 'Esports Finals VIP', venue: '18 DEC 2025', price: 8.0 },
]

export default function Marketplace() {
  return (
    <main className="min-h-screen bg-[#0E150C]">
      <DashboardHeader />

      <div className="p-6 md:p-8">
        {/* Header */}
        <h1 
          className="text-4xl md:text-5xl font-bold text-primary mb-8"
          style={{ fontFamily: 'var(--font-climate)' }}
        >
          PROXIMOS EVENTOS
        </h1>

        {/* Upcoming Events Carousel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          {upcomingEvents.map((event) => (
            <Link
              key={event.id}
              href={`/marketplace/${event.id}`}
              className="group bg-[#161D14] border border-[#404A38]/20 rounded-2xl overflow-hidden hover:border-primary/40 transition-all hover:shadow-lg hover:shadow-primary/5"
            >
              {/* Top Section - Badge & Price */}
              <div className="p-4 pb-0">
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[9px] font-bold px-2 py-1 rounded uppercase tracking-wider ${
                    event.badge === 'COMMUNITY' ? 'bg-primary/20 text-primary border border-primary/30' :
                    event.badge === 'VIP PRESALE' ? 'bg-secondary/20 text-secondary border border-secondary/30' :
                    'bg-[#252C21] text-muted border border-[#404A38]/30'
                  }`}>
                    {event.badge}
                  </span>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary" style={{ fontFamily: 'var(--font-grotesk)' }}>
                      {event.price} <span className="text-sm text-muted">SOL</span>
                    </p>
                    <p className="text-[9px] text-muted uppercase tracking-wide">PRESALE</p>
                  </div>
                </div>
              </div>

              {/* Event Image Placeholder */}
              <div className="h-32 bg-gradient-to-br from-[#1A2217] to-[#252C21] mx-4 rounded-xl mb-4 relative overflow-hidden flex items-center justify-center">
                <div className="w-16 h-16 border border-primary/20 rounded-xl flex items-center justify-center">
                  <span className="text-3xl text-primary/30" style={{ fontFamily: 'var(--font-climate)' }}>
                    {event.name.charAt(0)}
                  </span>
                </div>
              </div>

              {/* Event Name */}
              <div className="px-4 pb-4">
                <h3 
                  className="text-xl font-bold text-primary whitespace-pre-line leading-tight mb-2"
                  style={{ fontFamily: 'var(--font-climate)' }}
                >
                  {event.name}
                </h3>
                <div className="flex items-center justify-between">
                  <p className="text-[10px] text-muted uppercase tracking-wide">{event.date}</p>
                  <p className="text-[10px] text-muted uppercase tracking-wide">{event.venue}</p>
                </div>

                {/* Progress Bars */}
                <div className="flex gap-1 mt-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-sm ${i < 4 ? 'bg-primary' : 'bg-[#404A38]/30'}`}
                    />
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Future Events Section */}
        <h2 
          className="text-3xl md:text-4xl font-bold text-primary mb-6"
          style={{ fontFamily: 'var(--font-climate)' }}
        >
          EVENTOS FUTUROS
        </h2>

        {/* Events Table */}
        <div className="bg-[#161D14] border border-[#404A38]/20 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#404A38]/20">
                <th className="text-left px-6 py-4 text-[10px] font-bold text-muted uppercase tracking-widest">Organizer</th>
                <th className="text-left px-6 py-4 text-[10px] font-bold text-muted uppercase tracking-widest">Event</th>
                <th className="text-left px-6 py-4 text-[10px] font-bold text-muted uppercase tracking-widest">Venue</th>
                <th className="text-left px-6 py-4 text-[10px] font-bold text-muted uppercase tracking-widest">Happens On</th>
                <th className="text-right px-6 py-4 text-[10px] font-bold text-muted uppercase tracking-widest"></th>
              </tr>
            </thead>
            <tbody>
              {futureEvents.map((event) => (
                <tr key={event.id} className="border-b border-[#404A38]/10 hover:bg-[#1A2217]/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-xs font-bold text-primary">{event.organizer}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-foreground">{event.event}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-muted">{event.venue}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-muted">{event.price} SOL</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/marketplace/${event.id}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-[#143800] text-[10px] font-bold rounded-lg hover:bg-primary/90 transition-all hover:shadow-md hover:shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      BUY NOW
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}
