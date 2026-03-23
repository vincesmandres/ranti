export const TICKET_STATES = [
  'issued',
  'active',
  'claimed',
  'checked_in',
  'completed',
  'rewarded',
  'used',
  'expired',
  'cancelled',
] as const

export type TicketState = (typeof TICKET_STATES)[number]

const transitionMap: Record<TicketState, TicketState[]> = {
  issued: ['claimed', 'checked_in', 'cancelled', 'expired'],
  active: ['claimed', 'checked_in', 'cancelled', 'expired'],
  claimed: ['checked_in', 'cancelled', 'expired'],
  checked_in: ['completed', 'rewarded', 'used'],
  completed: ['rewarded', 'used'],
  rewarded: ['used'],
  used: [],
  expired: [],
  cancelled: [],
}

export function normalizeTicketState(value: string | null | undefined): TicketState | null {
  if (!value) return null
  const normalized = value.toLowerCase() as TicketState
  return (TICKET_STATES as readonly string[]).includes(normalized) ? normalized : null
}

export function canTransitionTicketState(current: string | null | undefined, next: TicketState): boolean {
  const currentState = normalizeTicketState(current)
  if (!currentState) return false
  return transitionMap[currentState].includes(next)
}

export function isCheckInState(value: string | null | undefined): boolean {
  const state = normalizeTicketState(value)
  return state === 'checked_in' || state === 'completed' || state === 'rewarded' || state === 'used'
}

