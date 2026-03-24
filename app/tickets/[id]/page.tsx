'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useWallet } from '@solana/wallet-adapter-react'
import { AuthLayout } from '@/components/layouts/auth-layout'
import { SolanaWalletStrip } from '@/components/solana-wallet-strip'
import { TicketLifecycleStrip } from '@/components/ui/ticket-lifecycle-strip'
import { TicketAssetCard, type TicketAssetStatusTone } from '@/components/ui/ticket-asset-card'
import { TicketDemoOutcomes } from '@/components/ui/ticket-demo-outcomes'
import { TicketEvidencePanel } from '@/components/ui/ticket-evidence-panel'
import { ActionCTA } from '@/components/ui/action-cta'
import { executeOnChainCheckIn } from '@/lib/solana/checkin-flow'
import { config } from '@/lib/config'

type TicketDetailApi = {
  id: string
  token_id?: string | null
  status: 'active' | 'used' | 'pending'
  rawStatus?: string
  user_id?: string
  events: {
    id?: string
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

function isCheckedInRaw(raw?: string): boolean {
  if (!raw) return false
  const s = raw.toLowerCase()
  return ['checked_in', 'claimed', 'completed', 'rewarded'].includes(s)
}

function statusLabelForCard(raw: string | undefined, mapped: TicketDetailApi['status']): string {
  if (mapped === 'used') return 'Closed'
  if (isCheckedInRaw(raw)) return 'Checked In'
  return 'Ready to Check In'
}

export default function TicketDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = String(params.id)
  const { publicKey, sendTransaction } = useWallet()
  const [ticketData, setTicketData] = useState<TicketDetailApi | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [checkInError, setCheckInError] = useState<string | null>(null)
  const [latestTxSignature, setLatestTxSignature] = useState<string | null>(null)
  const [latestAttestationId, setLatestAttestationId] = useState<string | null>(null)

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

  const walletShort = publicKey
    ? `${publicKey.toBase58().slice(0, 4)}…${publicKey.toBase58().slice(-4)}`
    : null

  const raw = ticketData?.rawStatus || 'active'
  const checkedIn = isCheckedInRaw(raw)
  const mapped = ticketData?.status ?? 'active'
  const canCheckIn = mapped === 'active' && !checkedIn
  const isClosed = mapped === 'used'

  const tier = 'General · Demo pass'
  const eligibility = checkedIn
    ? 'Attendance recorded — participation path open'
    : canCheckIn
      ? 'Eligible while ticket is active and session valid'
      : isClosed
        ? 'This ticket is no longer active'
        : 'See status above'
  const rewardState = checkedIn
    ? 'Unlocked for demo (dashboard + history)'
    : 'Locked until check-in completes'

  const timelineHint = checkedIn
    ? `Check-in recorded for “${ticketData?.events?.name || 'Event'}”. Next: rewards view + history entry.`
    : `Ticket issued for “${ticketData?.events?.name || 'Event'}”. Complete check-in to unlock the post-entry story.`

  const statusTone: TicketAssetStatusTone = isClosed ? 'closed' : checkedIn ? 'checked' : 'active'

  const handleCheckIn = async () => {
    if (!ticketData || submitting || !canCheckIn) return
    if (!publicKey) {
      setCheckInError('Connect your wallet before running on-chain check-in.')
      return
    }

    setSubmitting(true)
    setCheckInError(null)
    try {
      const chainResult = await executeOnChainCheckIn({
        ticketId: id,
        eventId: ticketData.events?.id || id,
        walletPublicKey: publicKey,
        sendTransaction,
      })
      const response = await fetch(`/api/tickets/${id}/check-in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': `${id}-${Date.now()}`,
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
        throw new Error(failed.error || 'Check-in API rejected the request.')
      }

      if (response.ok) {
        const updated = await response.json()
        const nextRaw = updated?.data?.status || 'checked_in'
        setLatestTxSignature(chainResult.commitTxSignature)
        setLatestAttestationId(chainResult.attestationId)
        setTicketData((prev) => {
          if (!prev) return prev
          const status = mapStatus(nextRaw)
          return { ...prev, rawStatus: nextRaw, status }
        })
        const params = new URLSearchParams({
          t: id,
          a: chainResult.attestationId,
          tx: chainResult.commitTxSignature,
          cktx: chainResult.checkInTxSignature,
          cluster: chainResult.cluster,
        })
        router.push(`/check-in/success?${params.toString()}`)
      }
    } catch (error) {
      setCheckInError(error instanceof Error ? error.message : 'Unexpected check-in error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout>
      <div className="mx-auto max-w-3xl p-4 md:p-6 lg:p-8">
        <Link
          href="/tickets"
          className="mb-6 inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm">Back to tickets</span>
        </Link>

        {loading || !ticketData ? (
          <div className="py-10 text-sm text-muted-foreground">Cargando detalle…</div>
        ) : (
          <div className="space-y-10">
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Solana · holder</p>
              <SolanaWalletStrip showHint variant="premium" className="w-full" />
            </div>

            <div className="mb-4 flex items-center gap-2">
              <img src="/ranti-logo.svg" alt="Ranti Protocol" className="w-5 h-5" />
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                Protocol Collection
              </p>
            </div>
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Lifecycle timeline</p>
              <TicketLifecycleStrip status={raw} lang="en" />
            </div>

            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Ticket as asset</p>
              <TicketAssetCard
                eventName={ticketData.events?.name || 'EVENT'}
                venue={ticketData.events?.venue || 'TBA'}
                dateLabel={eventDate.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }).toUpperCase()}
                yearLabel={String(eventDate.getFullYear())}
                ownerWalletShort={walletShort}
                statusLabel={statusLabelForCard(raw, mapped)}
                statusTone={statusTone}
                tier={tier}
                eligibility={eligibility}
                rewardState={rewardState}
                tokenRef={ticketData.token_id || `#${ticketData.id.slice(0, 8)}`}
              />
            </div>

            <div className="space-y-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Check-in</p>

              {checkedIn && !isClosed && (
                <div className="relative overflow-hidden rounded-2xl border border-primary/50 bg-gradient-to-r from-primary/15 to-primary/5 p-4 shadow-lg shadow-primary/10">
                  <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/20 blur-2xl" />
                  <div className="relative flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-[#143800] shadow-md shadow-primary/40">
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-primary" style={{ fontFamily: 'var(--font-climate)' }}>
                        Checked in
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        Attendance is live in the backend. Scroll to <span className="text-foreground">rewards</span> and{' '}
                        <span className="text-foreground">verification</span> — or open the{' '}
                        <Link href={`/check-in/success?t=${id}`} className="font-bold text-primary underline">
                          receipt screen
                        </Link>
                        .
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <ActionCTA
                onClick={canCheckIn ? handleCheckIn : undefined}
                variant="primary"
                size="lg"
                className="w-full"
                loading={submitting}
                disabled={!canCheckIn}
                icon={
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                }
                iconPosition="left"
              >
                {isClosed ? 'Ticket closed' : checkedIn ? 'Checked In' : 'Ready to Check In'}
              </ActionCTA>

              {canCheckIn && (
                <p className="text-center text-[10px] text-muted-foreground">
                  Requires real wallet signature on {config.solanaNetwork}. No fake hash fallback.
                </p>
              )}
              {checkInError ? (
                <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-center text-xs text-destructive">
                  {checkInError}
                </p>
              ) : null}
            </div>

            <TicketDemoOutcomes checkedIn={checkedIn && !isClosed} />

            <TicketEvidencePanel
              walletShort={walletShort}
              ticketId={id}
              txSignature={latestTxSignature}
              attestationId={latestAttestationId}
              timelineHint={timelineHint}
            />
          </div>
        )}
      </div>
    </AuthLayout>
  )
}
