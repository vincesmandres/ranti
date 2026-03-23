'use client'

import Link from 'next/link'
import { AuthLayout } from '@/components/layouts/auth-layout'

const rewards = [
  {
    id: 1,
    name: 'OG Collector',
    sub: 'EARLY ADOPTER',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    id: 2,
    name: 'Genesis Mint',
    sub: 'SEASON 1 RARE',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
      </svg>
    ),
  },
  {
    id: 3,
    name: 'Airdrop Multiplier',
    sub: 'X1.2 ACTIVE',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    id: 4,
    name: 'Ticket Confirmed',
    sub: 'UNLOCK AT LEVEL 5',
    locked: true,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
]

const onChainActivity = [
  { icon: 'check', label: 'Check-in Verified', sub: 'LOLLAPALOOZA 2024' },
  { icon: 'mint', label: 'Asset Minted', sub: 'AFTERPARTY VIP PASS' },
  { icon: 'transfer', label: 'Ticket Transferred', sub: 'TO 0X82...F91A' },
]

const tickets = [
  {
    id: 1,
    name: 'CYBERPUNK\nNIGHTS',
    venue: 'NEON DISTRICT HUB',
    date: 'OCT 24',
    year: '2024',
    status: 'ACTIVE',
    active: true,
    bg: '#B8FF8C',
    fg: '#0E150C',
  },
  {
    id: 2,
    name: 'SOLANA\nBREAKPOINT',
    venue: 'CONVENTION CENTER',
    date: 'NOV 12',
    year: '2024',
    status: 'ACTIVE',
    active: true,
    bg: '#161D14',
    fg: '#B8FF8C',
  },
  {
    id: 3,
    name: 'SUMMER\nROOFTOP',
    venue: 'SKY GARDEN',
    date: 'AUG 15',
    year: '2024',
    status: 'USED',
    active: false,
    bg: '#161D14',
    fg: '#5E6659',
  },
]

export default function Dashboard() {
  return (
    <AuthLayout>
      <div className="flex flex-1 overflow-hidden min-h-[calc(100vh-56px)]">
        {/* Left Panel */}
        <div className="w-[480px] border-r border-border flex flex-col overflow-y-auto">
          {/* Score */}
          <div className="p-6 border-b border-border">
            <p className="text-[10px] font-bold tracking-widest text-muted uppercase mb-3">
              Puntaje de Participacion
            </p>
            <div
              className="text-[80px] font-bold text-primary leading-none mb-4"
              style={{ fontFamily: 'var(--font-climate)' }}
            >
              2,840
            </div>
            <div className="flex items-center gap-4 mb-3">
              <div>
                <p className="text-[10px] text-muted uppercase tracking-wide">Nivel</p>
                <p className="text-xs font-bold text-foreground">Protocol Level 4</p>
              </div>
              <div>
                <p className="text-[10px] text-muted uppercase tracking-wide">Siguiente Rango</p>
                <p className="text-xs font-bold text-foreground">92% al Siguiente Rango</p>
              </div>
            </div>
            {/* Progress bar */}
            <div className="flex gap-1 mt-1">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-sm ${i < 11 ? 'bg-primary' : 'bg-border'}`}
                />
              ))}
            </div>
          </div>

          {/* Rewards + On-chain Activity */}
          <div className="flex flex-1 divide-x divide-border">
            {/* Rewards */}
            <div className="flex-1 p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-bold tracking-widest text-foreground uppercase">Rewards</p>
                <button className="text-[10px] font-bold text-primary uppercase tracking-wide hover:underline">
                  View All
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {rewards.map((r) => (
                  <div
                    key={r.id}
                    className={`rounded-xl border p-3 flex flex-col gap-2 ${
                      r.locked
                        ? 'border-border opacity-40'
                        : 'border-border hover:border-primary/40 transition-colors'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        r.locked ? 'bg-muted/10 text-muted' : 'bg-primary/20 text-primary'
                      }`}
                    >
                      {r.icon}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground leading-tight">{r.name}</p>
                      <p className="text-[10px] text-muted mt-0.5">{r.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* On-chain Activity */}
            <div className="flex-1 p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-bold tracking-widest text-foreground uppercase">On-chain Activity</p>
                <button className="text-[10px] text-muted hover:text-primary transition-colors">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                  </svg>
                </button>
              </div>
              <div className="space-y-3">
                {onChainActivity.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-xl border border-border hover:border-primary/30 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      {item.icon === 'check' && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#B8FF8C" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                      )}
                      {item.icon === 'mint' && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#B8FF8C" strokeWidth="2"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                      )}
                      {item.icon === 'transfer' && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#B8FF8C" strokeWidth="2"><polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /><polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 0 1-4 4H3" /></svg>
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground">{item.label}</p>
                      <p className="text-[10px] text-muted mt-0.5">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Mis Tickets */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          {/* Panel header */}
          <div className="px-6 pt-6 pb-4 flex items-center justify-between">
            <h2
              className="text-2xl font-bold text-foreground"
              style={{ fontFamily: 'var(--font-climate)' }}
            >
              Mis Tickets
            </h2>
            <Link
              href="/marketplace"
              className="text-[10px] font-bold text-muted uppercase tracking-wide hover:text-primary transition-colors"
            >
              View All
            </Link>
          </div>

          {/* Ticket list */}
          <div className="flex-1 px-6 space-y-4 pb-4 overflow-y-auto">
            {tickets.map((ticket) => (
              <Link
                key={ticket.id}
                href={`/inventory?ticket=${ticket.id}`}
                className={`block group relative ${!ticket.active ? 'opacity-60 grayscale' : ''}`}
              >
                <div
                  className="rounded-xl overflow-hidden transition-all hover:scale-[1.02]"
                  style={{ background: ticket.bg }}
                >
                  <div className="p-6">
                    {/* Top row */}
                    <div className="flex justify-between items-start mb-8">
                      <span
                        className="text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-[0.2em]"
                        style={{
                          color: ticket.active && ticket.bg === '#B8FF8C' ? '#143800' : ticket.fg,
                          border: ticket.active && ticket.bg === '#B8FF8C' ? '1px solid #143800' : `1px solid ${ticket.fg}40`,
                          background: ticket.active && ticket.bg !== '#B8FF8C' ? '#B8FF8C' : 'transparent',
                        }}
                      >
                        {ticket.status}
                      </span>
                      <div className="text-right">
                        <p className="text-xs font-bold uppercase" style={{ fontFamily: 'var(--font-grotesk)', color: ticket.fg }}>
                          {ticket.date}
                        </p>
                        <p className="text-xl font-black leading-none" style={{ fontFamily: 'var(--font-grotesk)', color: ticket.fg }}>
                          {ticket.year}
                        </p>
                      </div>
                    </div>

                    {/* Title */}
                    <h3
                      className="text-2xl uppercase leading-tight mb-4 whitespace-pre-line"
                      style={{ fontFamily: 'var(--font-climate)', color: ticket.fg }}
                    >
                      {ticket.name}
                    </h3>

                    {/* Bottom row */}
                    <div className="flex justify-between items-end pt-4 mt-8" style={{ borderTop: `1px solid ${ticket.fg}20` }}>
                      <div>
                        <p className="text-[10px] uppercase font-bold tracking-widest opacity-60" style={{ color: ticket.fg }}>
                          Venue
                        </p>
                        <p className="text-sm font-bold" style={{ fontFamily: 'var(--font-grotesk)', color: ticket.fg }}>
                          {ticket.venue}
                        </p>
                      </div>
                      {/* QR Icon */}
                      <div
                        className="w-12 h-12 flex items-center justify-center rounded"
                        style={{ background: ticket.bg === '#B8FF8C' ? '#14380010' : '#B8FF8C10' }}
                      >
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={ticket.fg} strokeWidth="1.5">
                          <rect x="3" y="3" width="7" height="7" rx="1" />
                          <rect x="14" y="3" width="7" height="7" rx="1" />
                          <rect x="3" y="14" width="7" height="7" rx="1" />
                          <rect x="14" y="14" width="3" height="3" />
                          <rect x="18" y="14" width="3" height="3" />
                          <rect x="14" y="18" width="3" height="3" />
                          <rect x="18" y="18" width="3" height="3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Decorative Notches */}
                <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-background rounded-full"></div>
                <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-background rounded-full"></div>
              </Link>
            ))}
          </div>

          {/* Redimir button */}
          <div className="px-6 py-4 border-t border-border">
            <Link
              href="/marketplace"
              className="flex items-center justify-center gap-2 w-full py-3 border border-border rounded-xl text-xs font-bold text-foreground hover:border-primary hover:text-primary transition-all uppercase tracking-wide"
            >
              <span>+</span>
              <span>Redimir Nuevo Ticket</span>
            </Link>
          </div>
        </div>
      </div>
    </AuthLayout>
  )
}

