import { NextRequest, NextResponse } from 'next/server'
import { requireUser } from '@/lib/server/auth'
import { getSolanaCluster, isOnChainCheckInEnabled } from '@/lib/solana/network'
import { assertValidPublicKey, verifyCheckInTransaction } from '@/lib/server/solana-attestation'

type CommitBody = {
  attestationId?: string
  ticketId?: string
  txSignature?: string
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

    const { attestationId, txSignature, ticketId } = (await request.json()) as CommitBody
    if (!attestationId || !txSignature || !ticketId) {
      return NextResponse.json(
        { error: 'attestationId, ticketId and txSignature are required' },
        { status: 400 },
      )
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('wallet_address')
      .eq('id', user.id)
      .single()

    if (profileError || !profile?.wallet_address) {
      return NextResponse.json(
        { error: 'Wallet is not linked to profile for on-chain verification' },
        { status: 412 },
      )
    }

    const walletAddress = assertValidPublicKey(profile.wallet_address)

    let verification
    try {
      verification = await verifyCheckInTransaction({
        txSignature,
        expectedSigner: walletAddress,
        expectedTicketId: ticketId,
        expectedAttestationId: attestationId,
      })
    } catch (verifyError) {
      return NextResponse.json(
        { error: verifyError instanceof Error ? verifyError.message : 'Unable to validate transaction' },
        { status: 409 },
      )
    }

    const { data: existing, error: existingError } = await supabase
      .from('attestations')
      .select('id, payload')
      .eq('id', attestationId)
      .eq('ticket_id', ticketId)
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
          verification,
        },
      })
      .eq('id', attestationId)
      .eq('ticket_id', ticketId)
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
