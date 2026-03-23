'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

export default function OTPVerificationPage() {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleChange = (index: number, value: string) => {
    // Solo permitir números
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value

    // Si el usuario pega 6 dígitos
    if (value.length > 1) {
      const digits = value.replace(/\D/g, '').split('').slice(0, 6)
      digits.forEach((digit, i) => {
        if (i < 6) newOtp[i] = digit
      })
      setOtp(newOtp)
      // Focus en el último
      inputRefs.current[5]?.focus()
      return
    }

    setOtp(newOtp)

    // Auto focus al siguiente
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  return (
    <div className="min-h-screen" style={{ background: 'radial-gradient(64.03% 80.04% at 50% 50%, rgba(139, 230, 85, 0.05) 0%, #0E150C 70%), #0E150C' }}>
      {/* Container */}
      <div className="flex min-h-screen">
        {/* Main Content */}
        <div className="flex-1 flex flex-col justify-center px-28 py-20">
          {/* Overlay blur */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 w-96 h-96 bg-gradient-to-r from-primary/10 to-transparent blur-3xl rounded-full pointer-events-none"></div>

          <div className="relative z-10 max-w-2xl">
            {/* Header */}
            <div className="flex items-center gap-3 mb-12">
              <div className="w-12 h-0.5 bg-primary"></div>
              <h3 className="text-xs font-bold tracking-widest text-accent uppercase">RANTI</h3>
            </div>

            {/* Title */}
            <h1 className="text-7xl font-bold text-primary mb-6 leading-tight" style={{ fontFamily: 'Climate Crisis' }}>
              Verify your Identity
            </h1>

            {/* Description */}
            <p className="text-xl text-muted mb-12 leading-relaxed max-w-xl">
              Hemos enviado un código de 6 dígitos a tu número de teléfono. Ingresa el código para verificar tu identidad y acceder al protocolo.
            </p>

            {/* OTP Inputs */}
            <div className="relative mb-12">
              <div className="flex gap-4 justify-start">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-20 h-24 bg-input border border-border rounded-2xl text-center text-4xl font-bold text-primary placeholder-muted/20 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
                    style={{ fontFamily: 'Space Grotesk' }}
                    placeholder="•"
                  />
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-6 mb-8">
              {/* Verify Button */}
              <div className="relative flex-1">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-20 blur-sm rounded-2xl"></div>
                <button className="relative w-full px-8 py-5 bg-primary text-primary-foreground font-bold rounded-2xl hover:bg-primary/90 transition-colors text-lg" style={{ fontFamily: 'Space Grotesk' }}>
                  Verify & Continue
                </button>
              </div>

              {/* Resend Code */}
              <button className="px-6 py-5 text-muted hover:text-foreground transition-colors font-semibold flex items-center gap-2 text-sm">
                <span className="text-lg">↻</span>
                Resend
              </button>
            </div>

            {/* Footer Links */}
            <div className="flex items-center justify-between text-xs text-muted/60 border-t border-border pt-6 opacity-40">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-secondary rounded-full"></span>
                <span className="uppercase font-bold tracking-widest">Verified on Solana</span>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-1">
                  <span style={{ fontFamily: 'Climate Crisis' }} className="text-primary font-bold">RANTI</span>
                  <span className="w-px h-4 bg-border/50"></span>
                  <span style={{ fontFamily: 'Climate Crisis' }} className="text-secondary font-bold">PROTOCOL</span>
                  <span className="w-px h-4 bg-border/50"></span>
                  <span style={{ fontFamily: 'Climate Crisis' }} className="text-primary font-bold">v1.0</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Aside - Protocol Activity */}
        <div className="w-96 bg-card border-l border-border flex flex-col justify-center px-10 py-20">
          <div className="relative z-10">
            {/* Title */}
            <h3 className="text-3xl font-bold text-primary mb-1" style={{ fontFamily: 'Climate Crisis' }}>
              Protocol Activity
            </h3>
            <p className="text-xs font-bold tracking-widest text-accent uppercase mb-8">
              Verified on Solana
            </p>

            {/* Activity Items */}
            <div className="space-y-6">
              {/* Activity Item 1 */}
              <div className="pb-6 border-b border-border">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xs font-bold text-primary-foreground">✓</div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-foreground">Connection Verified</p>
                    <p className="text-xs text-muted/60 mt-1">Wallet linked successfully</p>
                  </div>
                </div>
                <div className="text-xs text-muted/40 ml-11">2 min ago</div>
              </div>

              {/* Activity Item 2 */}
              <div className="pb-6 border-b border-border">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center text-xs font-bold text-primary-foreground">📅</div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-foreground">Event Registered</p>
                    <p className="text-xs text-muted/60 mt-1">Summer Festival 2024</p>
                  </div>
                </div>
                <div className="text-xs text-muted/40 ml-11">1 hour ago</div>
              </div>

              {/* Activity Item 3 */}
              <div className="pb-6">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary via-secondary to-primary flex items-center justify-center text-xs font-bold text-primary-foreground">🎟️</div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-foreground">Ticket Minted</p>
                    <p className="text-xs text-muted/60 mt-1">NFT liquid ticket issued</p>
                  </div>
                </div>
                <div className="text-xs text-muted/40 ml-11">3 hours ago</div>
              </div>
            </div>

            {/* View All Link */}
            <Link href="#" className="mt-8 pt-6 border-t border-border flex items-center justify-center gap-2 text-accent hover:text-primary transition-colors font-bold text-sm uppercase tracking-wide">
              View All Activity
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
