'use client'

import { cn } from '@/lib/utils'
import { config } from '@/lib/config'

interface RowProps {
  title: string
  body: string
  state: 'pending' | 'done' | 'mock'
}

function OutcomeRow({ title, body, state }: RowProps) {
  return (
    <div
      className={cn(
        'flex gap-3 rounded-xl border p-4 transition-colors',
        state === 'done' && 'border-primary/45 bg-primary/[0.07] shadow-sm shadow-primary/5',
        state === 'pending' && 'border-border/80 bg-background/40',
        state === 'mock' && 'border-dashed border-primary/25 bg-surface-container-low/60',
      )}
    >
      <div
        className={cn(
          'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold',
          state === 'done' && 'bg-primary text-[#143800] shadow-md shadow-primary/20',
          state === 'pending' && 'border border-border bg-background text-muted-foreground',
          state === 'mock' && 'border border-primary/50 bg-primary/10 text-primary',
        )}
      >
        {state === 'done' ? '✓' : state === 'mock' ? '◇' : '·'}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-bold tracking-tight text-foreground">{title}</p>
        <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{body}</p>
      </div>
    </div>
  )
}

interface TicketDemoOutcomesProps {
  checkedIn: boolean
  className?: string
}

function ProgressDots({ filled }: { filled: number }) {
  return (
    <div className="flex gap-1" aria-hidden>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            'h-1 flex-1 rounded-full transition-colors',
            i < filled ? 'bg-primary' : 'bg-border',
          )}
        />
      ))}
    </div>
  )
}

/**
 * Honest post-check-in story: what is real today vs staged for the protocol.
 */
export function TicketDemoOutcomes({ checkedIn, className }: TicketDemoOutcomesProps) {
  const onchainEnabled = config.features.onChainCheckIn
  const filled = checkedIn ? (onchainEnabled ? 3 : 2) : 0

  return (
    <section
      className={cn(
        'rounded-2xl border border-border/80 bg-surface-container-low/50 p-5 shadow-inner shadow-black/20 md:p-6',
        className,
      )}
    >
      <div className="mb-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Rewards · badges · progress</p>
        <h3 className="mt-1 text-base font-bold text-foreground">What unlocks after check-in</h3>
        <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
          Mock where noted — we show the full story so judges see the Solana-native loyalty loop, not a hidden hack.
        </p>
        <div className="mt-3 max-w-xs">
          <div className="mb-1 flex justify-between text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
            <span>Demo depth</span>
            <span>{checkedIn ? (onchainEnabled ? '3/3 live' : '2/3 live') : '0/3'}</span>
          </div>
          <ProgressDots filled={filled} />
        </div>
      </div>
      <div className="space-y-3">
        <OutcomeRow
          title="Reward unlocked"
          body={
            checkedIn
              ? 'Live in demo: points + badges surface in Dashboard / Rewards (API + session).'
              : 'Locked until attendance is recorded via check-in.'
          }
          state={checkedIn ? 'done' : 'pending'}
        />
        <OutcomeRow
          title="Participation recorded"
          body={
            checkedIn
              ? 'Live: row in Supabase-backed history — verifiable in-app under History.'
              : 'No participation record yet.'
          }
          state={checkedIn ? 'done' : 'pending'}
        />
        <OutcomeRow
          title="Proof layer (on-chain path)"
          body={
            onchainEnabled
              ? checkedIn
                ? 'Live on devnet: wallet signs memo tx, signature is verified server-side and persisted in attestation.'
                : 'Enabled on this environment: check-in will require wallet signature and produce a real tx hash.'
              : 'Disabled by environment flag. Enable RANTI/NEXT_PUBLIC_RANTI_ENABLE_ONCHAIN_CHECKIN to require real tx proof.'
          }
          state={onchainEnabled && checkedIn ? 'done' : onchainEnabled ? 'pending' : 'mock'}
        />
      </div>
    </section>
  )
}
