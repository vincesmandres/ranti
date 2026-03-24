import { NextRequest, NextResponse } from 'next/server'
import { requireUser } from '@/lib/server/auth'
import { getSolanaCluster, isOnChainCheckInEnabled } from '@/lib/solana/network'

type PrepareBody = {
  ticketId?: string
  participationEvent?: string
  referenceId?: string
}

export async function POST(request: NextRequest) {
  try {
    const { supabase, user, response } = await requireUser()
    if (response || !user) return response

    if (!isOnChainCheckInEnabled()) {
      return NextResponse.json(
        { error: 'On-chain attestation prepare is disabled for this environment.' },
        { status: 412 },
      )
    }

    const body = (await request.json()) as PrepareBody
    if (!body.ticketId || !body.participationEvent) {
      return NextResponse.json(
        { error: 'ticketId and participationEvent are required' },
        { status: 400 },
      )
    }

    const { data: ownedTicket, error: ticketError } = await supabase
      .from('tickets')
      .select('id, event_id, user_id')
      .eq('id', body.ticketId)
      .eq('user_id', user.id)
      .single()

    if (ticketError || !ownedTicket) {
      return NextResponse.json({ error: 'Ticket not found for authenticated user' }, { status: 404 })
    }

    const payload = {
      user_id: user.id,
      ticket_id: body.ticketId,
      event_id: ownedTicket.event_id,
      event_type: body.participationEvent,
      reference_id: body.referenceId || null,
      prepared_at: new Date().toISOString(),
      network: `solana-${getSolanaCluster()}`,
      status: 'pending',
    }

    const { data, error } = await supabase
      .from('attestations')
      .insert({
        user_id: user.id,
        ticket_id: body.ticketId,
        event_type: body.participationEvent,
        reference_id: body.referenceId || null,
        status: 'pending',
        payload,
      })
      .select('*')
      .single()

    if (error || !data) {
      console.error('Prepare attestation error:', error)
      return NextResponse.json(
        {
          error:
            'Failed to persist pending attestation. Verify Supabase schema/table "attestations" and RLS policies.',
        },
        { status: 503 },
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        pending: true,
        persisted: true,
        attestation: data,
      },
    })
  } catch (error) {
    console.error('POST /api/attestations/prepare exception:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
