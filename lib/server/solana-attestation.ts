import bs58 from 'bs58'
import { Connection, PublicKey } from '@solana/web3.js'
import { getSolanaCluster, getSolanaRpcUrl } from '@/lib/solana/network'
import { getRantiProgramId } from '@/lib/solana/anchor-client'

const CHECK_IN_DISCRIMINATOR = Buffer.from([209, 253, 4, 217, 250, 241, 207, 50])
const COMMIT_ATTESTATION_DISCRIMINATOR = Buffer.from([189, 31, 48, 199, 210, 173, 251, 43])

export type VerifyProgramTxInput = {
  txSignature: string
  expectedSigner: string
  expectedTicketId: string
  expectedEventId: string
  instructionType: 'check_in' | 'commit_attestation'
  expectedCheckInTxSignature?: string
}

export type ProgramTxVerificationResult = {
  slot: number
  cluster: string
  programId: string
  signerMatched: boolean
  instructionMatched: boolean
}

function fixed32(value: string): Buffer {
  const input = Buffer.from(value.trim(), 'utf8')
  const out = Buffer.alloc(32)
  input.subarray(0, 32).copy(out)
  return out
}

function fixed64Signature(signature: string): Buffer {
  const decoded = bs58.decode(signature)
  if (decoded.length !== 64) {
    throw new Error('Invalid check-in tx signature bytes')
  }
  return Buffer.from(decoded)
}

function expectedPrefix(input: VerifyProgramTxInput): Buffer {
  const ticketRef = fixed32(input.expectedTicketId)
  const eventRef = fixed32(input.expectedEventId)

  if (input.instructionType === 'check_in') {
    return Buffer.concat([CHECK_IN_DISCRIMINATOR, ticketRef, eventRef])
  }

  if (!input.expectedCheckInTxSignature) {
    throw new Error('commit_attestation verification requires check-in tx signature')
  }

  return Buffer.concat([
    COMMIT_ATTESTATION_DISCRIMINATOR,
    ticketRef,
    eventRef,
    fixed64Signature(input.expectedCheckInTxSignature),
  ])
}

export async function verifyProgramTransaction(
  input: VerifyProgramTxInput,
): Promise<ProgramTxVerificationResult> {
  const connection = new Connection(getSolanaRpcUrl(), 'confirmed')
  const cluster = getSolanaCluster()
  const programId = getRantiProgramId().toBase58()

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

  const prefix = expectedPrefix(input)

  const ixMatched = parsedTx.transaction.message.instructions.some((instruction) => {
    if (!('programId' in instruction)) return false
    if (instruction.programId.toBase58() !== programId) return false
    const rawData = (instruction as { data?: string }).data
    if (!rawData) return false
    const decodedData = bs58.decode(rawData)
    return Buffer.from(decodedData).subarray(0, prefix.length).equals(prefix)
  })

  if (!ixMatched) {
    throw new Error('Anchor instruction data does not match expected payload')
  }

  return {
    slot: parsedTx.slot,
    cluster,
    programId,
    signerMatched,
    instructionMatched: ixMatched,
  }
}

export function assertValidPublicKey(key: string) {
  try {
    return new PublicKey(key).toBase58()
  } catch {
    throw new Error('Invalid wallet address')
  }
}

export async function assertAccountOwnedByProgram(address: string) {
  const connection = new Connection(getSolanaRpcUrl(), 'confirmed')
  const programId = getRantiProgramId()
  const accountInfo = await connection.getAccountInfo(new PublicKey(address), 'confirmed')

  if (!accountInfo) throw new Error(`Expected program account ${address} was not found`)
  if (!accountInfo.owner.equals(programId)) {
    throw new Error(`Account ${address} is not owned by configured program`)
  }

  return {
    lamports: accountInfo.lamports,
    owner: accountInfo.owner.toBase58(),
    executable: accountInfo.executable,
    dataLength: accountInfo.data.length,
  }
}
