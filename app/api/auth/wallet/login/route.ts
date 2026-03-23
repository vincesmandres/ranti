import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateSignInMessage, getUserDataFromWallet } from '@/lib/solana/auth'

/**
 * POST /api/auth/wallet/login
 * Initiates wallet login flow - generates sign message
 */
export async function POST(request: NextRequest) {
  try {
    const { publicKey } = await request.json()

    if (!publicKey) {
      return NextResponse.json(
        { error: 'Public key is required' },
        { status: 400 }
      )
    }

    // Generate sign-in message
    const message = await generateSignInMessage(publicKey)

    return NextResponse.json({
      message,
      success: true,
    })
  } catch (error) {
    console.error('Wallet login error:', error)
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    )
  }
}
