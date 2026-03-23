import { NextRequest, NextResponse } from 'next/server'
import { requireUser } from '@/lib/server/auth'

function featureEnabled() {
  return process.env.RANTI_ENABLE_SOLANA_COMMIT === 'true'
}

export async function POST(request: NextRequest) {
  try {
    const { supabase, user, response } = await requireUser()
    if (response || !user) return response

    if (!featureEnabled()) {
      return NextResponse.json(
        { error: 'Solana commit is disabled in this environment' },
        { status: 412 },
      )
    }

    const { attestationId, txSignature } = await request.json()
    if (!attestationId || !txSignature) {
      return NextResponse.json(
        { error: 'attestationId and txSignature are required' },
        { status: 400 },
      )
    }

    const { data: updated, error } = await supabase
      .from('attestations')
      .update({
        status: 'committed_devnet',
        tx_signature: txSignature,
        committed_at: new Date().toISOString(),
      })
      .eq('id', attestationId)
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

