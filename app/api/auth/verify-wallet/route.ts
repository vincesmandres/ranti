import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { parseSignInMessage, verifyWalletSignature } from '@/lib/solana/auth'
import { getClientIdentifier, rateLimit } from '@/lib/server/rate-limit'

/**
 * POST /api/auth/verify-wallet
 * Verifies wallet signature and creates/updates user session
 */
export async function POST(request: NextRequest) {
  try {
    const { publicKey, signature, message } = await request.json()

    if (!publicKey || !signature || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const parsed = parseSignInMessage(message)
    if (!parsed.hasPrefix || parsed.wallet !== publicKey || !parsed.isFresh || !parsed.nonce) {
      return NextResponse.json(
        { error: 'Invalid or expired wallet challenge' },
        { status: 401 },
      )
    }

    const clientId = getClientIdentifier(request.headers, publicKey)
    const limiter = rateLimit({
      key: `wallet:verify:${publicKey}:${clientId}`,
      max: 20,
      windowMs: 10 * 60 * 1000,
    })
    if (!limiter.ok) {
      return NextResponse.json(
        { error: 'Too many wallet verification attempts', retryAfter: limiter.retryAfterSeconds },
        { status: 429 },
      )
    }

    // Verify the signature cryptographically server-side.
    const isValid = await verifyWalletSignature(publicKey, signature, message)

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }

    const supabase = await createClient()

    // Attempt to link to current authenticated Supabase user when present.
    const {
      data: { user: sessionUser },
    } = await supabase.auth.getUser()

    if (sessionUser) {
      const { error: updateProfileError } = await supabase
        .from('profiles')
        .update({ wallet_address: publicKey })
        .eq('id', sessionUser.id)

      if (updateProfileError) {
        console.error('Wallet profile link error:', updateProfileError)
        return NextResponse.json(
          { error: 'Failed to link wallet to current account' },
          { status: 500 },
        )
      }

      return NextResponse.json({
        success: true,
        linked: true,
        user: {
          id: sessionUser.id,
          wallet_address: publicKey,
        },
      })
    }

    // Fallback: verify whether this wallet is already linked to an existing profile.
    const { data: existingProfile, error: profileLookupError } = await supabase
      .from('profiles')
      .select('id, wallet_address')
      .eq('wallet_address', publicKey)
      .single()

    if (profileLookupError && profileLookupError.code !== 'PGRST116') {
      console.error('Wallet lookup error:', profileLookupError)
      return NextResponse.json(
        { error: 'Unable to verify wallet link' },
        { status: 500 },
      )
    }

    if (!existingProfile) {
      return NextResponse.json(
        { error: 'Wallet is valid but not linked to any account yet' },
        { status: 401 },
      )
    }

    return NextResponse.json({
      success: true,
      linked: true,
      user: {
        id: existingProfile.id,
        wallet_address: publicKey,
      },
    })
  } catch (error) {
    console.error('Wallet verification error:', error)
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 500 }
    )
  }
}
