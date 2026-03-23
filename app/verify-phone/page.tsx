'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ActionCTA } from '@/components/ui/action-cta'
import { StepIndicator } from '@/components/ui/step-indicator'
import { ActivityTimeline, type ActivityItem } from '@/components/ui/activity-timeline'
import { usePhoneVerification } from '@/lib/hooks/use-phone-verification'

type Step = 'phone' | 'otp'

const protocolActivity: ActivityItem[] = [
  { id: '1', type: 'system', title: 'Evidence Panel', timestamp: 'Now', status: 'pending' },
  { id: '2', type: 'system', title: 'Transaction History', timestamp: '...', status: 'pending' },
  { id: '3', type: 'verification', title: 'Identity Verified', timestamp: '...', status: 'pending' },
]

export default function VerifyPhonePage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('phone')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [countryCode, setCountryCode] = useState('+52')
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', ''])
  const [localError, setLocalError] = useState<string | null>(null)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const { sendOtp, verifyOtp, resendOtp, isLoading, cooldown, error } = usePhoneVerification({
    onSuccess: () => router.push('/dashboard'),
  })

  const handlePhoneSubmit = async () => {
    if (phoneNumber.length >= 10) {
      setLocalError(null)
      const result = await sendOtp(phoneNumber, countryCode)
      if (result.success) {
        setStep('otp')
      } else if (result.error) {
        setLocalError(result.error)
      }
    }
  }

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return
    const newOtp = [...otpValues]
    newOtp[index] = value
    setOtpValues(newOtp)

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleVerify = async () => {
    const code = otpValues.join('')
    const result = await verifyOtp(code)
    if (!result.success && result.error) {
      setLocalError(result.error)
    }
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Steps */}
        <div className="flex justify-center mb-8">
          <StepIndicator
            currentStep={step === 'phone' ? 1 : 2}
            steps={[
              { label: 'Connect', completed: true },
              { label: 'Verify' },
              { label: 'Role' },
            ]}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Left - Form */}
          <div className="bg-surface-container-low border border-border rounded-2xl p-6 md:p-8">
            {/* Back + Logo */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => step === 'otp' ? setStep('phone') : router.push('/login')}
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="text-xl font-bold text-primary" style={{ fontFamily: 'var(--font-climate)' }}>RANTI</span>
              </button>
              <div className="flex items-center gap-2">
                <button className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-surface-container-high">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </button>
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full" />
              </div>
            </div>

            {step === 'phone' ? (
              <>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2">
                  Step 2: Human Verification
                </p>
                <h1 className="text-4xl font-bold text-primary mb-4 leading-tight" style={{ fontFamily: 'var(--font-climate)' }}>
                  Ingresa tu<br/>numero
                </h1>
                <p className="text-sm text-muted-foreground mb-8">
                  Te enviaremos un codigo de verificacion para confirmar tu identidad.
                </p>

                <div className="mb-6">
                  <label className="text-[10px] text-muted-foreground uppercase tracking-widest block mb-2">
                    Numero de telefono
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="w-24 bg-surface-container border border-border rounded-xl px-3 py-4 text-sm text-foreground focus:border-primary focus:outline-none transition-colors"
                      style={{ fontFamily: 'var(--font-grotesk)' }}
                    >
                      <option value="+52">+52</option>
                      <option value="+1">+1</option>
                      <option value="+34">+34</option>
                      <option value="+44">+44</option>
                    </select>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                      placeholder="55 1234 5678"
                      className="flex-1 bg-surface-container border border-border rounded-xl px-4 py-4 text-lg text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none transition-colors"
                      style={{ fontFamily: 'var(--font-grotesk)' }}
                      maxLength={10}
                    />
                  </div>
                </div>

                <ActionCTA
                  onClick={handlePhoneSubmit}
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={phoneNumber.length < 10}
                  loading={isLoading}
                  icon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  }
                >
                  Enviar Codigo
                </ActionCTA>
              </>
            ) : (
              <>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2">
                  Step 2: Human Verification
                </p>
                <h1 className="text-4xl font-bold text-primary mb-4 leading-tight" style={{ fontFamily: 'var(--font-climate)' }}>
                  Verify your<br/>Identity
                </h1>
                <p className="text-sm text-muted-foreground mb-2">
                  {"We've sent a 6-digit code to your phone"} <span className="text-primary">{countryCode}</span>
                </p>
                <p className="text-sm text-primary mb-8">****{phoneNumber.slice(-4)}</p>

                {/* OTP Inputs */}
                <div className="flex gap-2 mb-6">
                  {otpValues.map((value, index) => (
                    <input
                      key={index}
                      ref={(el) => { inputRefs.current[index] = el }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={value}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-12 h-14 text-center text-2xl font-bold bg-surface-container border border-border rounded-xl text-foreground focus:border-primary focus:outline-none transition-colors"
                      style={{ fontFamily: 'var(--font-grotesk)' }}
                    />
                  ))}
                </div>

                <div className="flex gap-4 mb-6">
                  <ActionCTA
                    onClick={handleVerify}
                    variant="primary"
                    size="lg"
                    className="flex-1"
                    loading={isLoading}
                    disabled={otpValues.some(v => !v)}
                  >
                    Verify & Link Wallet
                  </ActionCTA>
                  <button
                    onClick={() => resendOtp(phoneNumber, countryCode)}
                    disabled={cooldown > 0 || isLoading}
                    className="px-4 py-3 text-muted-foreground hover:text-foreground transition-colors text-sm disabled:opacity-50"
                  >
                    {cooldown > 0 ? `Resend (${cooldown}s)` : 'Resend'}
                  </button>
                </div>

                {(localError || error) && (
                  <p className="text-xs text-red-400 mb-4">{localError || error}</p>
                )}

                <p className="text-[10px] text-muted-foreground">
                  Encrypted via Solana Protocol
                </p>
              </>
            )}
          </div>

          {/* Right - Protocol Activity */}
          <div className="bg-surface-container-low border border-border rounded-2xl p-6 hidden md:block">
            <h2 className="text-lg font-bold text-foreground mb-1" style={{ fontFamily: 'var(--font-climate)' }}>
              Protocol Activity
            </h2>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-6">
              Verified on Solana
            </p>

            <ActivityTimeline items={protocolActivity} />

            <div className="mt-8 pt-6 border-t border-border">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
                  SUS Network Status
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1 h-1 bg-primary/20 rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-primary rounded-full" />
                </div>
                <span className="text-xs text-muted-foreground">Last 1h</span>
              </div>

              <ActionCTA
                href="https://solscan.io"
                variant="outline"
                size="md"
                className="w-full mt-6"
              >
                View on Solscan
              </ActionCTA>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
