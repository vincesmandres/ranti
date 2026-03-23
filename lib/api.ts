// Ranti Protocol API Client

import { config } from './config'
import type {
  User,
  Session,
  Ticket,
  TicketDetail,
  Event,
  CheckIn,
  RewardStatus,
  Activity,
  ApiResponse,
  PaginatedResponse,
  OtpRequest,
  OtpVerify,
  WalletAuthRequest,
} from './types'

class ApiClient {
  private baseUrl: string
  private accessToken: string | null = null

  constructor() {
    this.baseUrl = config.apiUrl
  }

  setAccessToken(token: string | null) {
    this.accessToken = token
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(this.accessToken && { Authorization: `Bearer ${this.accessToken}` }),
      ...options.headers,
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          data: null as T,
          success: false,
          error: data.message || 'Request failed',
        }
      }

      return { data, success: true }
    } catch (error) {
      return {
        data: null as T,
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      }
    }
  }

  // Auth
  async requestOtp(data: OtpRequest): Promise<ApiResponse<{ sent: boolean }>> {
    return this.request('/auth/otp/request', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async verifyOtp(data: OtpVerify): Promise<ApiResponse<Session>> {
    return this.request('/auth/otp/verify', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async walletAuth(data: WalletAuthRequest): Promise<ApiResponse<Session>> {
    return this.request('/auth/wallet', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getSession(): Promise<ApiResponse<Session>> {
    return this.request('/auth/session')
  }

  async logout(): Promise<ApiResponse<{ success: boolean }>> {
    return this.request('/auth/logout', { method: 'POST' })
  }

  // Profile
  async getProfile(): Promise<ApiResponse<User>> {
    return this.request('/profiles/me')
  }

  async updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    return this.request('/profiles/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  // Tickets
  async getTickets(): Promise<ApiResponse<Ticket[]>> {
    return this.request('/tickets')
  }

  async getTicket(id: string): Promise<ApiResponse<TicketDetail>> {
    return this.request(`/tickets/${id}`)
  }

  async redeemTicket(code: string): Promise<ApiResponse<Ticket>> {
    return this.request('/tickets/redeem', {
      method: 'POST',
      body: JSON.stringify({ code }),
    })
  }

  // Events
  async getEvents(): Promise<ApiResponse<PaginatedResponse<Event>>> {
    return this.request('/events')
  }

  async getEvent(id: string): Promise<ApiResponse<Event>> {
    return this.request(`/events/${id}`)
  }

  // Check-in
  async checkIn(ticketId: string): Promise<ApiResponse<CheckIn>> {
    return this.request('/checkins', {
      method: 'POST',
      body: JSON.stringify({ ticketId }),
    })
  }

  async getCheckInStatus(ticketId: string): Promise<ApiResponse<CheckIn>> {
    return this.request(`/checkins/ticket/${ticketId}`)
  }

  // Rewards
  async getRewardStatus(): Promise<ApiResponse<RewardStatus>> {
    return this.request('/rewards/status')
  }

  async claimReward(rewardId: string): Promise<ApiResponse<{ claimed: boolean }>> {
    return this.request(`/rewards/${rewardId}/claim`, { method: 'POST' })
  }

  // Activity
  async getActivity(): Promise<ApiResponse<Activity[]>> {
    return this.request('/activity')
  }
}

export const api = new ApiClient()
