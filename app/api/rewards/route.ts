import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/server/auth'

export async function GET() {
  try {
    const { supabase, user, response } = await requireUser()
    if (response || !user) return response

    const { data, error } = await supabase
      .from('rewards')
      .select('*')
      .eq('user_id', user.id)
      .order('unlocked_at', { ascending: false })

    if (error) {
      console.error('Get /api/rewards error:', error)
      return NextResponse.json({ error: 'Failed to fetch rewards' }, { status: 500 })
    }

    const unlocked = (data || []).filter((reward) => reward.unlocked)
    const locked = (data || []).filter((reward) => !reward.unlocked)

    return NextResponse.json({
      success: true,
      data: {
        unlocked,
        locked,
        total: data?.length || 0,
      },
    })
  } catch (error) {
    console.error('Get /api/rewards exception:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

