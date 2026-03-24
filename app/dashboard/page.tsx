'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useWallet } from '@solana/wallet-adapter-react'
import { useMemo, useState } from 'react'
import { AuthLayout } from '@/components/layouts/auth-layout'
import { useDashboard } from '@/lib/hooks/use-dashboard'
import { TicketDetailModal } from '@/components/ticket-detail-modal'
import { executeOnChainCheckIn } from '@/lib/solana/checkin-flow'

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
  const { publicKey, sendTransaction } = useWallet()
  const { data: dashboardData, isLoading: loading, isError, error, refetch } = useDashboard()
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
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
            <p className="mt-4 text-muted">Loading dashboard...</p>
          </div>
        </div>
      </AuthLayout>
    )
  }

  if (isError) {
    const authError =
      typeof error === 'string' &&
      (error.toLowerCase().includes('autenticado') || error.toLowerCase().includes('sesion'))
    return (
      <AuthLayout>
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <p className="mb-2 text-destructive">{authError ? 'Sesion no valida para dashboard' : 'Error loading dashboard'}</p>
            <p className="mb-4 text-xs text-muted">{error || 'No se pudo obtener datos del dashboard.'}</p>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => refetch()}
                className="rounded-lg bg-primary px-4 py-2 text-primary-foreground"
              >
                Reintentar
              </button>
              <button
                onClick={() => window.location.assign('/')}
                className="rounded-lg border border-border px-4 py-2 text-foreground"
              >
                Ir al inicio
              </button>
            </div>
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
              <h1 className="mt-2 text-5xl uppercase text-primary md:text-6xl" style={{ fontFamily: 'var(--font-climate)' }}>
                Inventory
              </h1>
              <p className="mt-2 max-w-xl text-sm text-muted">
                Reputacion, recompensas y actividad on-chain en una vista unica.
              </p>
            </div>

            <div className="rounded-3xl border border-[#2F372C] bg-[#1A2217] p-6">
              <div className="mb-2 flex items-end justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Puntaje de Participacion</p>
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
              <div className="mt-4 flex gap-1.5">
                {Array.from({ length: 10 }).map((_, i) => {
                  const progress = Number(dashboardData?.participation?.progress || 0)
                  const filled = i < Math.max(1, Math.ceil(progress / 10))
                  return (
                    <div
                      key={i}
                      className={`h-2 flex-1 rounded-sm ${filled ? 'bg-primary' : 'bg-[#2F372C]'}`}
                    />
                  )
                })}
              </div>
            </div>

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
                    <div key={reward.id} className={`rounded-xl border border-[#2F372C] bg-[#131A11] p-3 ${!reward.unlocked ? 'opacity-45' : ''}`}>
                      <div className={`mb-2 flex h-10 w-10 items-center justify-center rounded-lg ${reward.unlocked ? 'bg-primary/15 text-primary' : 'bg-muted/10 text-muted'}`}>
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
                      <div
                        key={i}
                        className="group rounded-xl border border-[#2F372C] bg-[#131A11] p-3 transition-colors hover:border-primary/40 hover:bg-[#1B2417]"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                              {item.type === 'check_in' && <span className="text-xs">✓</span>}
                              {item.type === 'mint' && <span className="text-xs">✎</span>}
                              {item.type !== 'check_in' && item.type !== 'mint' && <span className="text-xs">↔</span>}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-foreground">{item.title}</p>
                              <p className="text-[10px] text-muted">{item.description}</p>
                            </div>
                          </div>
                          <span className="text-xs text-muted opacity-0 transition-opacity group-hover:opacity-100">↗</span>
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
                  const eventDate = ticket.events?.event_date || new Date().toISOString()
                  const eventName = ticket.events?.name || 'Unknown Event'
                  const eventVenue = ticket.events?.venue || 'TBA'

                  return (
                    <button
                      type="button"
                      key={ticket.id}
                      onClick={() => setSelectedTicket({ ...ticket, event_name: eventName, event_date: eventDate, venue: eventVenue })}
                      className={`relative w-full overflow-hidden rounded-xl text-left transition-transform hover:scale-[1.015] ${ticket.status === 'used' ? 'opacity-60 grayscale' : ''}`}
                      style={{ background: colors.bg }}
                    >
                      <div className="pointer-events-none absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-[#0E150C]" />
                      <div className="pointer-events-none absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-[#0E150C]" />
                      <div className="p-4">
                        <div className="mb-3 flex items-start justify-between">
                          <span className="rounded border px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.18em]" style={{ color: colors.fg, borderColor: `${colors.fg}45` }}>
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
                        <div className="mt-4 flex items-end justify-between border-t pt-3" style={{ borderColor: `${colors.fg}35` }}>
                          <div>
                            <p className="text-[10px] uppercase tracking-widest opacity-70" style={{ color: colors.fg }}>
                              Venue
                            </p>
                            <p className="text-xs font-bold" style={{ color: colors.fg }}>
                              {eventVenue}
                            </p>
                          </div>
                          <div className="flex h-9 w-9 items-center justify-center rounded bg-black/10">
                            <span style={{ color: colors.fg }}>▦</span>
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

            <div className="mt-4 border-t border-[#2F372C] pt-4">
              <Link href="/marketplace" className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#2F372C] py-3 text-xs font-bold uppercase tracking-wide text-foreground transition-all hover:border-primary hover:text-primary">
                <span>+</span>
                <span>Redimir Nuevo Ticket</span>
              </Link>
            </div>
          </aside>
        </div>
      </div>

      {selectedTicket && (
        <TicketDetailModal
          ticket={{ ...selectedTicket, owner_wallet: publicKey?.toBase58() }}
          onClose={() => setSelectedTicket(null)}
          onActivate={async () => {
            if (!publicKey) {
              throw new Error('Connect wallet before check-in.')
            }

            const chainResult = await executeOnChainCheckIn({
              ticketId: selectedTicket.id,
              eventId: selectedTicket.event_id || selectedTicket.id,
              walletPublicKey: publicKey,
              sendTransaction,
            })

            const response = await fetch(`/api/tickets/${selectedTicket.id}/check-in`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Idempotency-Key': `${selectedTicket.id}-${Date.now()}`,
              },
              body: JSON.stringify({
                attestationId: chainResult.attestationId,
                txSignature: chainResult.commitTxSignature,
                checkInTxSignature: chainResult.checkInTxSignature,
                checkinPda: chainResult.checkinPda,
                attestationPda: chainResult.attestationPda,
              }),
            })
            if (!response.ok) {
              const failed = await response.json().catch(() => ({}))
              throw new Error(failed.error || 'Unable to persist check-in state')
            }

            await refetch()
            setSelectedTicket(null)
            const params = new URLSearchParams({
              t: selectedTicket.id,
              a: chainResult.attestationId,
              tx: chainResult.commitTxSignature,
              cktx: chainResult.checkInTxSignature,
              cluster: chainResult.cluster,
            })
            router.push(`/check-in/success?${params.toString()}`)
          }}
        />
      )}
    </AuthLayout>
  )
}
