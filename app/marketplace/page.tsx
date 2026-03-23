'use client'

import Link from 'next/link'
import { useState } from 'react'
import DashboardHeader from '@/components/dashboard-header'

const marketTickets = [
  { id: 1, name: 'Cyber Genesis', price: 2.45, venue: 'Neon District Hub', tier: 'Standard Node Entry', image: 'cyber' },
  { id: 2, name: 'Protocol Summit', price: 5.20, venue: 'Convention Center', tier: 'VIP Access', image: 'summit' },
  { id: 3, name: 'Hacker Night', price: 1.80, venue: 'Underground Lab', tier: 'General Admission', image: 'hacker' },
]

export default function Marketplace() {
  const [selectedTicket, setSelectedTicket] = useState<typeof marketTickets[0] | null>(null)
  const [showCheckout, setShowCheckout] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  return (
    <main className="min-h-screen bg-background">
      <DashboardHeader />

      <div className="p-8">
        <h2 className="text-4xl font-bold text-primary mb-8" style={{ fontFamily: 'var(--font-climate)' }}>MARKETPLACE</h2>

        {/* Tickets Grid */}
        <div className="grid grid-cols-3 gap-6">
          {marketTickets.map((ticket) => (
            <div 
              key={ticket.id}
              className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all cursor-pointer"
              onClick={() => {
                setSelectedTicket(ticket)
                setShowCheckout(true)
              }}
            >
              <div className="aspect-video bg-gradient-to-br from-primary/20 via-secondary/10 to-transparent relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 border-2 border-primary/30 rounded-xl flex items-center justify-center">
                    <span className="text-4xl text-primary/50">N</span>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold text-primary mb-1" style={{ fontFamily: 'var(--font-climate)' }}>
                  {ticket.name}
                </h3>
                <p className="text-xs text-muted uppercase tracking-wide mb-3">{ticket.tier}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-secondary" style={{ fontFamily: 'var(--font-grotesk)' }}>
                    {ticket.price} SOL
                  </span>
                  <button className="px-4 py-2 bg-primary text-primary-foreground text-sm font-bold rounded-lg hover:bg-primary/90 transition-colors">
                    Adquirir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckout && selectedTicket && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-primary" style={{ fontFamily: 'var(--font-climate)' }}>Checkout</h3>
              <button 
                onClick={() => setShowCheckout(false)}
                className="text-muted hover:text-foreground transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-6">
              <p className="text-xs text-muted uppercase tracking-wide mb-2">Protocol Checkout</p>
              <h4 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'var(--font-climate)' }}>
                {selectedTicket.name}
              </h4>
            </div>

            <div className="bg-background border border-border rounded-xl p-4 mb-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center">
                  <span className="text-2xl text-primary">N</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">{selectedTicket.name}</p>
                  <p className="text-xs text-muted">{selectedTicket.tier}</p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Ticket Price</span>
                  <span className="text-foreground font-bold">{selectedTicket.price} SOL</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Protocol Fee</span>
                  <span className="text-foreground font-bold">0.00 SOL</span>
                </div>
                <div className="border-t border-border pt-2 flex justify-between">
                  <span className="text-foreground font-bold">Total Amount</span>
                  <span className="text-primary font-bold text-lg">{selectedTicket.price} SOL</span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-xs text-muted mb-2">Owner</p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-foreground">Connected Wallet</span>
                <span className="text-xs text-muted">0x71...f9a2</span>
              </div>
            </div>

            <button 
              onClick={() => {
                setShowCheckout(false)
                setShowPaymentModal(true)
              }}
              className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-colors"
            >
              Adquirir Ticket
            </button>

            <p className="text-xs text-muted text-center mt-4">
              By confirming, you agree to the Ranti Protocol Smart Contract Terms.
            </p>
          </div>
        </div>
      )}

      {/* Payment/OTP Modal */}
      {showPaymentModal && (
        <PaymentModal onClose={() => setShowPaymentModal(false)} />
      )}
    </main>
  )
}

function PaymentModal({ onClose }: { onClose: () => void }) {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [countdown, setCountdown] = useState(44)

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newOtp = [...otp]
      newOtp[index] = value
      setOtp(newOtp)
      
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`)
        nextInput?.focus()
      }
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-card border border-border rounded-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
            <span className="text-sm font-bold text-secondary">Awaiting Signature</span>
          </div>
          <button 
            onClick={onClose}
            className="text-muted hover:text-foreground transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <h3 className="text-2xl font-bold text-foreground mb-2" style={{ fontFamily: 'var(--font-climate)' }}>
          Secure Link Wallet
        </h3>
        <p className="text-sm text-muted mb-6">
          Verification required for high-tier protocol access. Enter the 6-digit code sent to your linked mobile device.
        </p>

        {/* OTP Inputs */}
        <div className="flex gap-3 justify-center mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              className="w-12 h-14 bg-background border border-border rounded-lg text-center text-2xl font-bold text-foreground focus:border-primary focus:outline-none transition-colors"
              style={{ fontFamily: 'var(--font-grotesk)' }}
            />
          ))}
        </div>

        <p className="text-xs text-muted text-center mb-6">
          Resend Code in {countdown}s
        </p>

        <button className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
          Verify & Mint
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>

        <div className="mt-6 pt-6 border-t border-border">
          <p className="text-xs text-muted mb-2">Authenticated As</p>
          <p className="text-sm text-foreground">Operator_0x1...4f21</p>
        </div>

        <button 
          onClick={onClose}
          className="w-full mt-4 py-3 border border-border text-muted font-bold rounded-lg hover:border-primary/30 hover:text-foreground transition-colors"
        >
          Cancel Transaction
        </button>
      </div>
    </div>
  )
}
