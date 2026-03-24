'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { AuthLayout } from '@/components/layouts/auth-layout'
import { StatusPill } from '@/components/ui/status-pill'
import { ActionCTA } from '@/components/ui/action-cta'
import { TicketLifecycleStrip } from '@/components/ui/ticket-lifecycle-strip'
import { config } from '@/lib/config'

type TicketDetailApi = {
  id: string
  token_id?: string | null
  status: 'active' | 'used' | 'pending'
  rawStatus?: string
  user_id?: string
  events: {
    name: string
    venue: string | null
    date: string | null
  } | null
}

function mapStatus(status: string): 'active' | 'used' | 'pending' {
  if (['used', 'expired', 'cancelled'].includes(status)) return 'used'
  if (['checked_in', 'claimed', 'completed', 'rewarded'].includes(status)) return 'pending'
  return 'active'
}

export default function TicketDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = String(params.id)
  const [ticketData, setTicketData] = useState<TicketDetailApi | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const loadTicket = async () => {
      try {
        const response = await fetch(`/api/tickets/${id}`)
        if (!response.ok) return
        const json = await response.json()
        const ticket = json.data as any
        setTicketData({
          ...ticket,
          rawStatus: ticket.status,
          status: mapStatus(ticket.status),
        })
      } finally {
        setLoading(false)
      }
    }

    void loadTicket()
  }, [id])

  const eventDate = useMemo(() => {
    if (!ticketData?.events?.date) return new Date()
    return new Date(ticketData.events.date)
  }, [ticketData?.events?.date])

  const handleCheckIn = async () => {
    if (!ticketData || submitting) return
    setSubmitting(true)
    try {
      const response = await fetch(`/api/tickets/${id}/check-in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': `${id}-${Date.now()}`,
        },
      })
      if (response.ok) {
        const updated = await response.json()
        const nextRaw = updated?.data?.status || 'checked_in'
        setTicketData((prev) => {
          if (!prev) return prev
          const status = mapStatus(nextRaw)
          return { ...prev, rawStatus: nextRaw, status }
        })
        router.push(`/check-in/success?t=${id}`)
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout>
      <div className="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto">
        {/* Back */}
        <Link
          href="/tickets"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm">Back to Tickets</span>
        </Link>

        {loading || !ticketData ? (
          <div className="py-10 text-sm text-muted-foreground">Cargando detalle...</div>
        ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left - QR & Visual */}
          <div className="bg-surface-container-low border border-border rounded-2xl p-6">
            <p className="text-[10px] text-muted-foreground mb-4">
              Vista previa de pase — el estado vive después del check-in (recompensas e historial).
            </p>

            <div className="mb-4">
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">
                Collection by
              </p>
              <p className="text-sm font-bold text-secondary">RANTI PROTOCOL</p>
            </div>

            <h1 className="text-3xl font-bold text-primary mb-4" style={{ fontFamily: 'var(--font-climate)' }}>
              {ticketData.events?.name || 'TICKET'}
            </h1>

            {/* QR Code placeholder */}
            <div className="bg-primary/10 border border-primary/30 rounded-xl p-8 flex items-center justify-center mb-4">
              <div className="w-32 h-32 bg-primary rounded-lg grid grid-cols-6 grid-rows-6 gap-1 p-2">
                {Array.from({ length: 36 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-sm"
                    style={{ background: [0,1,4,5,6,7,10,11,12,17,18,23,24,29,30,31,34,35].includes(i) ? '#143800' : 'transparent' }}
                  />
                ))}
              </div>
            </div>

            <TicketLifecycleStrip status={ticketData.rawStatus || 'active'} className="mb-4" compact />

            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Referencia de ticket</p>
                <p className="text-sm font-bold text-foreground" style={{ fontFamily: 'var(--font-grotesk)' }}>
                  {ticketData.token_id || `#${ticketData.id.slice(0, 6)}`}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary" style={{ fontFamily: 'var(--font-climate)' }}>
                  {eventDate.toLocaleDateString('es-MX', { month: 'short', day: '2-digit' }).toUpperCase()}
                </p>
                <p className="text-sm font-bold text-foreground">{eventDate.getFullYear()}</p>
              </div>
            </div>
          </div>

          {/* Right - Details */}
          <div className="space-y-4">
            <div className="bg-surface-container-low border border-border rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-foreground uppercase tracking-widest">Status</h2>
                <StatusPill variant={ticketData.status}>{ticketData.status}</StatusPill>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Venue</p>
                  <p className="text-sm font-bold text-foreground">{ticketData.events?.venue || 'TBA'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Owner</p>
                  <p className="text-sm font-bold text-foreground font-mono">{ticketData.user_id || 'Me'}</p>
                </div>
              </div>
            </div>

            <ActionCTA
              onClick={handleCheckIn}
              variant="primary"
              size="lg"
              className="w-full"
              loading={submitting}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              }
              iconPosition="left"
            >
              Confirmar check-in
            </ActionCTA>

            <ActionCTA
              href={
                config.solanaNetwork === 'mainnet-beta'
                  ? 'https://solscan.io'
                  : 'https://solscan.io/?cluster=devnet'
              }
              variant="outline"
              size="md"
              className="w-full"
            >
              Explorador Solana (devnet)
            </ActionCTA>
            <p className="text-[10px] text-center text-muted-foreground">
              La transacción on-chain del programa se muestra aquí cuando esté integrada; hoy la demo usa sesión + API.
            </p>
          </div>
        </div>
        )}
      </div>
    </AuthLayout>
  )
}
