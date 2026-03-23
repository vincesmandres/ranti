import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/server/auth'

type RewardSeed = {
  name: string
  description: string
  type: 'badge' | 'multiplier' | 'perk'
}

const AUTO_REWARDS: Array<RewardSeed & { minCheckins: number }> = [
  {
    name: 'First Check-in',
    description: 'Unlocked after your first verified check-in',
    type: 'badge',
    minCheckins: 1,
  },
  {
    name: 'Recurring Attendee',
    description: 'Unlocked after three verified participations',
    type: 'multiplier',
    minCheckins: 3,
  },
]

export async function POST() {
  try {
    const { supabase, user, response } = await requireUser()
    if (response || !user) return response

    const { data: tickets, error: ticketsError } = await supabase
      .from('tickets')
      .select('id, status')
      .eq('user_id', user.id)
      .in('status', ['checked_in', 'completed', 'rewarded', 'used'])

    if (ticketsError) {
      console.error('Evaluate rewards tickets error:', ticketsError)
      return NextResponse.json({ error: 'Failed to evaluate rewards' }, { status: 500 })
    }

    const checkinCount = tickets?.length ?? 0
    const { data: existingRewards, error: rewardsError } = await supabase
      .from('rewards')
      .select('id, name, unlocked')
      .eq('user_id', user.id)

    if (rewardsError) {
      console.error('Evaluate rewards fetch error:', rewardsError)
      return NextResponse.json({ error: 'Failed to evaluate rewards' }, { status: 500 })
    }

    const byName = new Map((existingRewards || []).map((reward) => [reward.name, reward]))
    const unlockedNow: string[] = []

    for (const rewardSeed of AUTO_REWARDS) {
      if (checkinCount < rewardSeed.minCheckins) continue

      const existing = byName.get(rewardSeed.name)
      if (existing?.unlocked) continue

      if (existing) {
        const { error: updateError } = await supabase
          .from('rewards')
          .update({ unlocked: true, unlocked_at: new Date().toISOString() })
          .eq('id', existing.id)

        if (updateError) {
          console.warn(`Reward update warning (${rewardSeed.name}):`, updateError.message)
          continue
        }
      } else {
        const { error: insertError } = await supabase
          .from('rewards')
          .insert({
            user_id: user.id,
            name: rewardSeed.name,
            description: rewardSeed.description,
            type: rewardSeed.type,
            unlocked: true,
            unlocked_at: new Date().toISOString(),
            metadata: {
              source: 'participation_evaluation',
              min_checkins: rewardSeed.minCheckins,
            },
          })

        if (insertError) {
          console.warn(`Reward insert warning (${rewardSeed.name}):`, insertError.message)
          continue
        }
      }

      unlockedNow.push(rewardSeed.name)
    }

    return NextResponse.json({
      success: true,
      data: {
        checkinCount,
        unlockedNow,
      },
    })
  } catch (error) {
    console.error('POST /api/rewards/evaluate exception:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

