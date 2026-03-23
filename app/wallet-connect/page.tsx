'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ActionCTA } from '@/components/ui/action-cta'
import { StepIndicator } from '@/components/ui/step-indicator'

const wallets = [
  { id: 'phantom', name: 'Phantom', icon: '👻', detected: true },
  { id: 'solflare', name: 'Solflare', icon: '☀️', detected: false },
  { id: 'backpack', name: 'Backpack', icon: '🎒', detected: false },
  { id: 'ledger', name: 'Ledger', icon: '🔐', detected: false },
]

export default function WalletConnectPage() {
  const router = useRouter()
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null)
  const [connecting, setConnecting] = useState(false)

  const handleConnect = () => {
    if (!selectedWallet) return
    setConnecting(true)
    setTimeout(() => {
      router.push('/verify-phone')
    }, 1500)
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img src="/ranti-logo.svg" alt="Ranti" className="w-8 h-8" />
            <span className="text-xl font-bold text-primary tracking-widest" style={{ fontFamily: 'var(--font-climate)' }}>
              RANTI
            </span>
          </Link>
        </div>

        {/* Steps */}
        <div className="flex justify-center mb-8">
          <StepIndicator
            currentStep={0}
            steps={[
              { label: 'Connect' },
              { label: 'Verify' },
              { label: 'Role' },
            ]}
          />
        </div>

        {/* Card */}
        <div className="bg-surface-container-low border border-border rounded-2xl p-6">
          <h1 className="text-xl font-bold text-primary mb-1" style={{ fontFamily: 'var(--font-climate)' }}>
            Connect Wallet
          </h1>
          <p className="text-xs text-muted-foreground mb-6">
            Select your preferred Solana wallet to continue.
          </p>

          {/* Wallet list */}
          <div className="space-y-2 mb-6">
            {wallets.map((wallet) => (
              <button
                key={wallet.id}
                onClick={() => setSelectedWallet(wallet.id)}
                className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all ${
                  selectedWallet === wallet.id
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/30 bg-surface-container'
                }`}
              >
                <span className="text-2xl">{wallet.icon}</span>
                <span className="flex-1 text-left">
                  <span className="block text-sm font-bold text-foreground">{wallet.name}</span>
                  {wallet.detected && (
                    <span className="text-[10px] text-primary">Detected</span>
                  )}
                </span>
                {selectedWallet === wallet.id && (
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>

          <ActionCTA
            onClick={handleConnect}
            variant="primary"
            size="lg"
            className="w-full"
            disabled={!selectedWallet}
            loading={connecting}
          >
            {connecting ? 'Connecting...' : 'Connect Wallet'}
          </ActionCTA>
        </div>

        {/* Back */}
        <div className="text-center mt-6">
          <Link href="/login" className="text-xs text-muted-foreground hover:text-primary transition-colors">
            Back to Login
          </Link>
        </div>
      </div>
    </main>
  )
}
