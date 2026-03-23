const idempotencyStore = new Map<string, number>()

export function buildIdempotencyKey(parts: Array<string | null | undefined>): string {
  return parts.filter(Boolean).join(':')
}

export function isIdempotentReplay(key: string, ttlMs = 5 * 60 * 1000): boolean {
  const now = Date.now()
  const existing = idempotencyStore.get(key)
  if (existing && existing > now) {
    return true
  }

  idempotencyStore.set(key, now + ttlMs)
  return false
}

