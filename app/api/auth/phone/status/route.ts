import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/server/auth'

export async function GET() {
  try {
    const { supabase, user, response } = await requireUser()
    if (response || !user) return response

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('phone, phone_verified, phone_verified_at, phone_otp_sent_at')
      .eq('id', user.id)
      .single()

    if (error) {
      console.error('Phone status error:', error)
      return NextResponse.json({ error: 'Failed to fetch phone status' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: {
        phoneMasked: profile?.phone ? `***${String(profile.phone).slice(-4)}` : null,
        phoneVerified: Boolean(profile?.phone_verified),
        phoneVerifiedAt: profile?.phone_verified_at || null,
        otpLastSentAt: profile?.phone_otp_sent_at || null,
      },
    })
  } catch (error) {
    console.error('GET /api/auth/phone/status exception:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

