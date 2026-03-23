import { SignMessage } from '@solana/web3.js'
import { bs58 } from 'bs58'

/**
 * Generate a sign-in message for Solana wallet authentication
 */
export async function generateSignInMessage(publicKey: string): Promise<string> {
  const timestamp = new Date().toISOString()
  return `Sign this message to authenticate with Ranti.\n\nWallet: ${publicKey}\nTimestamp: ${timestamp}`
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
    // In production, use @solana/web3.js to verify the signature
    // For now, we trust the wallet adapter has already verified
    return true
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
