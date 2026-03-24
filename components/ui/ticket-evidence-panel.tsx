'use client'

import Link from 'next/link'
import { config } from '@/lib/config'
import { cn } from '@/lib/utils'

interface TicketEvidencePanelProps {
  walletShort: string | null
  ticketId: string
  /** Human timeline line for demo */
  timelineHint: string
  className?: string
}

/**
 * Verifiable surface for the demo: wallet, cluster, program placeholder, tx stub, link to history.
 */
export function TicketEvidencePanel({ walletShort, ticketId, timelineHint, className }: TicketEvidencePanelProps) {
  const network = config.solanaNetwork
  const programId = config.programId || '— not set (NEXT_PUBLIC_PROGRAM_ID)'
  const txPlaceholder = config.features.onChainCheckIn
    ? 'Awaiting signature — hash will appear here.'
    : 'No program tx in this build. Verify wallet + cluster below; cross-check ticket status via API.'

  const solscan =
    network === 'mainnet-beta' ? 'https://solscan.io' : 'https://solscan.io/?cluster=devnet'

  return (
    <section
      className={cn(
        'relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-b from-surface-container-low to-[#0E150C] p-5 shadow-lg shadow-black/30 md:p-6',
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Verification summary</p>
      <h3 className="mb-4 text-sm font-bold text-foreground">What you can actually check in ~30 seconds</h3>

      <dl className="space-y-3 text-sm">
        <div className="rounded-xl border border-border/70 bg-background/45 p-3.5">
          <dt className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Wallet (holder)</dt>
          <dd className="mt-1 font-mono text-xs text-foreground break-all">
            {walletShort || 'Connect wallet — holder line ties to Phantom / Solflare.'}
          </dd>
        </div>
        <div className="rounded-xl border border-border/70 bg-background/45 p-3.5">
          <dt className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Solana cluster</dt>
          <dd className="mt-1 text-xs text-foreground">
            <span className="font-bold text-primary">{network}</span>
            <span className="text-muted-foreground"> · RPC from env matches wallet adapter Connection</span>
          </dd>
        </div>
        <div className="rounded-xl border border-border/70 bg-background/45 p-3.5">
          <dt className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Program id</dt>
          <dd className="mt-1 font-mono text-[11px] text-foreground break-all">{programId}</dd>
        </div>
        <div className="rounded-xl border border-dashed border-primary/35 bg-primary/[0.06] p-3.5">
          <dt className="text-[10px] font-bold uppercase tracking-widest text-primary">Transaction</dt>
          <dd className="mt-1 text-xs leading-relaxed text-muted-foreground">{txPlaceholder}</dd>
        </div>
        <div className="rounded-xl border border-border/70 bg-background/45 p-3.5">
          <dt className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Timeline</dt>
          <dd className="mt-1 text-xs text-foreground">{timelineHint}</dd>
          <dd className="mt-3 flex flex-wrap gap-2">
            <Link
              href="/history"
              className="inline-flex items-center rounded-lg border border-primary/40 bg-primary/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-primary hover:bg-primary/15"
            >
              History →
            </Link>
            <a
              href={solscan}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-lg border border-border px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:border-primary/40 hover:text-primary"
            >
              Solscan ({network}) ↗
            </a>
          </dd>
        </div>
      </dl>

      <p className="mt-4 border-t border-border/50 pt-3 text-[10px] text-muted-foreground">
        Ticket id · <span className="font-mono text-foreground">{ticketId}</span>
      </p>
    </section>
  )
}
