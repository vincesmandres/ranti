import { clusterApiUrl } from '@solana/web3.js'

export type SolanaCluster = 'devnet' | 'testnet' | 'mainnet-beta'
export type AppRuntimeEnv = 'dev' | 'staging' | 'prod'

const VALID_CLUSTERS: SolanaCluster[] = ['devnet', 'testnet', 'mainnet-beta']

function normalizeCluster(value?: string | null): SolanaCluster {
  if (!value) return 'devnet'
  const lower = value.toLowerCase()
  if ((VALID_CLUSTERS as string[]).includes(lower)) {
    return lower as SolanaCluster
  }
  return 'devnet'
}

export function getSolanaCluster(): SolanaCluster {
  return normalizeCluster(process.env.NEXT_PUBLIC_SOLANA_NETWORK)
}

export function getSolanaRpcUrl(): string {
  const envRpc = process.env.NEXT_PUBLIC_SOLANA_RPC_URL
  if (envRpc && envRpc.trim().length > 0) return envRpc
  return clusterApiUrl(getSolanaCluster())
}

export function getSolscanTxUrl(signature: string, cluster = getSolanaCluster()): string {
  const suffix = cluster === 'mainnet-beta' ? '' : `?cluster=${cluster}`
  return `https://solscan.io/tx/${signature}${suffix}`
}

export function getSolscanClusterUrl(cluster = getSolanaCluster()): string {
  if (cluster === 'mainnet-beta') return 'https://solscan.io'
  return `https://solscan.io/?cluster=${cluster}`
}

export function getAppRuntimeEnv(): AppRuntimeEnv {
  const explicit = process.env.NEXT_PUBLIC_APP_ENV || process.env.RANTI_APP_ENV
  const normalized = explicit?.toLowerCase()
  if (normalized === 'prod' || normalized === 'production') return 'prod'
  if (normalized === 'staging' || normalized === 'stage') return 'staging'
  if (normalized === 'dev' || normalized === 'development') return 'dev'
  return process.env.NODE_ENV === 'production' ? 'prod' : 'dev'
}

function parseBoolean(value: string | undefined): boolean | null {
  if (!value) return null
  const v = value.trim().toLowerCase()
  if (v === 'true') return true
  if (v === 'false') return false
  return null
}

/**
 * Explicit guard for environments:
 * - If either public/server flag is provided, that value wins.
 * - Otherwise defaults to enabled for dev/staging and disabled for prod.
 */
export function isOnChainCheckInEnabled(): boolean {
  const publicFlag = parseBoolean(process.env.NEXT_PUBLIC_RANTI_ENABLE_ONCHAIN_CHECKIN)
  const serverFlag = parseBoolean(process.env.RANTI_ENABLE_ONCHAIN_CHECKIN)

  if (publicFlag !== null) return publicFlag
  if (serverFlag !== null) return serverFlag

  const env = getAppRuntimeEnv()
  return env === 'dev' || env === 'staging'
}
