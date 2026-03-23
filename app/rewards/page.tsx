'use client'

import { AuthLayout } from '@/components/layouts/auth-layout'
import { StatusPill } from '@/components/ui/status-pill'

const rewards = [
  {
    id: '1',
    name: 'OG Collector',
    description: 'Early adopter badge',
    status: 'active' as const,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    id: '2',
    name: 'Genesis Mint',
    description: 'Season 1 rare',
    status: 'active' as const,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
      </svg>
    ),
  },
  {
    id: '3',
    name: 'Airdrop Multiplier',
    description: 'X1.2 Active',
    status: 'active' as const,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    id: '4',
    name: 'VIP Access',
    description: 'Unlock at Level 5',
    status: 'pending' as const,
    locked: true,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
]

export default function RewardsPage() {
  return (
    <AuthLayout>
      <div className="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'var(--font-climate)' }}>
            Rewards
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Tus logros y recompensas en el protocolo
          </p>
        </div>

        {/* Score Card */}
        <div className="bg-surface-container-low border border-border rounded-2xl p-6 mb-6">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2">
            Puntaje de Participacion
          </p>
          <div className="flex items-baseline gap-4 mb-4">
            <span className="text-6xl font-bold text-primary" style={{ fontFamily: 'var(--font-climate)' }}>
              2,840
            </span>
            <span className="text-sm text-muted-foreground">Protocol Level 4</span>
          </div>
          <div className="flex gap-1">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-sm ${i < 11 ? 'bg-primary' : 'bg-border'}`}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">92% al siguiente rango</p>
        </div>

        {/* Rewards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {rewards.map((reward) => (
            <div
              key={reward.id}
              className={`bg-surface-container-low border border-border rounded-xl p-4 flex items-start gap-4 ${
                reward.locked ? 'opacity-50' : ''
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                reward.locked ? 'bg-muted/10 text-muted-foreground' : 'bg-primary/20 text-primary'
              }`}>
                {reward.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-bold text-foreground">{reward.name}</h3>
                  <StatusPill variant={reward.locked ? 'default' : 'active'}>
                    {reward.locked ? 'Locked' : 'Active'}
                  </StatusPill>
                </div>
                <p className="text-xs text-muted-foreground">{reward.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AuthLayout>
  )
}
