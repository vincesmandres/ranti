'use client'

import { cn } from '@/lib/utils'

const phases = [
  {
    key: 'issued',
    label: 'Emitido',
    sub: 'Tu acceso es un activo programable',
  },
  {
    key: 'checkin',
    label: 'Check-in',
    sub: 'Prueba de asistencia (sesión verificada)',
  },
  {
    key: 'alive',
    label: 'Sigue vivo',
    sub: 'Reputación, recompensas e historial continúan',
  },
] as const

function isCheckedInStatus(status: string): boolean {
  const s = status.toLowerCase()
  return ['checked_in', 'claimed', 'completed', 'rewarded', 'used', 'expired'].includes(s)
}

interface TicketLifecycleStripProps {
  status: string
  className?: string
  compact?: boolean
}

/**
 * Narrativa demo: antes del check-in el ticket “es entrada”; después no muere — continúa como reputación.
 */
export function TicketLifecycleStrip({ status, className, compact }: TicketLifecycleStripProps) {
  const checkedIn = isCheckedInStatus(status)

  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-surface-container-low/80 p-4',
        compact && 'p-3',
        className,
      )}
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3">
        Después del check-in, el ticket no muere
      </p>
      <div className="flex flex-col gap-3">
        {phases.map((phase, i) => {
          const done = i === 0 || (i === 1 && checkedIn) || (i === 2 && checkedIn)
          const current =
            (i === 0 && !checkedIn) || (i === 1 && !checkedIn) || (i === 2 && checkedIn)
          // Before check-in: highlight step 2 (check-in) as next. After: highlight step 3 as payoff.
          const highlight =
            (!checkedIn && i === 1) || (checkedIn && i === 2)

          return (
            <div key={phase.key} className="flex items-start gap-3">
              <div
                className={cn(
                  'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold',
                  done
                    ? 'border-primary bg-primary/15 text-primary'
                    : 'border-border bg-background text-muted-foreground',
                  highlight && 'ring-2 ring-primary/50',
                )}
              >
                {done ? '✓' : i + 1}
              </div>
              <div className="min-w-0 flex-1">
                <p className={cn('text-xs font-bold', done || highlight ? 'text-foreground' : 'text-muted-foreground')}>
                  {phase.label}
                </p>
                <p className="text-[10px] text-muted-foreground leading-snug">{phase.sub}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
