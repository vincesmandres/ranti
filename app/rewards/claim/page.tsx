'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import DashboardHeader from '@/components/dashboard-header'

export default function ClaimRewardPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isClaiming, setIsClaiming] = useState(false)
  const [claimed, setClaimed] = useState(false)

  const rewardData = {
    name: 'GENESIS CATALYST',
    collection: 'AURORA PROTOCOL',
    tokenId: '7Pxf...fnq',
    description: 'Event participation confirmed. Your unique digital asset has been minted to the Solana blockchain and is ready for acquisition.',
    network: 'mainnet-beta',
    cost: '0.000005 SOL',
    reputationScore: {
      title: 'SOLANA REPUTATION SCORE',
      subtitle: 'Check Proof of Attendance',
      icon: '+'
    }
  }

  const handleClaim = async () => {
    setIsClaiming(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsClaiming(false)
    setClaimed(true)
  }

  const handleDone = () => {
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#0E150C]">
      <DashboardHeader />

      <div className="flex items-center justify-center min-h-[calc(100vh-56px)] p-4">
        {/* Timeline dots */}
        <div className="absolute left-0 right-0 bottom-8 flex justify-center gap-24 pointer-events-none">
          <span className="text-[10px] text-muted">NOV 12, 2024</span>
          <span className="text-[10px] text-muted">DEC 05, 2024</span>
          <span className="text-[10px] text-muted">DEC 15, 2024</span>
        </div>

        {/* Main Card */}
        <div className="bg-[#161D14] border border-[#404A38]/30 rounded-2xl w-full max-w-lg overflow-hidden relative">
          {/* Close Button */}
          <button 
            onClick={() => router.back()}
            className="absolute top-4 left-4 w-8 h-8 bg-[#252C21] rounded-full flex items-center justify-center text-muted hover:text-foreground transition-colors z-10"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Share & Download */}
          <div className="absolute top-4 right-4 flex gap-2 z-10">
            <button className="w-8 h-8 bg-[#252C21] rounded-full flex items-center justify-center text-muted hover:text-foreground transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
            <button className="w-8 h-8 bg-[#252C21] rounded-full flex items-center justify-center text-muted hover:text-foreground transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>

          {/* NFT Preview */}
          <div className="p-6 pb-0">
            <div className="aspect-square max-w-[200px] mx-auto bg-gradient-to-br from-primary/20 to-secondary/10 rounded-2xl border border-primary/20 flex items-center justify-center mb-4 relative overflow-hidden">
              {/* Placeholder NFT visual */}
              <div className="w-24 h-24 bg-primary/10 rounded-xl border border-primary/30 flex items-center justify-center">
                <span className="text-4xl text-primary/50" style={{ fontFamily: 'var(--font-climate)' }}>A</span>
              </div>
              {/* Decorative grid */}
              <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: 'linear-gradient(to right, #B8FF8C 1px, transparent 1px), linear-gradient(to bottom, #B8FF8C 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }}></div>
            </div>

            {/* Collection Name */}
            <div className="text-center mb-4">
              <p className="text-lg font-bold text-primary" style={{ fontFamily: 'var(--font-climate)' }}>
                {rewardData.collection}
              </p>
              <p className="text-xs text-muted">{rewardData.tokenId}</p>
            </div>
          </div>

          {/* Claimable Badge */}
          <div className="px-6">
            <span className="inline-block text-[9px] font-bold px-3 py-1 rounded bg-primary/20 text-primary border border-primary/30 uppercase tracking-wider mb-3">
              CLAIMABLE NFT TICKET
            </span>
          </div>

          {/* Title & Description */}
          <div className="px-6 mb-6">
            <h1 
              className="text-3xl md:text-4xl font-bold text-primary mb-3"
              style={{ fontFamily: 'var(--font-climate)' }}
            >
              {rewardData.name}
            </h1>
            <p className="text-sm text-muted leading-relaxed">
              {rewardData.description}
            </p>
          </div>

          {/* Claim Button */}
          <div className="px-6 mb-6">
            {!claimed ? (
              <button
                onClick={handleClaim}
                disabled={isClaiming}
                className="w-full py-4 bg-primary text-[#143800] font-bold rounded-xl hover:bg-primary/90 transition-all text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isClaiming ? (
                  <>
                    <div className="w-5 h-5 border-2 border-[#143800]/30 border-t-[#143800] rounded-full animate-spin"></div>
                    CLAIMING...
                  </>
                ) : (
                  'CLAIM REWARD'
                )}
              </button>
            ) : (
              <button
                onClick={handleDone}
                className="w-full py-4 bg-primary text-[#143800] font-bold rounded-xl hover:bg-primary/90 transition-all text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                CLAIMED - VIEW IN DASHBOARD
              </button>
            )}
          </div>

          {/* Reputation Score */}
          <div className="px-6 mb-6">
            <div className="flex items-center gap-3 p-3 bg-[#0E150C] rounded-xl border border-[#404A38]/20">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold">
                +
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">{rewardData.reputationScore.title}</p>
                <p className="text-[10px] text-muted">{rewardData.reputationScore.subtitle}</p>
              </div>
            </div>
          </div>

          {/* Network & Cost */}
          <div className="px-6 pb-6 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-muted uppercase tracking-wide">NETWORK</p>
              <p className="text-xs font-bold text-foreground">{rewardData.network}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-muted uppercase tracking-wide">COST</p>
              <p className="text-xs font-bold text-foreground">{rewardData.cost}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
