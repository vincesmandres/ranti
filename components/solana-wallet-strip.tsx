'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { config } from '@/lib/config'
import { cn } from '@/lib/utils'

function rpcHostLabel(url: string): string {
  try {
    return new URL(url).hostname
  } catch {
    return url.length > 40 ? `${url.slice(0, 37)}…` : url
  }
}

interface SolanaWalletStripProps {
  className?: string
  /** When disconnected, show CTA line */
  showHint?: boolean
  /** Elevated demo strip: cluster, RPC host, connection pulse */
  variant?: 'default' | 'premium'
}

export function SolanaWalletStrip({ className, showHint, variant = 'default' }: SolanaWalletStripProps) {
  const { connected, publicKey } = useWallet()
  const network = config.solanaNetwork
  const rpcHost = rpcHostLabel(config.solanaRpcUrl)
  const short = publicKey
    ? `${publicKey.toBase58().slice(0, 4)}…${publicKey.toBase58().slice(-4)}`
    : null

  if (variant === 'premium') {
    return (
      <div
        className={cn(
          'relative overflow-hidden rounded-2xl border border-primary/25 bg-gradient-to-br from-[#161D14] via-surface-container-low to-[#0E150C] px-4 py-3.5 shadow-lg shadow-black/30 md:px-5 md:py-4',
          connected && 'border-primary/40 shadow-primary/5',
          className,
        )}
      >
        <div className="pointer-events-none absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-primary via-primary/60 to-primary/20" />
        <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 pl-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-primary/35 bg-primary/10 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-primary">
              <span className="relative flex h-2 w-2">
                {connected ? (
                  <>
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-40" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                  </>
                ) : (
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-muted-foreground/50" />
                )}
              </span>
              Solana {network}
            </span>
            <span className="text-[10px] text-muted-foreground">
              RPC · <span className="font-mono text-foreground/90">{rpcHost}</span>
            </span>
          </div>
          {connected && short ? (
            <div className="flex items-center gap-2 text-left sm:text-right">
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Connected</span>
              <span className="font-mono text-xs font-semibold text-foreground">{short}</span>
            </div>
          ) : showHint ? (
            <p className="text-[11px] leading-snug text-muted-foreground sm:max-w-[280px] sm:text-right">
              Connect Phantom / Solflare — your wallet is the holder identity for this demo.
            </p>
          ) : null}
        </div>
      </div>
    )
  }

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
      <span className="hidden text-[10px] text-muted-foreground sm:inline">
        <span className="font-mono text-foreground/80">{rpcHost}</span>
      </span>
      {connected && short ? (
        <span className="font-mono text-muted-foreground">
          Wallet: <span className="text-foreground">{short}</span>
        </span>
      ) : showHint ? (
        <span className="text-muted-foreground">Connect wallet for verifiable holder identity (demo)</span>
      ) : null}
    </div>
  )
}
