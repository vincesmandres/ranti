'use client'

import { cn } from '@/lib/utils'

export type TicketAssetStatusTone = 'active' | 'checked' | 'closed'

export interface TicketAssetCardProps {
  eventName: string
  venue: string
  dateLabel: string
  yearLabel: string
  ownerWalletShort: string | null
  statusLabel: string
  statusTone?: TicketAssetStatusTone
  tier: string
  eligibility: string
  rewardState: string
  tokenRef: string
  className?: string
}

/**
 * Primary “ticket as asset” surface for the demo: identity, tier, gates, reward state.
 */
const toneStyles: Record<TicketAssetStatusTone, string> = {
  active: 'border-primary/50 bg-primary/15 text-primary',
  checked: 'border-secondary/40 bg-secondary/10 text-secondary',
  closed: 'border-border bg-muted/20 text-muted-foreground',
}

export function TicketAssetCard({
  eventName,
  venue,
  dateLabel,
  yearLabel,
  ownerWalletShort,
  statusLabel,
  statusTone = 'active',
  tier,
  eligibility,
  rewardState,
  tokenRef,
  className,
}: TicketAssetCardProps) {
  return (
    <section
      className={cn(
        'relative overflow-hidden rounded-2xl border border-primary/15 bg-gradient-to-br from-[#1A2217] via-surface-container-low to-[#0E150C] p-6 shadow-xl shadow-black/40 md:p-8',
        className,
      )}
    >
      <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary/[0.07] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-8 -left-8 h-28 w-28 rounded-full bg-secondary/5 blur-2xl" />
      <div className="relative z-10">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary">On-chain style asset · demo</p>
          <span
            className={cn(
              'rounded-full border px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest',
              toneStyles[statusTone],
            )}
          >
            {statusLabel}
          </span>
        </div>
        <h2
          className="mb-6 text-2xl font-bold uppercase leading-tight text-foreground md:text-3xl"
          style={{ fontFamily: 'var(--font-climate)' }}
        >
          {eventName}
        </h2>

        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border/80 bg-background/50 p-4 backdrop-blur-sm">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Holder · wallet</p>
            <p className="font-mono text-sm font-bold text-foreground">
              {ownerWalletShort || 'Connect wallet to show holder'}
            </p>
          </div>
          <div className="rounded-xl border border-border/80 bg-background/50 p-4 backdrop-blur-sm">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Tier</p>
            <p className="text-sm font-bold text-foreground">{tier}</p>
          </div>
          <div className="rounded-xl border border-border/80 bg-background/50 p-4 backdrop-blur-sm sm:col-span-2">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Eligibility</p>
            <p className="text-sm text-foreground">{eligibility}</p>
          </div>
        </div>

        <div className="rounded-xl border border-primary/30 bg-gradient-to-r from-primary/10 to-transparent p-4">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-primary">Reward & loyalty state</p>
          <p className="text-sm font-semibold text-foreground">{rewardState}</p>
        </div>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-t border-border/60 pt-6">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Venue</p>
            <p className="text-sm font-bold text-foreground">{venue}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Event date</p>
            <p className="text-lg font-bold text-primary" style={{ fontFamily: 'var(--font-climate)' }}>
              {dateLabel}
            </p>
            <p className="text-sm font-bold text-foreground">{yearLabel}</p>
          </div>
        </div>

        <p className="mt-4 text-[10px] font-mono text-muted-foreground">Ref · {tokenRef}</p>
      </div>
    </section>
  )
}
