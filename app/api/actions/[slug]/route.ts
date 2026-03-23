import { NextRequest, NextResponse } from 'next/server'
import { requireUser } from '@/lib/server/auth'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params

  return NextResponse.json({
    success: true,
    data: {
      slug,
      type: 'blink_action',
      title: 'Start participation flow',
      description: 'Open a distributed action that activates ticket participation',
      executePath: `/api/actions/${slug}/execute`,
    },
  })
}

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
      type: 'blink_action',
      title: 'Blink action executed',
      description: `Action ${slug} executed`,
      metadata: { slug, ticket_id: ticketId },
    })

    return NextResponse.json({
      success: true,
      data: {
        slug,
        activated: true,
        ticketId,
      },
    })
  } catch (error) {
    console.error('POST /api/actions/[slug] exception:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

