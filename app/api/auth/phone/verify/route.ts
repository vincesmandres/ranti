import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()

    if (!code || code.length !== 6) {
      return NextResponse.json(
        { error: 'Invalid verification code' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Get pending phone number from profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('phone')
      .eq('id', user.id)
      .single()

    if (profileError || !profile?.phone) {
      return NextResponse.json(
        { error: 'No pending phone verification' },
        { status: 400 }
      )
    }

    // Verify OTP with Supabase
    const { error: verifyError } = await supabase.auth.verifyOtp({
      phone: profile.phone,
      token: code,
      type: 'sms',
    })

    if (verifyError) {
      console.error('OTP verify error:', verifyError)
      
      // Check if it's an invalid code error
      if (verifyError.message.includes('invalid') || verifyError.message.includes('expired')) {
        return NextResponse.json(
          { error: 'Invalid or expired code. Please try again.' },
          { status: 400 }
        )
      }

      return NextResponse.json(
        { error: 'Verification failed' },
        { status: 400 }
      )
    }

    // Update profile as verified
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        phone_verified: true,
        phone_verified_at: new Date().toISOString(),
      })
      .eq('id', user.id)

    if (updateError) {
      console.error('Profile update error:', updateError)
      return NextResponse.json(
        { error: 'Failed to update verification status' },
        { status: 500 }
      )
    }

    // Log activity
    await supabase.from('activity_log').insert({
      user_id: user.id,
      type: 'phone_verified',
      title: 'Phone Verified',
      description: `Phone number verified: ***${profile.phone.slice(-4)}`,
      metadata: { phone: profile.phone },
    })

    return NextResponse.json({
      success: true,
      message: 'Phone verified successfully',
      verified: true,
    })
  } catch (error) {
    console.error('Phone verify error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
