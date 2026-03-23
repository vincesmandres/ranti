import crypto from 'crypto'
import bs58 from 'bs58'

const MESSAGE_PREFIX = 'Sign this message to authenticate with Ranti.'
const CHALLENGE_TTL_MS = 5 * 60 * 1000

function getEd25519DerKey(publicKeyBytes: Uint8Array) {
  // ASN.1 DER prefix for an Ed25519 public key.
  const derPrefix = Buffer.from('302a300506032b6570032100', 'hex')
  return Buffer.concat([derPrefix, Buffer.from(publicKeyBytes)])
}

/**
 * Generate a sign-in message for Solana wallet authentication
 */
export async function generateSignInMessage(publicKey: string): Promise<string> {
  const timestamp = new Date().toISOString()
  const nonce = crypto.randomUUID()
  return `${MESSAGE_PREFIX}\n\nWallet: ${publicKey}\nTimestamp: ${timestamp}\nNonce: ${nonce}`
}

export function parseSignInMessage(message: string) {
  const walletMatch = message.match(/^Wallet:\s(.+)$/m)
  const timestampMatch = message.match(/^Timestamp:\s(.+)$/m)
  const nonceMatch = message.match(/^Nonce:\s(.+)$/m)

  const wallet = walletMatch?.[1]?.trim()
  const timestamp = timestampMatch?.[1]?.trim()
  const nonce = nonceMatch?.[1]?.trim()
  const createdAtMs = timestamp ? Date.parse(timestamp) : NaN

  return {
    wallet,
    timestamp,
    nonce,
    createdAtMs,
    isFresh: Number.isFinite(createdAtMs) && Date.now() - createdAtMs <= CHALLENGE_TTL_MS,
    hasPrefix: message.startsWith(MESSAGE_PREFIX),
  }
}

/**
 * Verify the wallet signature
 */
export async function verifyWalletSignature(
  publicKey: string,
  signature: string,
  message: string
): Promise<boolean> {
  try {
    const pubKeyBytes = bs58.decode(publicKey)
    const signatureBytes = bs58.decode(signature)
    const messageBytes = Buffer.from(message, 'utf8')
    const keyDer = getEd25519DerKey(pubKeyBytes)

    return crypto.verify(
      null,
      messageBytes,
      {
        key: keyDer,
        format: 'der',
        type: 'spki',
      },
      signatureBytes,
    )
  } catch (error) {
    console.error('Signature verification failed:', error)
    return false
  }
}

/**
 * Extract user data from wallet connection
 */
export async function getUserDataFromWallet(publicKey: string) {
  return {
    wallet_address: publicKey,
    username: publicKey.slice(0, 8),
    avatar_url: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${publicKey}`,
  }
}
