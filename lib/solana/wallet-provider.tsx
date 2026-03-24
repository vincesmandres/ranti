'use client'

import React, { ReactNode, useMemo } from 'react'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets'

import { config } from '@/lib/config'
import '@solana/wallet-adapter-react-ui/styles.css'

const CLUSTER_TO_ADAPTER_NETWORK: Record<string, WalletAdapterNetwork> = {
  devnet: WalletAdapterNetwork.Devnet,
  testnet: WalletAdapterNetwork.Testnet,
  'mainnet-beta': WalletAdapterNetwork.Mainnet,
}

interface RantiWalletProviderProps {
  children: ReactNode
}

export function RantiWalletProvider({ children }: RantiWalletProviderProps) {
  const adapterNetwork =
    CLUSTER_TO_ADAPTER_NETWORK[config.solanaNetwork] ?? WalletAdapterNetwork.Devnet

  const endpoint = useMemo(() => config.solanaRpcUrl, [])

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter({ network: adapterNetwork }),
      new SolflareWalletAdapter({ network: adapterNetwork }),
    ],
    [adapterNetwork],
  )

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
