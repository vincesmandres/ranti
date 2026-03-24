import { Connection, PublicKey, Transaction } from '@solana/web3.js'
import type { SendTransactionOptions } from '@solana/wallet-adapter-base'
import { getSolanaCluster, getSolanaRpcUrl, isOnChainCheckInEnabled } from '@/lib/solana/network'
import {
  buildCheckInInstruction,
  buildCommitAttestationInstruction,
  deriveAttestationPda,
  deriveCheckinPda,
  getRantiProgramId,
} from '@/lib/solana/anchor-client'

type PrepareResponse = {
  success: boolean
  data?: {
    pending: boolean
    persisted: boolean
    attestation?: {
      id: string
    }
  }
  error?: string
}

type CommitResponse = {
  success: boolean
  data?: {
    id: string
    tx_signature: string
  }
  error?: string
}

export type OnChainCheckInResult = {
  attestationId: string
  checkInTxSignature: string
  commitTxSignature: string
  checkinPda: string
  attestationPda: string
  cluster: string
}

async function parseJson<T>(response: Response): Promise<T> {
  try {
    return (await response.json()) as T
  } catch {
    return {} as T
  }
}

async function confirmSignature(connection: Connection, signature: string) {
  const latest = await connection.getLatestBlockhash('confirmed')
  const confirmation = await connection.confirmTransaction(
    {
      signature,
      blockhash: latest.blockhash,
      lastValidBlockHeight: latest.lastValidBlockHeight,
    },
    'confirmed',
  )

  if (confirmation.value.err) {
    throw new Error(`Transaction failed on devnet: ${JSON.stringify(confirmation.value.err)}`)
  }
}

export async function executeOnChainCheckIn(params: {
  ticketId: string
  eventId: string
  walletPublicKey: PublicKey
  sendTransaction: (
    transaction: Transaction,
    connection: Connection,
    options?: SendTransactionOptions,
  ) => Promise<string>
}): Promise<OnChainCheckInResult> {
  if (!isOnChainCheckInEnabled()) {
    throw new Error('On-chain check-in is disabled for this environment.')
  }

  const prepareResponse = await fetch('/api/attestations/prepare', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ticketId: params.ticketId,
      participationEvent: 'check_in',
      referenceId: params.eventId,
    }),
  })
  const prepare = await parseJson<PrepareResponse>(prepareResponse)

  if (!prepareResponse.ok || !prepare.success || !prepare.data?.persisted || !prepare.data.attestation?.id) {
    throw new Error(prepare.error || 'Could not persist pending attestation record.')
  }

  const attestationId = prepare.data.attestation.id
  const connection = new Connection(getSolanaRpcUrl(), 'confirmed')
  const programId = getRantiProgramId()

  const checkedInAtUnix = Math.floor(Date.now() / 1000)
  const checkInIx = buildCheckInInstruction({
    user: params.walletPublicKey,
    ticketId: params.ticketId,
    eventId: params.eventId,
    checkedInAtUnix,
    programId,
  })

  const checkInTx = new Transaction().add(checkInIx.instruction)
  checkInTx.feePayer = params.walletPublicKey

  const checkInTxSignature = await params.sendTransaction(checkInTx, connection, {
    skipPreflight: false,
    preflightCommitment: 'confirmed',
    maxRetries: 3,
  })
  await confirmSignature(connection, checkInTxSignature)

  const committedAtUnix = Math.floor(Date.now() / 1000)
  const commitIx = buildCommitAttestationInstruction({
    user: params.walletPublicKey,
    ticketId: params.ticketId,
    eventId: params.eventId,
    checkinTxSignature: checkInTxSignature,
    committedAtUnix,
    programId,
  })

  const commitTx = new Transaction().add(commitIx.instruction)
  commitTx.feePayer = params.walletPublicKey

  const commitTxSignature = await params.sendTransaction(commitTx, connection, {
    skipPreflight: false,
    preflightCommitment: 'confirmed',
    maxRetries: 3,
  })
  await confirmSignature(connection, commitTxSignature)

  const commitResponse = await fetch('/api/attestations/commit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      attestationId,
      ticketId: params.ticketId,
      txSignature: commitTxSignature,
      checkInTxSignature,
      attestationPda: commitIx.attestationRecord.toBase58(),
      checkinPda: commitIx.checkinRecord.toBase58(),
    }),
  })
  const commit = await parseJson<CommitResponse>(commitResponse)

  if (!commitResponse.ok || !commit.success) {
    throw new Error(commit.error || 'Failed to commit attestation with tx signature.')
  }

  const [checkinPda] = deriveCheckinPda(params.walletPublicKey, params.ticketId, programId)
  const [attestationPda] = deriveAttestationPda(params.walletPublicKey, params.ticketId, programId)

  return {
    attestationId,
    checkInTxSignature,
    commitTxSignature,
    checkinPda: checkinPda.toBase58(),
    attestationPda: attestationPda.toBase58(),
    cluster: getSolanaCluster(),
  }
}
