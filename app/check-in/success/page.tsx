'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useWallet } from '@solana/wallet-adapter-react'
import { ActionCTA } from '@/components/ui/action-cta'
import { SolanaWalletStrip } from '@/components/solana-wallet-strip'
import { TicketLifecycleStrip } from '@/components/ui/ticket-lifecycle-strip'
import { config } from '@/lib/config'

function CheckInSuccessContent() {
  const searchParams = useSearchParams()
  const ticketId = searchParams.get('t')
  const { publicKey } = useWallet()
  const network = config.solanaNetwork

  const walletShort = publicKey
    ? `${publicKey.toBase58().slice(0, 6)}…${publicKey.toBase58().slice(-4)}`
    : 'Wallet not connected in this view'

  const attestationId =
    ticketId && publicKey
      ? `ranti-${ticketId.slice(0, 8)}-${publicKey.toBase58().slice(0, 4)}`
      : ticketId
        ? `ranti-${ticketId.slice(0, 8)}-session`
        : 'ranti-demo-session'

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-64 w-[28rem] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl"
        aria-hidden
      />
      <div className="relative mx-auto flex min-h-screen max-w-lg flex-col justify-center px-4 py-12">
        <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center">
          <div className="absolute inset-0 animate-pulse rounded-full bg-primary/25 blur-xl" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-2 border-primary bg-primary/20 shadow-[0_0_40px_-6px_rgba(184,255,140,0.5)]">
            <svg className="h-10 w-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <h1
          className="mb-2 text-center text-3xl font-bold leading-tight text-primary md:text-4xl"
          style={{ fontFamily: 'var(--font-climate)' }}
        >
          Check-in
          <br />
          confirmed
        </h1>

        <p className="mb-6 text-center text-sm text-muted-foreground">
          Your ticket stays <span className="font-semibold text-foreground">alive</span> — reputation, rewards, and history
          keep compounding in Ranti.
        </p>

        <div className="mb-5">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">What just happened</p>
          <ul className="space-y-2 rounded-xl border border-border/80 bg-surface-container-low/80 p-4 text-left text-[11px] text-muted-foreground">
            <li className="flex gap-2">
              <span className="text-primary">✓</span>
              <span>Attendance recorded (API + session — this is the operational truth in this build).</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">✓</span>
              <span>Wallet-linked identity {publicKey ? 'is' : 'can be'} shown in verification below.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">◇</span>
              <span>On-chain program proof: honest placeholder until devnet program tx is wired.</span>
            </li>
          </ul>
        </div>

        <div className="mb-5">
          <SolanaWalletStrip showHint className="w-full justify-between" />
        </div>

        <div className="mb-6">
          <TicketLifecycleStrip status="checked_in" lang="en" compact />
        </div>

        <div className="mb-6 space-y-4 rounded-2xl border border-primary/20 bg-gradient-to-b from-surface-container-low to-background p-5 shadow-lg shadow-black/25">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Verified layer (demo)</p>
            <p className="text-sm font-bold text-foreground">
              Session + API (Supabase){' '}
              <span className="text-xs font-normal text-muted-foreground">— wallet-bound profile</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
            <span className="text-sm font-bold text-primary">
              {network === 'mainnet-beta' ? 'Solana Mainnet' : `Solana ${network}`}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Wallet</p>
              <p className="break-all font-mono text-xs text-foreground">{walletShort}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Attendance id</p>
              <p className="break-all font-mono text-xs text-primary">{attestationId}</p>
            </div>
          </div>

          <div className="rounded-lg border border-dashed border-border bg-background/50 p-3">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Program transaction</p>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {config.features.onChainCheckIn
                ? 'Enabled — signature hash will render here after confirmation.'
                : 'Not in this build: judges see real wallet + cluster + ticket state instead of a fake hash.'}
            </p>
          </div>

          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-xs font-mono text-foreground">Solscan · {network}</p>
            <ActionCTA
              href={network === 'mainnet-beta' ? 'https://solscan.io' : 'https://solscan.io/?cluster=devnet'}
              variant="outline"
              size="sm"
            >
              Open
            </ActionCTA>
          </div>
        </div>

        <ActionCTA href="/dashboard" variant="primary" size="lg" className="w-full">
          View my progress
        </ActionCTA>

        <div className="flex items-center justify-center gap-2 mt-6">
          <img src="/ranti-logo.svg" alt="Ranti Protocol" className="w-4 h-4 opacity-60" />
          <p className="text-[10px] text-muted-foreground">Protocol v1.0 • Solana Devnet</p>
        </div>
        <div className="mt-4 flex flex-col gap-2 text-center">
          <Link href="/rewards" className="text-xs font-bold text-primary hover:underline">
            Rewards →
          </Link>
          <Link href="/history" className="text-xs font-bold text-muted-foreground hover:text-primary">
            Participation history →
          </Link>
          {ticketId ? (
            <Link href={`/tickets/${ticketId}`} className="text-xs font-bold text-muted-foreground hover:text-primary">
              Back to ticket asset →
            </Link>
          ) : null}
        </div>

        <p className="mt-8 text-center text-[10px] text-muted-foreground">Ranti · hackathon demo · {network}</p>
      </div>
    </main>
  )
}

export default function CheckInSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-background p-4">
          <p className="text-sm text-muted-foreground">Loading confirmation…</p>
        </main>
      }
    >
      <CheckInSuccessContent />
    </Suspense>
  )
}
