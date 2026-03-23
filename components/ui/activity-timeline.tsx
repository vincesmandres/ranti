'use client'

import { cn } from "@/lib/utils"

export interface ActivityItem {
  id: string
  type: 'check-in' | 'mint' | 'transfer' | 'reward' | 'verification' | 'system'
  title: string
  description?: string
  timestamp: string
  status?: 'success' | 'pending' | 'error'
}

interface ActivityTimelineProps {
  items: ActivityItem[]
  className?: string
  showMore?: boolean
  onShowMore?: () => void
}

const typeIcons: Record<ActivityItem['type'], React.ReactNode> = {
  'check-in': (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  'mint': (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
  ),
  'transfer': (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  ),
  'reward': (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="none" stroke="currentColor" strokeWidth={2} />
    </svg>
  ),
  'verification': (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  'system': (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
}

const statusColors: Record<string, string> = {
  success: 'bg-primary/20 text-primary border-primary/30',
  pending: 'bg-secondary/20 text-secondary border-secondary/30',
  error: 'bg-destructive/20 text-destructive border-destructive/30',
}

export function ActivityTimeline({ items, className, showMore, onShowMore }: ActivityTimelineProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {items.map((item, index) => (
        <div
          key={item.id}
          className="flex items-start gap-3 p-3 rounded-xl border border-border hover:border-primary/30 transition-colors bg-surface-container-low"
        >
          <div
            className={cn(
              "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 border",
              item.status ? statusColors[item.status] : 'bg-primary/10 text-primary border-primary/20'
            )}
          >
            {typeIcons[item.type]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-foreground">{item.title}</p>
            {item.description && (
              <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{item.description}</p>
            )}
          </div>
          <span className="text-[10px] text-muted-foreground flex-shrink-0">{item.timestamp}</span>
        </div>
      ))}
      {showMore && (
        <button
          onClick={onShowMore}
          className="w-full py-2 text-xs font-bold text-primary hover:text-primary/80 transition-colors"
        >
          View More Activity
        </button>
      )}
    </div>
  )
}
