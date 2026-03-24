'use client'

import { AuthLayout } from '@/components/layouts/auth-layout'
import { useWallet } from '@solana/wallet-adapter-react'

export default function SettingsPage() {
  const { publicKey } = useWallet()
  
  const shortAddress = publicKey
    ? `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}`
    : null

  return (
    <AuthLayout>
        <div className="p-4 md:p-6 lg:p-8 max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary" style={{ fontFamily: 'var(--font-climate)' }}>
              Settings
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Manage your account and preferences
            </p>
          </div>

          {/* Wallet Section */}
          <div className="bg-surface-container-low border border-border rounded-2xl p-6 mb-6">
            <h2 className="text-sm font-bold text-foreground mb-4">Connected Wallet</h2>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/20 border border-primary/30 rounded-xl flex items-center justify-center">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-1">Solana Wallet</p>
                <p className="text-sm font-mono text-primary">{shortAddress || 'Not connected'}</p>
              </div>
            </div>
          </div>

          {/* Preferences Section */}
          <div className="bg-surface-container-low border border-border rounded-2xl p-6 mb-6">
            <h2 className="text-sm font-bold text-foreground mb-4">Preferences</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground">Notifications</p>
                  <p className="text-xs text-muted-foreground">Receive event updates and alerts</p>
                </div>
                <button className="w-12 h-6 bg-primary rounded-full relative">
                  <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-all"></span>
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground">Email Updates</p>
                  <p className="text-xs text-muted-foreground">Weekly digest of your activity</p>
                </div>
                <button className="w-12 h-6 bg-muted rounded-full relative">
                  <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all"></span>
                </button>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-destructive/5 border border-destructive/20 rounded-2xl p-6">
            <h2 className="text-sm font-bold text-destructive mb-4">Danger Zone</h2>
            <p className="text-xs text-muted-foreground mb-4">
              Disconnecting your wallet will log you out of the application.
            </p>
            <button className="px-4 py-2 text-xs font-bold text-destructive border border-destructive/30 rounded-lg hover:bg-destructive/10 transition-colors">
              Disconnect Wallet
            </button>
          </div>
        </div>
    </AuthLayout>
  )
}
