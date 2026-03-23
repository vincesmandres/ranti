import { NextRequest, NextResponse } from 'next/server'
import { requireUser } from '@/lib/server/auth'

type PrepareBody = {
  ticketId?: string
  participationEvent?: string
  referenceId?: string
}

export async function POST(request: NextRequest) {
  try {
    const { supabase, user, response } = await requireUser()
    if (response || !user) return response

    const body = (await request.json()) as PrepareBody
    if (!body.ticketId || !body.participationEvent) {
      return NextResponse.json(
        { error: 'ticketId and participationEvent are required' },
        { status: 400 },
      )
    }

    const payload = {
      user_id: user.id,
      ticket_id: body.ticketId,
      event_type: body.participationEvent,
      reference_id: body.referenceId || null,
      prepared_at: new Date().toISOString(),
      network: 'solana-devnet',
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

    if (error) {
      console.warn('Prepare attestation warning:', error.message)
      return NextResponse.json({
        success: true,
        data: {
          pending: true,
          persisted: false,
          payload,
        },
      })
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

