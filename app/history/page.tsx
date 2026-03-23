'use client'

import { AuthLayout } from '@/components/layouts/auth-layout'
import { ActivityTimeline, type ActivityItem } from '@/components/ui/activity-timeline'

const activities: ActivityItem[] = [
  {
    id: '1',
    type: 'check-in',
    title: 'Check-in Verified',
    description: 'LOLLAPALOOZA 2024',
    timestamp: '2 hours ago',
    status: 'success',
  },
  {
    id: '2',
    type: 'mint',
    title: 'Asset Minted',
    description: 'AFTERPARTY VIP PASS',
    timestamp: '1 day ago',
    status: 'success',
  },
  {
    id: '3',
    type: 'transfer',
    title: 'Ticket Transferred',
    description: 'TO 0X82...F91A',
    timestamp: '3 days ago',
    status: 'success',
  },
  {
    id: '4',
    type: 'reward',
    title: 'Reward Claimed',
    description: 'OG Collector Badge',
    timestamp: '1 week ago',
    status: 'success',
  },
  {
    id: '5',
    type: 'verification',
    title: 'Phone Verified',
    description: '+52 ****1234',
    timestamp: '2 weeks ago',
    status: 'success',
  },
]

export default function HistoryPage() {
  return (
    <AuthLayout>
      <div className="p-4 md:p-6 lg:p-8 max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'var(--font-climate)' }}>
            History
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Tu actividad on-chain en el protocolo
          </p>
        </div>

        <div className="bg-surface-container-low border border-border rounded-2xl p-4 md:p-6">
          <ActivityTimeline items={activities} />
        </div>
      </div>
    </AuthLayout>
  )
}
