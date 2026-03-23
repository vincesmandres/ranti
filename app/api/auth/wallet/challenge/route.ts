import { NextRequest, NextResponse } from 'next/server'
import { generateSignInMessage } from '@/lib/solana/auth'
import { getClientIdentifier, rateLimit } from '@/lib/server/rate-limit'

/**
 * POST /api/auth/wallet/challenge
 * Generates a signed message challenge for wallet auth.
 */
export async function POST(request: NextRequest) {
  try {
    const { publicKey } = await request.json()
    if (!publicKey || typeof publicKey !== 'string') {
      return NextResponse.json({ error: 'Public key is required' }, { status: 400 })
    }

    const clientId = getClientIdentifier(request.headers, 'wallet-challenge')
    const limiter = rateLimit({
      key: `wallet:challenge:${clientId}`,
      max: 20,
      windowMs: 10 * 60 * 1000,
    })
    if (!limiter.ok) {
      return NextResponse.json(
        { error: 'Too many challenge requests', retryAfter: limiter.retryAfterSeconds },
        { status: 429 },
      )
    }

    const message = await generateSignInMessage(publicKey)
    return NextResponse.json({ success: true, message })
  } catch (error) {
    console.error('Wallet challenge error:', error)
    return NextResponse.json({ error: 'Failed to generate challenge' }, { status: 500 })
  }
}

