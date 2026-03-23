import { NextRequest, NextResponse } from 'next/server'
import { requireUser } from '@/lib/server/auth'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params
    const { supabase, user, response } = await requireUser()
    if (response || !user) return response

    const body = await request.json().catch(() => ({}))
    const ticketId = body?.ticketId ?? null

    await supabase.from('activity_log').insert({
      user_id: user.id,
      type: 'participation_started',
      title: 'Participation event started',
      description: `Action ${slug} started`,
      metadata: { slug, ticket_id: ticketId },
    })

    return NextResponse.json({
      success: true,
      data: {
        slug,
        participationEvent: 'started',
        ticketId,
      },
    })
  } catch (error) {
    console.error('POST /api/actions/[slug]/execute exception:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

