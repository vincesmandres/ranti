import { NextRequest, NextResponse } from 'next/server'
import { requireUser } from '@/lib/server/auth'
import { canTransitionTicketState, isCheckInState, normalizeTicketState } from '@/lib/server/ticket-state'
import { buildIdempotencyKey, isIdempotentReplay } from '@/lib/server/idempotency'
import { getClientIdentifier, rateLimit } from '@/lib/server/rate-limit'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const { supabase, user, response } = await requireUser()
    if (response || !user) return response

    const clientId = getClientIdentifier(request.headers, user.id)
    const limiter = rateLimit({
      key: `checkin:${user.id}:${clientId}`,
      max: 10,
      windowMs: 60 * 1000,
    })
    if (!limiter.ok) {
      return NextResponse.json(
        { error: 'Too many check-in attempts', retryAfter: limiter.retryAfterSeconds },
        { status: 429 },
      )
    }

    const requestId = request.headers.get('idempotency-key') || request.headers.get('x-request-id')
    const idempotencyKey = buildIdempotencyKey(['checkin', user.id, id, requestId || 'default'])
    if (isIdempotentReplay(idempotencyKey)) {
      return NextResponse.json({
        success: true,
        idempotent: true,
        message: 'Check-in already processed',
      })
    }

    const { data: ticket, error: ticketError } = await supabase
      .from('tickets')
      .select('id, status, user_id, event_id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (ticketError || !ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 })
    }

    const currentState = normalizeTicketState(ticket.status)
    if (!currentState) {
      return NextResponse.json({ error: 'Invalid ticket state' }, { status: 409 })
    }

    if (isCheckInState(currentState)) {
      return NextResponse.json({
        success: true,
        idempotent: true,
        data: { id: ticket.id, status: currentState },
      })
    }

    if (!canTransitionTicketState(currentState, 'checked_in')) {
      return NextResponse.json(
        { error: `Cannot check in from state: ${currentState}` },
        { status: 409 },
      )
    }

    const { data: updated, error: updateError } = await supabase
      .from('tickets')
      .update({ status: 'checked_in' })
      .eq('id', ticket.id)
      .eq('user_id', user.id)
      .select('id, status, event_id')
      .single()

    if (updateError || !updated) {
      console.error('Check-in update error:', updateError)
      return NextResponse.json({ error: 'Failed to check in' }, { status: 500 })
    }

    const { error: checkinInsertError } = await supabase.from('checkins').insert({
      ticket_id: ticket.id,
      user_id: user.id,
      event_id: ticket.event_id,
      status: 'confirmed',
      idempotency_key: idempotencyKey,
    })

    // Keep behavior resilient even if the table is not present yet.
    if (checkinInsertError) {
      console.warn('Checkins insert warning:', checkinInsertError.message)
    }

    await supabase.from('activity_log').insert({
      user_id: user.id,
      type: 'check_in',
      title: 'Check-in verified',
      description: `Ticket ${ticket.id} checked in`,
      metadata: {
        ticket_id: ticket.id,
        event_id: ticket.event_id,
        idempotency_key: idempotencyKey,
      },
    })

    return NextResponse.json({
      success: true,
      data: updated,
    })
  } catch (error) {
    console.error('POST /api/tickets/[id]/check-in exception:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

