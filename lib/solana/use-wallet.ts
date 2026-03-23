'use client'

import { useContext } from 'react'
import { useWallet as useWalletAdapter } from '@solana/wallet-adapter-react'

/**
 * Hook to use Solana wallet connection in components
 * Returns wallet state and connection methods
 */
export function useWallet() {
  const { publicKey, wallet, connecting, connected, signMessage, connect, disconnect } = useWalletAdapter()

  return {
    publicKey: publicKey?.toString(),
    wallet: wallet?.adapter.name,
    connecting,
    connected,
    signMessage,
    connect,
    disconnect,
  }
}
