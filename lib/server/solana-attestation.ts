import { Connection, PublicKey } from '@solana/web3.js'
import { getSolanaCluster, getSolanaRpcUrl } from '@/lib/solana/network'

const MEMO_PROGRAM_ID = 'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'

export type CheckInTxVerificationInput = {
  txSignature: string
  expectedSigner: string
  expectedTicketId: string
  expectedAttestationId: string
}

export type CheckInTxVerificationResult = {
  slot: number
  cluster: string
  signerMatched: boolean
  memoMatched: boolean
  memo: string | null
}

function tryParseMemo(raw: unknown): string | null {
  if (typeof raw === 'string') return raw
  if (!raw || typeof raw !== 'object') return null

  const parsedValue = (raw as Record<string, unknown>).parsed
  if (typeof parsedValue === 'string') return parsedValue

  const dataValue = (raw as Record<string, unknown>).data
  if (typeof dataValue === 'string') return dataValue

  return null
}

function memoContainsExpectations(memo: string | null, expectedTicketId: string, expectedAttestationId: string) {
  if (!memo) return false
  return memo.includes(expectedTicketId) && memo.includes(expectedAttestationId)
}

export async function verifyCheckInTransaction(
  input: CheckInTxVerificationInput,
): Promise<CheckInTxVerificationResult> {
  const connection = new Connection(getSolanaRpcUrl(), 'confirmed')
  const cluster = getSolanaCluster()

  const parsedTx = await connection.getParsedTransaction(input.txSignature, {
    commitment: 'confirmed',
    maxSupportedTransactionVersion: 0,
  })

  if (!parsedTx) {
    throw new Error('Transaction not found on configured Solana cluster')
  }

  if (parsedTx.meta?.err) {
    throw new Error('Transaction failed on-chain')
  }

  const signerMatched = parsedTx.transaction.message.accountKeys.some(
    (account) => account.signer && account.pubkey.toBase58() === input.expectedSigner,
  )

  if (!signerMatched) {
    throw new Error('Transaction signer does not match authenticated wallet')
  }

  const memoInstruction = parsedTx.transaction.message.instructions.find((ix) => {
    if ('programId' in ix) {
      return ix.programId.toBase58() === MEMO_PROGRAM_ID
    }

    return ix.program === 'spl-memo'
  })

  const memo = memoInstruction ? tryParseMemo(memoInstruction) : null
  const memoMatched = memoContainsExpectations(memo, input.expectedTicketId, input.expectedAttestationId)

  if (!memoMatched) {
    throw new Error('Memo instruction does not match attestation payload')
  }

  return {
    slot: parsedTx.slot,
    cluster,
    signerMatched,
    memoMatched,
    memo,
  }
}

export function assertValidPublicKey(key: string) {
  try {
    return new PublicKey(key).toBase58()
  } catch {
    throw new Error('Invalid wallet address')
  }
}
