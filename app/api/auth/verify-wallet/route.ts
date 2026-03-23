import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { verifyWalletSignature, getUserDataFromWallet } from '@/lib/solana/auth'

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

    // Verify the signature
    const isValid = await verifyWalletSignature(publicKey, signature, message)

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }

    const supabase = await createClient()

    // Get or create user with wallet address
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('id, wallet_address')
      .eq('wallet_address', publicKey)
      .single()

    let userId = existingUser?.id

    // If user doesn't exist, create a new one in Supabase auth
    if (!userId) {
      const userData = await getUserDataFromWallet(publicKey)

      // Create session via custom auth method
      // In production, you'd use signInWithIdToken or similar
      const { data: { session }, error: authError } = await supabase.auth.signInWithPassword({
        email: `${publicKey}@solana.local`,
        password: publicKey, // Use public key as temporary password
      })

      if (authError || !session) {
        // If user doesn't exist, we need to create them first
        return NextResponse.json(
          { error: 'Authentication failed' },
          { status: 401 }
        )
      }

      userId = session.user.id
    }

    // Set session cookie
    const { data: { session }, error: sessionError } = await supabase.auth.refreshSession()

    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Session creation failed' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      user: {
        id: userId,
        wallet_address: publicKey,
      },
      session,
    })
  } catch (error) {
    console.error('Wallet verification error:', error)
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 500 }
    )
  }
}
