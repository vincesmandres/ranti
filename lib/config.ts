import { getSolanaCluster, getSolanaRpcUrl, isOnChainCheckInEnabled } from '@/lib/solana/network'
import { getRantiProgramIdString } from '@/lib/solana/anchor-client'

// Ranti Protocol Configuration

export const config = {
  // API
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',

  // Solana
  solanaNetwork: getSolanaCluster(),
  solanaRpcUrl: getSolanaRpcUrl(),
  programId: process.env.NEXT_PUBLIC_PROGRAM_ID || getRantiProgramIdString(),

  // Supabase
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',

  // App
  appName: 'Ranti Protocol',
  appDescription: 'Liquid tickets and verified reputation for high-end Solana events',

  // Feature Flags
  features: {
    walletAuth: true,
    phoneVerification: true,
    onChainCheckIn: isOnChainCheckInEnabled(),
    rewards: true,
    marketplace: true,
  },

  // Limits
  limits: {
    maxTicketsPerUser: 10,
    otpExpirySeconds: 300,
    otpMaxAttempts: 3,
  },
} as const

export type Config = typeof config
