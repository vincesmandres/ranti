'use client'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import DashboardHeader from '@/components/dashboard-header'

const eventData: Record<string, {
  id: string
  name: string
  date: string
  time: string
  venue: string
  location: string
  price: number
  image: string
  badges: string[]
  perks: string[]
  description: string
  claimed: number
  total: number
  organizer: string
  smartContract: string
  royaltyFee: string
  mutable: string
}> = {
  '1': {
    id: '1',
    name: 'NEURAL DYNAMICS 2024',
    date: 'OCTOBER 24, 2024',
    time: '21:00 — 04:00 UTC',
    venue: 'NEON DISTRICT HUB',
    location: 'BERLIN, GERMANY',
    price: 1.25,
    image: '/placeholder.svg?height=400&width=300',
    badges: ['UNRESTRICTED', 'REALMAINNET'],
    perks: [
      'OG GENESIS BADGE',
      'EARLY ACCESS (1HR PRIOR)',
      'DRINK AIRDROP INCLUDED',
      'SOULBOUND PROOF-OF-ATTENDANCE'
    ],
    description: 'Experience the convergence of decentralized identity and high-fidelity sonic landscapes. Neural Dynamics is more than a concert; it\'s a validation of the luminous protocol.',
    claimed: 500,
    total: 5000,
    organizer: 'SOLANA_LABS.X',
    smartContract: 'RANTI_V2...0x01',
    royaltyFee: '5%',
    mutable: 'IMMUTABLE'
  },
  '2': {
    id: '2',
    name: 'SOLANA SUMMER FEST',
    date: 'JUNE 28, 2024',
    time: '12:00 — 23:00 UTC',
    venue: 'OCEANVIEW ARENA',
    location: 'MIAMI, USA',
    price: 4.5,
    image: '/placeholder.svg?height=400&width=300',
    badges: ['COMMUNITY', 'MAINNET'],
    perks: [
      'VIP LOUNGE ACCESS',
      'EXCLUSIVE MERCH DROP',
      'MEET & GREET PASS',
      'COMMEMORATIVE NFT'
    ],
    description: 'Join 500 verified participants in an immersive environment designed to bridge the physical and digital divide.',
    claimed: 1200,
    total: 3000,
    organizer: 'SOLANA_FOUNDATION',
    smartContract: 'RANTI_V2...0x02',
    royaltyFee: '3%',
    mutable: 'IMMUTABLE'
  },
  '3': {
    id: '3',
    name: 'DARK MODE SUMMIT',
    date: 'JULY 15, 2024',
    time: '18:00 — 02:00 UTC',
    venue: 'TECH CONVENTION CENTER',
    location: 'SINGAPORE',
    price: 12.0,
    image: '/placeholder.svg?height=400&width=300',
    badges: ['EXCLUSIVE', 'MAINNET'],
    perks: [
      'DEVELOPER WORKSHOP',
      'NETWORKING SESSION',
      'HACKATHON ENTRY',
      'SWAG BAG'
    ],
    description: 'The premier blockchain developer conference with cutting-edge talks and hands-on workshops.',
    claimed: 800,
    total: 1500,
    organizer: 'DARKMODE_DAO',
    smartContract: 'RANTI_V2...0x03',
    royaltyFee: '2%',
    mutable: 'IMMUTABLE'
  },
  '4': {
    id: '4',
    name: 'RANTI LAUNCH PARTY',
    date: 'AUGUST 01, 2024',
    time: '20:00 — 04:00 UTC',
    venue: 'SKYLINE ROOFTOP',
    location: 'NEW YORK, USA',
    price: 0.05,
    image: '/placeholder.svg?height=400&width=300',
    badges: ['FREE', 'GENESIS'],
    perks: [
      'GENESIS BADGE',
      'EARLY ADOPTER STATUS',
      'FREE DRINKS',
      'PROTOCOL ACCESS'
    ],
    description: 'Be part of history at the official Ranti Protocol launch celebration.',
    claimed: 4500,
    total: 5000,
    organizer: 'RANTI_PROTOCOL',
    smartContract: 'RANTI_V2...0x04',
    royaltyFee: '0%',
    mutable: 'IMMUTABLE'
  }
}

export default function EventDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [showAcquireModal, setShowAcquireModal] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const event = eventData[params.id as string] || eventData['1']

  const handleAcquire = () => {
    setShowAcquireModal(true)
  }

  const handleConfirmAcquire = async () => {
    setIsProcessing(true)
    // Simulate transaction
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsProcessing(false)
    setShowAcquireModal(false)
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#0E150C]">
      <DashboardHeader />

      <div className="p-6 md:p-8">
        {/* Back Link */}
        <Link 
          href="/marketplace" 
          className="inline-flex items-center gap-2 text-xs text-muted hover:text-primary transition-colors mb-6 group"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          RETURN TO MARKETPLACE
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left - Event Image & Info */}
          <div>
            {/* Badges */}
            <div className="flex gap-2 mb-4">
              {event.badges.map((badge, i) => (
                <span 
                  key={i}
                  className={`text-[9px] font-bold px-2.5 py-1 rounded uppercase tracking-wider ${
                    badge === 'UNRESTRICTED' || badge === 'FREE' 
                      ? 'bg-primary/20 text-primary border border-primary/30'
                      : 'bg-[#252C21] text-muted border border-[#404A38]/30'
                  }`}
                >
                  {badge}
                </span>
              ))}
            </div>

            {/* Event Image */}
            <div className="aspect-[3/4] bg-gradient-to-br from-[#1A2217] to-[#252C21] rounded-2xl mb-6 relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 border-2 border-primary/20 rounded-2xl flex items-center justify-center">
                  <span className="text-6xl text-primary/30" style={{ fontFamily: 'var(--font-climate)' }}>
                    {event.name.charAt(0)}
                  </span>
                </div>
              </div>
            </div>

            {/* Title */}
            <h1 
              className="text-3xl md:text-4xl font-bold text-primary leading-tight mb-4"
              style={{ fontFamily: 'var(--font-climate)' }}
            >
              {event.name}
            </h1>

            {/* Description */}
            <p className="text-sm text-muted leading-relaxed mb-4">
              {event.description}
            </p>

            {/* Claimed */}
            <p className="text-xs text-muted mb-6">
              <span className="text-primary">{event.claimed.toLocaleString()}</span> / {event.total.toLocaleString()} CLAIMED
            </p>

            {/* Organizer */}
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-xs font-bold text-primary">{event.organizer}</span>
            </div>
          </div>

          {/* Right - Details Card */}
          <div className="bg-[#161D14] border border-[#404A38]/20 rounded-2xl p-6">
            {/* Date & Time */}
            <div className="flex items-start gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-primary" style={{ fontFamily: 'var(--font-grotesk)' }}>{event.date}</p>
                <p className="text-xs text-muted">{event.time}</p>
              </div>
            </div>

            {/* Venue */}
            <div className="flex items-start gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] text-muted uppercase tracking-wide">VENUE COORDINATES</p>
                <p className="text-sm font-bold text-foreground">{event.venue} / {event.location}</p>
              </div>
            </div>

            {/* Protocol Perks */}
            <div className="mb-6">
              <p className="text-[10px] text-muted uppercase tracking-widest mb-3">PROTOCOL PERKS</p>
              <div className="space-y-2">
                {event.perks.map((perk, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-xs text-foreground">{perk}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center justify-between mb-6 p-4 bg-[#0E150C] rounded-xl border border-[#404A38]/20">
              <div>
                <p className="text-[10px] text-muted uppercase tracking-wide">PRICE</p>
                <p className="text-3xl font-bold text-primary" style={{ fontFamily: 'var(--font-grotesk)' }}>
                  {event.price} <span className="text-lg">SOL</span>
                </p>
              </div>
              <span className="text-[10px] text-muted border border-[#404A38]/30 px-2 py-1 rounded">
                LIVE STAKE
              </span>
            </div>

            {/* Acquire Button */}
            <button
              onClick={handleAcquire}
              className="w-full py-4 bg-primary text-[#143800] font-bold rounded-xl hover:bg-primary/90 transition-all text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98]"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              ACQUIRE TICKET
            </button>

            {/* Contract Info */}
            <div className="mt-6 pt-6 border-t border-[#404A38]/20 space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-muted">SMART CONTRACT</span>
                <span className="text-foreground font-mono">{event.smartContract}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted">ROYALTY FEE</span>
                <span className="text-foreground">{event.royaltyFee}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted">METADATA</span>
                <span className="text-foreground">{event.mutable}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Acquire Modal */}
      {showAcquireModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#161D14] border border-[#404A38]/30 rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-foreground" style={{ fontFamily: 'var(--font-climate)' }}>
                Confirm Acquisition
              </h3>
              <button 
                onClick={() => setShowAcquireModal(false)}
                className="text-muted hover:text-foreground transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="bg-[#0E150C] rounded-xl p-4 mb-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                  <span className="text-2xl text-primary" style={{ fontFamily: 'var(--font-climate)' }}>
                    {event.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">{event.name}</p>
                  <p className="text-xs text-muted">{event.venue}</p>
                </div>
              </div>

              <div className="space-y-2 text-sm border-t border-[#404A38]/20 pt-4">
                <div className="flex justify-between">
                  <span className="text-muted">Ticket Price</span>
                  <span className="text-foreground font-bold">{event.price} SOL</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Protocol Fee</span>
                  <span className="text-foreground font-bold">0.00 SOL</span>
                </div>
                <div className="border-t border-[#404A38]/20 pt-2 flex justify-between">
                  <span className="text-foreground font-bold">Total</span>
                  <span className="text-primary font-bold text-lg">{event.price} SOL</span>
                </div>
              </div>
            </div>

            <button 
              onClick={handleConfirmAcquire}
              disabled={isProcessing}
              className="w-full py-4 bg-primary text-[#143800] font-bold rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-[#143800]/30 border-t-[#143800] rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Confirm & Sign
                </>
              )}
            </button>

            <p className="text-[10px] text-muted text-center mt-4">
              By confirming, you agree to the Ranti Protocol Smart Contract Terms.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
