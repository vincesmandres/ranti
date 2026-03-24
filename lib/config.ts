// Ranti Protocol Configuration

export const config = {
  // API
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  
  // Solana — `RantiWalletProvider` uses `solanaRpcUrl` for Connection + adapter cluster via `solanaNetwork`.
  solanaNetwork: process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet',
  solanaRpcUrl: process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com',
  programId: process.env.NEXT_PUBLIC_PROGRAM_ID || '',
  
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
    onChainCheckIn: false, // Enable when Solana integration is ready
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
