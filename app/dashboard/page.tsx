'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useWallet } from '@solana/wallet-adapter-react'
import { useMemo, useState } from 'react'
import { AuthLayout } from '@/components/layouts/auth-layout'
import { useDashboard } from '@/lib/hooks/use-dashboard'
import { TicketDetailModal } from '@/components/ticket-detail-modal'

const rewardIcons = {
  'OG Collector': (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  'Genesis Mint': (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
    </svg>
  ),
  'Airdrop Multiplier': (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  'Ticket Confirmed': (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
}

export default function Dashboard() {
  const router = useRouter()
  const { publicKey } = useWallet()
  const { data: dashboardData, isLoading: loading, isError, refetch } = useDashboard()
  const [selectedTicket, setSelectedTicket] = useState<any>(null)
  const allTickets = useMemo(
    () => [
      ...(dashboardData?.tickets.active || []),
      ...(dashboardData?.tickets.checkedIn || []),
      ...(dashboardData?.tickets.used || []),
    ],
    [dashboardData?.tickets.active, dashboardData?.tickets.checkedIn, dashboardData?.tickets.used],
  )

  if (loading) {
    return (
      <AuthLayout>
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-muted mt-4">Loading dashboard...</p>
          </div>
        </div>
      </AuthLayout>
    )
  }

  if (isError) {
    return (
      <AuthLayout>
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <p className="text-destructive mb-4">Error loading dashboard</p>
            <button onClick={() => window.location.reload()} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">
              Retry
            </button>
          </div>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <div className="min-h-[calc(100vh-56px)] bg-[#0E150C]">
        <div className="mx-auto grid max-w-[1280px] gap-6 px-6 pb-8 pt-10 lg:grid-cols-[minmax(0,1fr)_380px]">
          <section className="space-y-6">
            <div className="rounded-3xl border border-[#2F372C] bg-[#1A2217] p-6 md:p-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/90">User Dashboard · asistente</p>
              <h1
                className="mt-2 text-5xl uppercase text-primary md:text-6xl"
                style={{ fontFamily: 'var(--font-climate)' }}
              >
                Inventory
              </h1>
              <p className="mt-2 max-w-xl text-sm text-muted">
                Reputación, recompensas y actividad on-chain en una vista única.
              </p>
            </div>

            <div className="rounded-3xl border border-[#2F372C] bg-[#1A2217] p-6">
              <div className="mb-2 flex items-end justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Puntaje de Participación</p>
                  <p className="text-xs font-semibold text-foreground">
                    Protocol Level {dashboardData?.participation?.level || 1}
                  </p>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
                  {dashboardData?.participation?.progress || 0}% al siguiente rango
                </p>
              </div>
              <div className="text-[80px] leading-none text-primary" style={{ fontFamily: 'var(--font-climate)' }}>
                {dashboardData?.participation?.score?.toLocaleString() || '0'}
              </div>
              <div className="mt-4 flex gap-1">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className={`h-2 flex-1 rounded-sm ${i < 11 ? 'bg-primary' : 'bg-[#2F372C]'}`} />
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
                {[...(dashboardData?.rewards?.unlocked || []), ...(dashboardData?.rewards?.locked || [])].map((reward: any) => (
                  <div
                    key={reward.id}
                    className={`rounded-xl border p-3 flex flex-col gap-2 cursor-pointer transition-all ${
                      !reward.unlocked
                        ? 'border-border opacity-40'
                        : 'border-border hover:border-primary/40 hover:bg-primary/5 hover:scale-[1.02]'
                    }`}
                  >
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-3xl border border-[#2F372C] bg-[#1A2217] p-6">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-xl font-bold text-foreground">Rewards</p>
                  <Link href="/rewards" className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#4ADDB4] hover:underline">
                    Ver todo
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[...(dashboardData?.rewards?.unlocked || []), ...(dashboardData?.rewards?.locked || [])].map((reward: any) => (
                    <div
                      key={reward.id}
                      className={`rounded-xl border border-[#2F372C] bg-[#131A11] p-3 ${!reward.unlocked ? 'opacity-45' : ''}`}
                    >
                      <div
                        className={`mb-2 flex h-10 w-10 items-center justify-center rounded-lg ${
                          reward.unlocked ? 'bg-primary/15 text-primary' : 'bg-muted/10 text-muted'
                        }`}
                      >
                        {rewardIcons[reward.name as keyof typeof rewardIcons]}
                      </div>
                      <p className="text-xs font-bold text-foreground">{reward.name}</p>
                      <p className="mt-0.5 text-[10px] text-muted">{reward.description}</p>
                    </div>
                  ))}
                  {(!dashboardData?.rewards || dashboardData.rewards.total === 0) && (
                    <p className="col-span-2 text-xs text-muted">No rewards yet</p>
                  )}
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
                {dashboardData?.activity?.map((item: any, i: number) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-xl border border-border hover:border-primary/30 hover:bg-primary/5 hover:translate-x-1 transition-all cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      {item.type === 'check_in' && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#B8FF8C" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                      )}
                      {item.type === 'mint' && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#B8FF8C" strokeWidth="2"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                      )}
                      {item.type === 'transfer' && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#B8FF8C" strokeWidth="2"><polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /><polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 0 1-4 4H3" /></svg>
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground">{item.title}</p>
                      <p className="text-[10px] text-muted mt-0.5">{item.description}</p>
                    </div>
                  </div>
                )) || (
                  <p className="text-xs text-muted">No activity yet</p>
                )}
              <div className="rounded-3xl border border-[#2F372C] bg-[#1A2217] p-6">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-xl font-bold text-foreground">Actividad</p>
                  <Link href="/history" className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#4ADDB4] hover:underline">
                    Historial
                  </Link>
                </div>
                <div className="space-y-3">
                  {dashboardData?.activity?.length ? (
                    dashboardData.activity.slice(0, 5).map((item: any, i: number) => (
                      <div key={i} className="rounded-xl border border-[#2F372C] bg-[#131A11] p-3">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-primary/25 bg-primary/10">
                            {item.type === 'check_in' && (
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#B8FF8C" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                            )}
                            {item.type === 'mint' && (
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#B8FF8C" strokeWidth="2"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                            )}
                            {item.type === 'transfer' && (
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#B8FF8C" strokeWidth="2"><polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /><polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 0 1-4 4H3" /></svg>
                            )}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-foreground">{item.title}</p>
                            <p className="text-[10px] text-muted">{item.description}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-muted">No activity yet</p>
                  )}
                </div>
              </div>
            </div>
          </section>

          <aside className="flex h-full min-h-[700px] flex-col rounded-3xl border border-[#2F372C] bg-[#1A2217] p-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-3xl text-foreground" style={{ fontFamily: 'var(--font-climate)' }}>
                Mis Tickets
              </h2>
              <Link href="/marketplace" className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted hover:text-primary">
                View All
              </Link>
            </div>

          {/* Ticket list */}
          <div className="flex-1 px-6 space-y-4 pb-4 overflow-y-auto">
            {dashboardData?.tickets && dashboardData.tickets.total > 0 ? (
              [...(dashboardData.tickets.active || []), ...(dashboardData.tickets.checkedIn || []), ...(dashboardData.tickets.used || [])].map((ticket: any) => {
                const ticketColors: { [key: string]: { bg: string; fg: string } } = {
                  active: { bg: '#B8FF8C', fg: '#143800' },
                  issued: { bg: '#B8FF8C', fg: '#143800' },
                  checked_in: { bg: '#161D14', fg: '#B8FF8C' },
                  used: { bg: '#161D14', fg: '#5E6659' },
                }
                const colors = ticketColors[ticket.status] || ticketColors.active
                const eventDate = ticket.events?.date || new Date().toISOString()
                const eventName = ticket.events?.name || 'Unknown Event'
                const eventVenue = ticket.events?.venue || 'TBA'
                return (
                  <div
                    key={ticket.id}
                    onClick={() => setSelectedTicket({ ...ticket, event_name: eventName, event_date: eventDate, venue: eventVenue })}
                    className={`block group relative cursor-pointer ${ticket.status === 'used' ? 'opacity-60 grayscale' : ''}`}
                  >
                    <div
                      className="rounded-xl overflow-hidden transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/10"
            <div className="flex-1 space-y-3 overflow-y-auto pr-1">
              {dashboardData?.tickets && dashboardData.tickets.total > 0 ? (
                allTickets.map((ticket: any) => {
                  const ticketColors: { [key: string]: { bg: string; fg: string } } = {
                    active: { bg: '#8BE655', fg: '#143800' },
                    issued: { bg: '#8BE655', fg: '#143800' },
                    checked_in: { bg: '#161D14', fg: '#B8FF8C' },
                    used: { bg: '#161D14', fg: '#5E6659' },
                  }
                  const colors = ticketColors[ticket.status] || ticketColors.active
                  const eventDate = ticket.events?.date || new Date().toISOString()
                  const eventName = ticket.events?.name || 'Unknown Event'
                  const eventVenue = ticket.events?.venue || 'TBA'

                  return (
                    <button
                      type="button"
                      key={ticket.id}
                      onClick={() => setSelectedTicket({ ...ticket, event_name: eventName, event_date: eventDate, venue: eventVenue })}
                      className={`relative w-full overflow-hidden rounded-xl text-left transition-transform hover:scale-[1.015] ${
                        ticket.status === 'used' ? 'opacity-60 grayscale' : ''
                      }`}
                      style={{ background: colors.bg }}
                    >
                      <div className="p-4">
                        <div className="mb-6 flex items-start justify-between">
                          <span
                            className="rounded border px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.18em]"
                            style={{
                              color: colors.fg,
                              borderColor: `${colors.fg}45`,
                              background: colors.bg === '#8BE655' ? '#14380010' : 'transparent',
                            }}
                          >
                            {ticket.statusLabel || ticket.status.toUpperCase()}
                          </span>
                          <div className="text-right">
                            <p className="text-[11px] font-bold uppercase" style={{ color: colors.fg }}>
                              {new Date(eventDate).toLocaleDateString('es-MX', { month: 'short', day: '2-digit' }).toUpperCase()}
                            </p>
                            <p className="text-lg font-black leading-none" style={{ color: colors.fg }}>
                              {new Date(eventDate).getFullYear()}
                            </p>
                          </div>
                        </div>

                        <h3 className="text-xl uppercase leading-tight" style={{ fontFamily: 'var(--font-climate)', color: colors.fg }}>
                          {eventName}
                        </h3>

                        <div className="mt-5 flex items-end justify-between border-t pt-3" style={{ borderColor: `${colors.fg}25` }}>
                          <div>
                            <p className="text-[10px] uppercase tracking-widest opacity-65" style={{ color: colors.fg }}>
                              Venue
                            </p>
                            <p className="text-sm font-bold" style={{ color: colors.fg }}>
                              {eventVenue}
                            </p>
                          </div>
                          <div className="rounded p-2" style={{ background: colors.bg === '#8BE655' ? '#14380010' : '#B8FF8C10' }}>
                            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={colors.fg} strokeWidth="1.5">
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
                    </button>
                  )
                })
              ) : (
                <p className="py-8 text-center text-xs text-muted">No tickets yet</p>
              )}
            </div>

          {/* Redimir button */}
          <div className="px-6 py-4 border-t border-border">
            <Link
              href="/marketplace"
              className="flex items-center justify-center gap-2 w-full py-3 border border-border rounded-xl text-xs font-bold text-foreground hover:border-primary hover:text-primary hover:bg-primary/5 hover:scale-[1.01] transition-all uppercase tracking-wide group"
            >
              <span className="group-hover:rotate-90 transition-transform">+</span>
              <span>Redimir Nuevo Ticket</span>
            </Link>
          </div>
            <div className="mt-4 border-t border-[#2F372C] pt-4">
              <Link
                href="/marketplace"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#2F372C] py-3 text-xs font-bold uppercase tracking-wide text-foreground transition-all hover:border-primary hover:text-primary"
              >
                <span>+</span>
                <span>Redimir Nuevo Ticket</span>
              </Link>
            </div>
          </aside>
        </div>
      </div>

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <TicketDetailModal
          ticket={{
            ...selectedTicket,
            owner_wallet: publicKey?.toBase58(),
          }}
          onClose={() => setSelectedTicket(null)}
          onActivate={async () => {
            const response = await fetch(`/api/tickets/${selectedTicket.id}/check-in`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Idempotency-Key': `${selectedTicket.id}-${Date.now()}`,
              },
            })
            if (response.ok) {
              await refetch()
              setSelectedTicket(null)
              router.push(`/check-in/success?t=${selectedTicket.id}`)
            }
          }}
        />
      )}
    </AuthLayout>
  )
}

