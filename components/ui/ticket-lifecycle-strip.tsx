'use client'

import { cn } from '@/lib/utils'

const phasesEs = [
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

const phasesEn = [
  {
    key: 'issued',
    label: 'Issued',
    sub: 'Your access is a programmable asset',
  },
  {
    key: 'checkin',
    label: 'Check-in',
    sub: 'Proof of attendance (verified session)',
  },
  {
    key: 'alive',
    label: 'Stays alive',
    sub: 'Reputation, rewards, and history keep compounding',
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
  /** Landing / bilingual demo */
  lang?: 'es' | 'en'
  /** Vertical timeline connector between steps */
  showConnector?: boolean
}

/**
 * Narrativa demo: antes del check-in el ticket “es entrada”; después no muere — continúa como reputación.
 */
export function TicketLifecycleStrip({
  status,
  className,
  compact,
  lang = 'es',
  showConnector = true,
}: TicketLifecycleStripProps) {
  const checkedIn = isCheckedInStatus(status)
  const phases = lang === 'en' ? phasesEn : phasesEs
  const headline =
    lang === 'en' ? 'After check-in, the ticket should not die' : 'Después del check-in, el ticket no muere'
  const sub =
    lang === 'en'
      ? 'Three-step story · optimized for a 90-second walkthrough'
      : 'Historia en 3 pasos · demo ~90s'

  return (
    <div
      className={cn(
        'rounded-2xl border border-border/90 bg-surface-container-low/90 p-4 shadow-md shadow-black/20',
        compact && 'p-3',
        className,
      )}
    >
      <div className="mb-3 flex flex-col gap-1 border-b border-border/50 pb-3 sm:flex-row sm:items-end sm:justify-between">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">{headline}</p>
        <p className="text-[9px] font-medium uppercase tracking-widest text-muted-foreground">{sub}</p>
      </div>
      <div className="relative">
        {showConnector && (
          <div
            className="absolute left-[11px] top-3 bottom-3 w-px bg-gradient-to-b from-primary/50 via-border to-border"
            aria-hidden
          />
        )}
        <div className="flex flex-col gap-3">
          {phases.map((phase, i) => {
            const done = i === 0 || (i === 1 && checkedIn) || (i === 2 && checkedIn)
            const highlight = (!checkedIn && i === 1) || (checkedIn && i === 2)

            return (
              <div key={phase.key} className="relative flex items-start gap-3 pl-0">
                <div
                  className={cn(
                    'relative z-[1] mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold transition-transform',
                    done
                      ? 'border-primary bg-primary text-[#143800] shadow-sm shadow-primary/30'
                      : 'border-border bg-background text-muted-foreground',
                    highlight && !done && 'ring-2 ring-primary/60 ring-offset-2 ring-offset-[#161D14]',
                  )}
                >
                  {done ? '✓' : i + 1}
                </div>
                <div className="min-w-0 flex-1 pt-0.5">
                  <p className={cn('text-xs font-bold', done || highlight ? 'text-foreground' : 'text-muted-foreground')}>
                    {phase.label}
                  </p>
                  <p className="text-[10px] leading-snug text-muted-foreground">{phase.sub}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
