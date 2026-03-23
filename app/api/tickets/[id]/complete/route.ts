import { NextRequest, NextResponse } from 'next/server'
import { requireUser } from '@/lib/server/auth'
import { canTransitionTicketState, normalizeTicketState } from '@/lib/server/ticket-state'

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const { supabase, user, response } = await requireUser()
    if (response || !user) return response

    const { data: ticket, error: ticketError } = await supabase
      .from('tickets')
      .select('id, status')
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

    if (currentState === 'completed' || currentState === 'rewarded' || currentState === 'used') {
      return NextResponse.json({
        success: true,
        idempotent: true,
        data: { id: ticket.id, status: currentState },
      })
    }

    if (!canTransitionTicketState(currentState, 'completed')) {
      return NextResponse.json(
        { error: `Cannot complete ticket from state: ${currentState}` },
        { status: 409 },
      )
    }

    const { data: updated, error: updateError } = await supabase
      .from('tickets')
      .update({ status: 'completed' })
      .eq('id', ticket.id)
      .eq('user_id', user.id)
      .select('id, status')
      .single()

    if (updateError || !updated) {
      return NextResponse.json({ error: 'Failed to complete ticket' }, { status: 500 })
    }

    await supabase.from('activity_log').insert({
      user_id: user.id,
      type: 'ticket_completed',
      title: 'Participation completed',
      description: `Ticket ${ticket.id} completed`,
      metadata: { ticket_id: ticket.id },
    })

    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    console.error('POST /api/tickets/[id]/complete exception:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

