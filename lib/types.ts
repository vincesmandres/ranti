// Ranti Protocol Types

// User & Auth
export interface User {
  id: string
  walletAddress: string | null
  phone: string | null
  phoneVerified: boolean
  role: 'attendee' | 'organizer'
  createdAt: string
  updatedAt: string
}

export interface Session {
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
}

// Tickets
export interface Ticket {
  id: string
  eventId: string
  eventName: string
  eventDate: string
  venue: string
  status: 'active' | 'used' | 'expired' | 'pending'
  mintAddress: string | null
  ownerId: string
  createdAt: string
  checkInAt: string | null
  tier: 'general' | 'vip' | 'platinum'
}

export interface TicketDetail extends Ticket {
  qrCode: string
  transactionHash: string | null
  metadata: {
    image?: string
    description?: string
    attributes?: Array<{ trait_type: string; value: string }>
  }
}

// Events
export interface Event {
  id: string
  name: string
  description: string
  date: string
  venue: string
  organizerId: string
  status: 'draft' | 'active' | 'past' | 'cancelled'
  capacity: number
  ticketsSold: number
  imageUrl?: string
  createdAt: string
}

// Check-in
export interface CheckIn {
  id: string
  ticketId: string
  eventId: string
  userId: string
  timestamp: string
  transactionHash: string | null
  status: 'pending' | 'confirmed' | 'failed'
}

// Rewards
export interface Reward {
  id: string
  name: string
  description: string
  icon: string
  type: 'badge' | 'multiplier' | 'perk'
  status: 'active' | 'locked' | 'claimed'
  unlockedAt?: string
  requirements?: string
}

export interface RewardStatus {
  totalPoints: number
  level: number
  levelName: string
  nextLevelPoints: number
  progressPercent: number
  rewards: Reward[]
}

// Activity
export interface Activity {
  id: string
  type: 'check_in' | 'transfer' | 'mint' | 'reward' | 'verification'
  title: string
  description: string
  timestamp: string
  transactionHash?: string
  status: 'pending' | 'confirmed' | 'failed'
}

// API Responses
export interface ApiResponse<T> {
  data: T
  success: boolean
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

// OTP
export interface OtpRequest {
  phone: string
  countryCode: string
}

export interface OtpVerify {
  phone: string
  code: string
}

// Wallet Auth
export interface WalletAuthRequest {
  walletAddress: string
  signature: string
  message: string
}
