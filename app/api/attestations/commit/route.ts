import { NextRequest, NextResponse } from 'next/server'
import { requireUser } from '@/lib/server/auth'
import { getSolanaCluster, isOnChainCheckInEnabled } from '@/lib/solana/network'
import {
  assertAccountOwnedByProgram,
  assertValidPublicKey,
  verifyProgramTransaction,
} from '@/lib/server/solana-attestation'

type CommitBody = {
  attestationId?: string
  ticketId?: string
  txSignature?: string
  checkInTxSignature?: string
  attestationPda?: string
  checkinPda?: string
}

export async function POST(request: NextRequest) {
  try {
    const { supabase, user, response } = await requireUser()
    if (response || !user) return response

    if (!isOnChainCheckInEnabled()) {
      return NextResponse.json(
        { error: 'On-chain attestation commit is disabled in this environment' },
        { status: 412 },
      )
    }

    const body = (await request.json()) as CommitBody
    const { attestationId, txSignature, ticketId, checkInTxSignature, attestationPda, checkinPda } = body
    if (!attestationId || !txSignature || !ticketId || !checkInTxSignature || !attestationPda || !checkinPda) {
      return NextResponse.json(
        {
          error:
            'attestationId, ticketId, txSignature, checkInTxSignature, attestationPda and checkinPda are required',
        },
        { status: 400 },
      )
    }

    const [{ data: profile, error: profileError }, { data: ticket, error: ticketError }] = await Promise.all([
      supabase.from('profiles').select('wallet_address').eq('id', user.id).single(),
      supabase.from('tickets').select('id, event_id').eq('id', ticketId).eq('user_id', user.id).single(),
    ])

    if (profileError || !profile?.wallet_address) {
      return NextResponse.json(
        { error: 'Wallet is not linked to profile for on-chain verification' },
        { status: 412 },
      )
    }

    if (ticketError || !ticket) {
      return NextResponse.json({ error: 'Ticket not found for user' }, { status: 404 })
    }

    const walletAddress = assertValidPublicKey(profile.wallet_address)
    const eventRef = String(ticket.event_id || ticket.id)

    let checkInVerification
    let commitVerification
    let checkinAccount
    let attestationAccount
    try {
      ;[checkInVerification, commitVerification, checkinAccount, attestationAccount] = await Promise.all([
        verifyProgramTransaction({
          txSignature: checkInTxSignature,
          expectedSigner: walletAddress,
          expectedTicketId: ticket.id,
          expectedEventId: eventRef,
          instructionType: 'check_in',
        }),
        verifyProgramTransaction({
          txSignature,
          expectedSigner: walletAddress,
          expectedTicketId: ticket.id,
          expectedEventId: eventRef,
          instructionType: 'commit_attestation',
          expectedCheckInTxSignature: checkInTxSignature,
        }),
        assertAccountOwnedByProgram(checkinPda),
        assertAccountOwnedByProgram(attestationPda),
      ])
    } catch (verifyError) {
      return NextResponse.json(
        {
          error: verifyError instanceof Error ? verifyError.message : 'Unable to validate anchor transactions',
        },
        { status: 409 },
      )
    }

    const { data: existing, error: existingError } = await supabase
      .from('attestations')
      .select('id, payload')
      .eq('id', attestationId)
      .eq('ticket_id', ticket.id)
      .eq('user_id', user.id)
      .single()

    if (existingError || !existing) {
      return NextResponse.json({ error: 'Attestation not found' }, { status: 404 })
    }

    const { data: updated, error } = await supabase
      .from('attestations')
      .update({
        status: `committed_${getSolanaCluster()}`,
        tx_signature: txSignature,
        committed_at: new Date().toISOString(),
        payload: {
          ...(typeof existing.payload === 'object' && existing.payload ? existing.payload : {}),
          checkin_tx_signature: checkInTxSignature,
          checkin_pda: checkinPda,
          attestation_pda: attestationPda,
          verification: {
            checkInVerification,
            commitVerification,
            checkinAccount,
            attestationAccount,
          },
        },
      })
      .eq('id', attestationId)
      .eq('ticket_id', ticket.id)
      .eq('user_id', user.id)
      .select('*')
      .single()

    if (error || !updated) {
      return NextResponse.json({ error: 'Attestation not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: updated,
    })
  } catch (error) {
    console.error('POST /api/attestations/commit exception:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
