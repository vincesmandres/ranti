import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { phone, countryCode } = await request.json()

    if (!phone || !countryCode) {
      return NextResponse.json(
        { error: 'Phone number and country code required' },
        { status: 400 }
      )
    }

    const fullPhone = `${countryCode}${phone.replace(/\D/g, '')}`

    // Validate phone format
    if (!/^\+\d{10,15}$/.test(fullPhone)) {
      return NextResponse.json(
        { error: 'Invalid phone number format' },
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

    // Check cooldown - get last OTP request
    const { data: profile } = await supabase
      .from('profiles')
      .select('phone_otp_sent_at')
      .eq('id', user.id)
      .single()

    if (profile?.phone_otp_sent_at) {
      const lastSent = new Date(profile.phone_otp_sent_at)
      const cooldownMs = 60 * 1000 // 60 seconds
      const timeSinceLastSent = Date.now() - lastSent.getTime()

      if (timeSinceLastSent < cooldownMs) {
        const remainingSeconds = Math.ceil((cooldownMs - timeSinceLastSent) / 1000)
        return NextResponse.json(
          { error: `Please wait ${remainingSeconds} seconds before requesting a new code`, cooldown: remainingSeconds },
          { status: 429 }
        )
      }
    }

    // Send OTP via Supabase Phone Auth
    const { error: otpError } = await supabase.auth.signInWithOtp({
      phone: fullPhone,
    })

    if (otpError) {
      console.error('OTP send error:', otpError)
      return NextResponse.json(
        { error: 'Failed to send verification code' },
        { status: 500 }
      )
    }

    // Update profile with pending phone and timestamp
    await supabase
      .from('profiles')
      .update({
        phone: fullPhone,
        phone_otp_sent_at: new Date().toISOString(),
      })
      .eq('id', user.id)

    return NextResponse.json({
      success: true,
      message: 'Verification code sent',
      phone: fullPhone.slice(-4), // Return last 4 digits only
    })
  } catch (error) {
    console.error('Phone start error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
