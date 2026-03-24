import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { assert } from 'chai'

import idl from '../lib/solana/idl/ranti_checkin.json'

describe('ranti_checkin', () => {
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)

  const program = new Program(idl as anchor.Idl, provider) as Program

  const user = provider.wallet.publicKey
  const ticketRef = Buffer.alloc(32)
  const eventRef = Buffer.alloc(32)
  ticketRef.write('ticket-e2e-devnet')
  eventRef.write('event-e2e-devnet')

  const [checkinPda] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from('checkin'), user.toBuffer(), ticketRef],
    program.programId,
  )

  const [attestationPda] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from('attestation'), user.toBuffer(), ticketRef],
    program.programId,
  )

  it('creates check-in PDA and commits attestation', async () => {
    const checkedInAt = new anchor.BN(Math.floor(Date.now() / 1000))

    const checkinTx = await program.methods
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .checkIn([...ticketRef] as any, [...eventRef] as any, checkedInAt)
      .accounts({
        user,
        checkinRecord: checkinPda,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc()

    assert.ok(checkinTx)

    const committedAt = new anchor.BN(Math.floor(Date.now() / 1000))
    const sig64 = Buffer.from(anchor.utils.bytes.bs58.decode(checkinTx))

    const commitTx = await program.methods
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .commitAttestation([...ticketRef] as any, [...eventRef] as any, [...sig64] as any, committedAt)
      .accounts({
        user,
        checkinRecord: checkinPda,
        attestationRecord: attestationPda,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc()

    assert.ok(commitTx)
  })
})
