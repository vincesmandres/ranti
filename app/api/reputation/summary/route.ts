import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/server/auth'

export async function GET() {
  try {
    const { supabase, user, response } = await requireUser()
    if (response || !user) return response

    const [{ count: checkinCount }, { count: rewardCount }, profileResult] = await Promise.all([
      supabase
        .from('tickets')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .in('status', ['checked_in', 'completed', 'rewarded', 'used']),
      supabase
        .from('rewards')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('unlocked', true),
      supabase
        .from('profiles')
        .select('participation_score')
        .eq('id', user.id)
        .single(),
    ])

    const baseScore = profileResult.data?.participation_score ?? 0
    const derivedScore = baseScore + (checkinCount ?? 0) * 100 + (rewardCount ?? 0) * 50
    const level = Math.max(1, Math.floor(derivedScore / 1000) + 1)

    return NextResponse.json({
      success: true,
      data: {
        score: derivedScore,
        level,
        checkins: checkinCount ?? 0,
        unlockedRewards: rewardCount ?? 0,
      },
    })
  } catch (error) {
    console.error('GET /api/reputation/summary exception:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

