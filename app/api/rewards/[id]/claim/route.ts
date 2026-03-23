import { NextRequest, NextResponse } from 'next/server'
import { requireUser } from '@/lib/server/auth'
import { buildIdempotencyKey, isIdempotentReplay } from '@/lib/server/idempotency'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const { supabase, user, response } = await requireUser()
    if (response || !user) return response

    const requestId = request.headers.get('idempotency-key') || request.headers.get('x-request-id')
    const idempotencyKey = buildIdempotencyKey(['reward-claim', user.id, id, requestId || 'default'])
    if (isIdempotentReplay(idempotencyKey)) {
      return NextResponse.json({ success: true, idempotent: true })
    }

    const { data: reward, error: rewardError } = await supabase
      .from('rewards')
      .select('id, user_id, unlocked')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (rewardError || !reward) {
      return NextResponse.json({ error: 'Reward not found' }, { status: 404 })
    }

    if (reward.unlocked) {
      return NextResponse.json({
        success: true,
        idempotent: true,
        data: reward,
      })
    }

    const { data: updated, error: updateError } = await supabase
      .from('rewards')
      .update({ unlocked: true, unlocked_at: new Date().toISOString() })
      .eq('id', reward.id)
      .eq('user_id', user.id)
      .select('id, unlocked, unlocked_at')
      .single()

    if (updateError || !updated) {
      console.error('Reward claim update error:', updateError)
      return NextResponse.json({ error: 'Failed to claim reward' }, { status: 500 })
    }

    await supabase.from('activity_log').insert({
      user_id: user.id,
      type: 'reward_claimed',
      title: 'Reward unlocked',
      description: `Reward ${reward.id} unlocked`,
      metadata: { reward_id: reward.id, idempotency_key: idempotencyKey },
    })

    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    console.error('POST /api/rewards/[id]/claim exception:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

