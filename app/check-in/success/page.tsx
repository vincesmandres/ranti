'use client'

import Link from 'next/link'
import { ActionCTA } from '@/components/ui/action-cta'

export default function CheckInSuccessPage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-primary/20 border-2 border-primary rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-primary mb-2" style={{ fontFamily: 'var(--font-climate)' }}>
          CHECK-IN<br/>EXITOSO
        </h1>

        <p className="text-sm text-muted-foreground mb-8">
          Tu entrada ha sido verificada en la blockchain de Solana.
        </p>

        {/* Transaction info */}
        <div className="bg-surface-container-low border border-border rounded-2xl p-6 mb-6 text-left">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Status</p>
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-sm font-bold text-primary">Confirmed on Solana Mainnet</span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">User Signature</p>
              <p className="text-xs font-mono text-foreground truncate">0x88...EEEE...0987</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Organizer Signature</p>
              <p className="text-xs font-mono text-foreground truncate">0x44...0006...1423</p>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Asset ID (Compressed NFT)</p>
            <p className="text-xs font-mono text-primary break-all">RP-031-7729-QLA-991-155-LM5-B642</p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Transaction Hash</p>
              <p className="text-xs font-mono text-foreground truncate">D5j...24r...1a9...0gj...1T7...it...</p>
            </div>
            <ActionCTA
              href="https://solscan.io"
              variant="outline"
              size="sm"
            >
              Solscan
            </ActionCTA>
          </div>
        </div>

        <ActionCTA
          href="/dashboard"
          variant="primary"
          size="lg"
          className="w-full"
        >
          Done
        </ActionCTA>

        <div className="flex items-center justify-center gap-2 mt-6">
          <img src="/ranti-logo.svg" alt="Ranti Protocol" className="w-4 h-4 opacity-60" />
          <p className="text-[10px] text-muted-foreground">Protocol v1.0 • Solana Devnet</p>
        </div>
      </div>
    </main>
  )
}
