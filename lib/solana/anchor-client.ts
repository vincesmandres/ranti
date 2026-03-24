import bs58 from 'bs58'
import {
  PublicKey,
  SystemProgram,
  TransactionInstruction,
  type TransactionInstructionCtorFields,
} from '@solana/web3.js'
import idl from '@/lib/solana/idl/ranti_checkin.json'

const DEFAULT_PROGRAM_ID = new PublicKey(idl.address)

function getProgramId(): PublicKey {
  const envId = process.env.NEXT_PUBLIC_PROGRAM_ID
  if (!envId) return DEFAULT_PROGRAM_ID

  try {
    return new PublicKey(envId)
  } catch {
    return DEFAULT_PROGRAM_ID
  }
}

function i64ToBuffer(value: number): Buffer {
  const buffer = Buffer.alloc(8)
  buffer.writeBigInt64LE(BigInt(value))
  return buffer
}

function fixed32(value: string): Buffer {
  const input = Buffer.from(value.trim(), 'utf8')
  const out = Buffer.alloc(32)
  input.subarray(0, 32).copy(out)
  return out
}

function signatureTo64(signature: string): Buffer {
  const decoded = bs58.decode(signature)
  if (decoded.length !== 64) {
    throw new Error('Expected 64-byte Ed25519 signature for attestation commit')
  }
  return Buffer.from(decoded)
}

function ixDiscriminator(ixName: 'checkIn' | 'commitAttestation'): Buffer {
  const ix = idl.instructions.find((instruction) => instruction.name === ixName)
  if (!ix || !ix.discriminator) {
    throw new Error(`IDL discriminator missing for instruction: ${ixName}`)
  }
  return Buffer.from(ix.discriminator)
}

function buildInstruction(fields: TransactionInstructionCtorFields): TransactionInstruction {
  return new TransactionInstruction(fields)
}

export function deriveCheckinPda(user: PublicKey, ticketId: string, programId = getProgramId()) {
  const ticketRef = fixed32(ticketId)
  return PublicKey.findProgramAddressSync([Buffer.from('checkin'), user.toBuffer(), ticketRef], programId)
}

export function deriveAttestationPda(user: PublicKey, ticketId: string, programId = getProgramId()) {
  const ticketRef = fixed32(ticketId)
  return PublicKey.findProgramAddressSync([Buffer.from('attestation'), user.toBuffer(), ticketRef], programId)
}

export function buildCheckInInstruction(params: {
  user: PublicKey
  ticketId: string
  eventId: string
  checkedInAtUnix: number
  programId?: PublicKey
}) {
  const programId = params.programId || getProgramId()
  const [checkinRecord] = deriveCheckinPda(params.user, params.ticketId, programId)

  const data = Buffer.concat([
    ixDiscriminator('checkIn'),
    fixed32(params.ticketId),
    fixed32(params.eventId),
    i64ToBuffer(params.checkedInAtUnix),
  ])

  return {
    checkinRecord,
    instruction: buildInstruction({
      programId,
      keys: [
        { pubkey: params.user, isSigner: true, isWritable: true },
        { pubkey: checkinRecord, isSigner: false, isWritable: true },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      ],
      data,
    }),
  }
}

export function buildCommitAttestationInstruction(params: {
  user: PublicKey
  ticketId: string
  eventId: string
  checkinTxSignature: string
  committedAtUnix: number
  programId?: PublicKey
}) {
  const programId = params.programId || getProgramId()
  const [checkinRecord] = deriveCheckinPda(params.user, params.ticketId, programId)
  const [attestationRecord] = deriveAttestationPda(params.user, params.ticketId, programId)

  const data = Buffer.concat([
    ixDiscriminator('commitAttestation'),
    fixed32(params.ticketId),
    fixed32(params.eventId),
    signatureTo64(params.checkinTxSignature),
    i64ToBuffer(params.committedAtUnix),
  ])

  return {
    checkinRecord,
    attestationRecord,
    instruction: buildInstruction({
      programId,
      keys: [
        { pubkey: params.user, isSigner: true, isWritable: true },
        { pubkey: checkinRecord, isSigner: false, isWritable: true },
        { pubkey: attestationRecord, isSigner: false, isWritable: true },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      ],
      data,
    }),
  }
}

export function getRantiProgramId() {
  return getProgramId()
}

export function getRantiProgramIdString() {
  return getProgramId().toBase58()
}
