import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/server/auth'

export async function GET() {
  try {
    const { supabase, user, response } = await requireUser()
    if (response || !user) return response

    const [activityResult, ticketResult, rewardResult] = await Promise.all([
      supabase
        .from('activity_log')
        .select('id, type, title, description, metadata, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50),
      supabase
        .from('tickets')
        .select('id, status, event_id, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50),
      supabase
        .from('rewards')
        .select('id, name, type, unlocked, unlocked_at')
        .eq('user_id', user.id)
        .order('unlocked_at', { ascending: false })
        .limit(50),
    ])

    if (activityResult.error || ticketResult.error || rewardResult.error) {
      console.error('Get /api/history errors:', {
        activity: activityResult.error,
        tickets: ticketResult.error,
        rewards: rewardResult.error,
      })
      return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: {
        activity: activityResult.data || [],
        tickets: ticketResult.data || [],
        rewards: rewardResult.data || [],
      },
    })
  } catch (error) {
    console.error('Get /api/history exception:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

