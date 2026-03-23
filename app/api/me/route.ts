import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/server/auth'

export async function GET() {
  try {
    const { supabase, user, response } = await requireUser()
    if (response || !user) return response

    const { data: profile } = await supabase
      .from('profiles')
      .select('id, display_name, wallet_address, phone_verified, role, created_at')
      .eq('id', user.id)
      .single()

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        profile: profile || null,
      },
    })
  } catch (error) {
    console.error('Get /api/me error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

