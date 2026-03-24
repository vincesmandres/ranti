import { Connection, PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js'
import type { SendTransactionOptions } from '@solana/wallet-adapter-base'
import { getSolanaCluster, getSolanaRpcUrl, isOnChainCheckInEnabled } from '@/lib/solana/network'

const MEMO_PROGRAM_ID = new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr')

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
  txSignature: string
  cluster: string
}

function memoPayload(attestationId: string, ticketId: string, wallet: string) {
  return JSON.stringify({
    protocol: 'ranti',
    action: 'check_in',
    cluster: getSolanaCluster(),
    ticketId,
    attestationId,
    wallet,
    ts: new Date().toISOString(),
  })
}

async function parseJson<T>(response: Response): Promise<T> {
  try {
    return (await response.json()) as T
  } catch {
    return {} as T
  }
}

export async function executeOnChainCheckIn(params: {
  ticketId: string
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
      referenceId: params.ticketId,
    }),
  })
  const prepare = await parseJson<PrepareResponse>(prepareResponse)

  if (!prepareResponse.ok || !prepare.success || !prepare.data?.persisted || !prepare.data.attestation?.id) {
    throw new Error(prepare.error || 'Could not persist pending attestation record.')
  }

  const attestationId = prepare.data.attestation.id
  const connection = new Connection(getSolanaRpcUrl(), 'confirmed')
  const latestBlockhash = await connection.getLatestBlockhash('confirmed')

  const memo = memoPayload(attestationId, params.ticketId, params.walletPublicKey.toBase58())
  const instruction = new TransactionInstruction({
    keys: [{ pubkey: params.walletPublicKey, isSigner: true, isWritable: false }],
    programId: MEMO_PROGRAM_ID,
    data: Buffer.from(memo, 'utf8'),
  })

  const tx = new Transaction({
    feePayer: params.walletPublicKey,
    blockhash: latestBlockhash.blockhash,
    lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
  }).add(instruction)

  const txSignature = await params.sendTransaction(tx, connection, {
    skipPreflight: false,
    preflightCommitment: 'confirmed',
    maxRetries: 3,
  })

  const confirmation = await connection.confirmTransaction(
    {
      signature: txSignature,
      blockhash: latestBlockhash.blockhash,
      lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
    },
    'confirmed',
  )

  if (confirmation.value.err) {
    throw new Error('Transaction confirmed with error on Solana Devnet.')
  }

  const commitResponse = await fetch('/api/attestations/commit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      attestationId,
      ticketId: params.ticketId,
      txSignature,
    }),
  })
  const commit = await parseJson<CommitResponse>(commitResponse)

  if (!commitResponse.ok || !commit.success) {
    throw new Error(commit.error || 'Failed to commit attestation with tx signature.')
  }

  return {
    attestationId,
    txSignature,
    cluster: getSolanaCluster(),
  }
}
