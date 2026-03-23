type RateLimitEntry = {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

export function getClientIdentifier(headers: Headers, fallback = 'anonymous'): string {
  return (
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headers.get('x-real-ip') ||
    fallback
  )
}

export function rateLimit(params: {
  key: string
  max: number
  windowMs: number
}): { ok: boolean; remaining: number; retryAfterSeconds: number } {
  const now = Date.now()
  const current = store.get(params.key)

  if (!current || current.resetAt <= now) {
    store.set(params.key, { count: 1, resetAt: now + params.windowMs })
    return { ok: true, remaining: params.max - 1, retryAfterSeconds: 0 }
  }

  if (current.count >= params.max) {
    return {
      ok: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    }
  }

  current.count += 1
  store.set(params.key, current)
  return {
    ok: true,
    remaining: params.max - current.count,
    retryAfterSeconds: 0,
  }
}

