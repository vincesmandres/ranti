import { NextRequest, NextResponse } from 'next/server'
import { requireUser } from '@/lib/server/auth'
import { canTransitionTicketState, normalizeTicketState } from '@/lib/server/ticket-state'
import { buildIdempotencyKey, isIdempotentReplay } from '@/lib/server/idempotency'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const { supabase, user, response } = await requireUser()
    if (response || !user) return response

    const requestId = request.headers.get('x-request-id') || request.headers.get('idempotency-key')
    const idempotencyKey = buildIdempotencyKey(['claim', user.id, id, requestId || 'default'])
    if (isIdempotentReplay(idempotencyKey)) {
      return NextResponse.json({
        success: true,
        idempotent: true,
        message: 'Claim already processed',
      })
    }

    const { data: ticket, error: ticketError } = await supabase
      .from('tickets')
      .select('id, status, user_id')
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

    if (currentState === 'claimed' || currentState === 'checked_in' || currentState === 'completed' || currentState === 'rewarded' || currentState === 'used') {
      return NextResponse.json({
        success: true,
        idempotent: true,
        data: { id: ticket.id, status: currentState },
      })
    }

    if (!canTransitionTicketState(currentState, 'claimed')) {
      return NextResponse.json(
        { error: `Cannot claim ticket from state: ${currentState}` },
        { status: 409 },
      )
    }

    const { data: updated, error: updateError } = await supabase
      .from('tickets')
      .update({ status: 'claimed' })
      .eq('id', ticket.id)
      .eq('user_id', user.id)
      .select('id, status')
      .single()

    if (updateError || !updated) {
      console.error('Claim ticket update error:', updateError)
      return NextResponse.json({ error: 'Failed to claim ticket' }, { status: 500 })
    }

    await supabase.from('activity_log').insert({
      user_id: user.id,
      type: 'ticket_claimed',
      title: 'Ticket claimed',
      description: `Ticket ${ticket.id} moved to claimed`,
      metadata: { ticket_id: ticket.id, status: 'claimed' },
    })

    return NextResponse.json({
      success: true,
      data: updated,
    })
  } catch (error) {
    console.error('POST /api/tickets/[id]/claim exception:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

