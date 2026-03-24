export interface EventRef {
  id: string
  name: string
  slug: string | null
  venue: string | null
  event_date: string | null
  image_url: string | null
}

export interface DashboardUserInfo {
  id: string
  email: string | null
  walletAddress: string | null
  displayName: string
}

export interface DashboardProfile {
  id: string
  wallet_address: string | null
  display_name: string | null
  phone: string | null
  phoneVerified: boolean
  participation_score: number
  level: number
  created_at: string
}

export interface DashboardTicket {
  id: string
  token_id: string | null
  status: 'issued' | 'active' | 'checked_in' | 'used' | 'expired' | 'cancelled' | 'claimed' | 'completed' | 'rewarded'
  statusLabel: string
  tier: string
  qr_code: string | null
  created_at: string
  events: EventRef | null
}

export interface TicketHistoryItem {
  id: string
  status: string
  created_at: string
  events: { name: string } | null
}

export interface Reward {
  id: string
  type: string
  name: string
  description: string | null
  unlocked: boolean
  unlocked_at: string | null
  metadata: Record<string, unknown>
}

export interface ActivityItem {
  id: string
  type: string
  title: string
  description: string | null
  tx_hash: string | null
  created_at: string
}

export interface DashboardData {
  user: DashboardUserInfo
  profile: DashboardProfile
  participation: {
    score: number
    level: number
    progress: number
    nextLevelAt: number
  }
  tickets: {
    active: DashboardTicket[]
    checkedIn: DashboardTicket[]
    used: DashboardTicket[]
    total: number
  }
  ticketHistory: TicketHistoryItem[]
  rewards: {
    unlocked: Reward[]
    locked: Reward[]
    total: number
  }
  activity: ActivityItem[]
  source?: 'live' | 'demo-fallback'
}

export interface OrganizerEvent {
  id: string
  name: string
  status: 'ACTIVE' | 'PAST'
  event_date: string
  venue: string
  tickets_sold: number
  max_capacity: number
  image_url: string
}

export interface CommunityMember {
  user_id: string
  name: string
  wallet: string
  participation: number
  status: 'Verified' | 'Syncing' | 'Pending'
}

export interface OrganizerStats {
  totalEvents: number
  activeEvents: number
  totalTicketsSold: number
  totalMembers: number
}

export interface OrganizerData {
  profile: unknown
  events: OrganizerEvent[]
  members: CommunityMember[]
  stats: OrganizerStats
  source?: 'live' | 'demo-fallback'
}
