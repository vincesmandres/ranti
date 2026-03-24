'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { config } from '@/lib/config'
import { cn } from '@/lib/utils'

interface SolanaWalletStripProps {
  className?: string
  /** When disconnected, show CTA line */
  showHint?: boolean
}

export function SolanaWalletStrip({ className, showHint }: SolanaWalletStripProps) {
  const { connected, publicKey } = useWallet()
  const network = config.solanaNetwork
  const short = publicKey
    ? `${publicKey.toBase58().slice(0, 4)}…${publicKey.toBase58().slice(-4)}`
    : null

  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-center gap-2 rounded-xl border border-border/80 bg-surface-container-low px-4 py-2 text-[11px]',
        className,
      )}
    >
      <span className="rounded-md border border-primary/30 bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-primary">
        Solana · {network}
      </span>
      {connected && short ? (
        <span className="font-mono text-muted-foreground">
          Wallet: <span className="text-foreground">{short}</span>
        </span>
      ) : showHint ? (
        <span className="text-muted-foreground">Conecta wallet para identidad verificable en demo</span>
      ) : null}
    </div>
  )
}
