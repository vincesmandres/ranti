'use client'

// Landing page with wallet connection and role selection
import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'

type ModalType = 'none' | 'login' | 'phone' | 'otp' | 'role'

const LATAM_COUNTRIES = [
  { code: '+52', country: 'MX', name: 'Mexico', flag: '🇲🇽' },
  { code: '+55', country: 'BR', name: 'Brasil', flag: '🇧🇷' },
  { code: '+54', country: 'AR', name: 'Argentina', flag: '🇦🇷' },
  { code: '+57', country: 'CO', name: 'Colombia', flag: '🇨🇴' },
  { code: '+56', country: 'CL', name: 'Chile', flag: '🇨🇱' },
  { code: '+51', country: 'PE', name: 'Peru', flag: '🇵🇪' },
  { code: '+58', country: 'VE', name: 'Venezuela', flag: '🇻🇪' },
  { code: '+593', country: 'EC', name: 'Ecuador', flag: '🇪🇨' },
  { code: '+591', country: 'BO', name: 'Bolivia', flag: '🇧🇴' },
  { code: '+595', country: 'PY', name: 'Paraguay', flag: '🇵🇾' },
  { code: '+598', country: 'UY', name: 'Uruguay', flag: '🇺🇾' },
  { code: '+506', country: 'CR', name: 'Costa Rica', flag: '🇨🇷' },
  { code: '+507', country: 'PA', name: 'Panama', flag: '🇵🇦' },
  { code: '+502', country: 'GT', name: 'Guatemala', flag: '🇬🇹' },
  { code: '+503', country: 'SV', name: 'El Salvador', flag: '🇸🇻' },
  { code: '+504', country: 'HN', name: 'Honduras', flag: '🇭🇳' },
  { code: '+505', country: 'NI', name: 'Nicaragua', flag: '🇳🇮' },
  { code: '+1809', country: 'DO', name: 'Rep. Dominicana', flag: '🇩🇴' },
  { code: '+53', country: 'CU', name: 'Cuba', flag: '🇨🇺' },
]

export default function Home() {
  const router = useRouter()
  const { connected, publicKey, disconnect } = useWallet()
  const { setVisible: openWalletModal } = useWalletModal()
  const [activeModal, setActiveModal] = useState<ModalType>('none')
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', ''])
  const [phoneNumber, setPhoneNumber] = useState('')
  const [countryCode, setCountryCode] = useState('+52')
  const [isLoading, setIsLoading] = useState(false)
  const [otpError, setOtpError] = useState<string | null>(null)
  const [phoneError, setPhoneError] = useState<string | null>(null)
  const [otpSent, setOtpSent] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)
  const [showWalletMenu, setShowWalletMenu] = useState(false)
  const walletMenuRef = useRef<HTMLDivElement>(null)

  // Close wallet menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (walletMenuRef.current && !walletMenuRef.current.contains(event.target as Node)) {
        setShowWalletMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // When wallet connects, jump directly to role selector
  useEffect(() => {
    if (connected && publicKey) {
      setActiveModal('role')
    }
  }, [connected, publicKey])

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendTimer])

  const shortAddress = publicKey
    ? `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}`
    : null

  const selectedCountry = LATAM_COUNTRIES.find(c => c.code === countryCode)

  const handleOtpChange = (index: number, value: string) => {
    setOtpError(null)
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newValues = [...otpValues]
      newValues[index] = value
      setOtpValues(newValues)
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`)
        nextInput?.focus()
      }
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      prevInput?.focus()
    }
  }

  const handlePhoneNext = async () => {
    if (phoneNumber.length < 10) {
      setPhoneError('Ingresa un numero valido de al menos 10 digitos')
      return
    }

    setIsLoading(true)
    setPhoneError(null)

    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      setOtpSent(true)
      setResendTimer(60)
      setOtpValues(['', '', '', '', '', ''])
      setActiveModal('otp')
    } catch {
      setPhoneError('Error al enviar el codigo. Intenta de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOtp = async () => {
    if (resendTimer > 0) return
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setResendTimer(60)
      setOtpError(null)
      setOtpValues(['', '', '', '', '', ''])
    } catch {
      setOtpError('Error al reenviar codigo')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpVerify = async () => {
    const code = otpValues.join('')
    if (code.length !== 6) {
      setOtpError('Ingresa el codigo completo de 6 digitos')
      return
    }

    setIsLoading(true)
    setOtpError(null)

    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      if (code === '000000') {
        setOtpError('Codigo incorrecto. Intenta de nuevo.')
        setIsLoading(false)
        return
      }
      setActiveModal('role')
    } catch {
      setOtpError('Error de verificacion. Intenta de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  const closeModal = useCallback(() => {
    const shouldDisconnect = activeModal === 'login' || activeModal === 'phone' || activeModal === 'otp'
    setActiveModal('none')
    setPhoneNumber('')
    setOtpValues(['', '', '', '', '', ''])
    setOtpError(null)
    setPhoneError(null)
    setOtpSent(false)
    if (shouldDisconnect && connected) disconnect()
  }, [connected, disconnect, activeModal])

  const handleRoleSelect = (role: 'organizador' | 'asistente') => {
    setIsLoading(true)
    setTimeout(() => {
      setActiveModal('none')
      if (role === 'organizador') {
        router.push('/organizer')
      } else {
        router.push('/dashboard')
      }
    }, 300)
  }

  const CloseButton = () => (
    <button
      onClick={closeModal}
      className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-muted hover:text-primary hover:bg-primary/10 transition-all z-20"
      aria-label="Close"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0E150C] to-background">
      {/* Header */}
      <header className="border-b border-border/10 px-6 h-16 flex items-center justify-between sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <img src="/ranti-logo.svg" alt="Ranti" className="w-7 h-7" />
          <span className="text-lg font-bold text-primary tracking-widest" style={{ fontFamily: 'var(--font-climate)' }}>RANTI</span>
        </div>

        <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          <Link href="#home" className="text-xs font-bold tracking-widest text-foreground hover:text-primary transition-colors">HOME</Link>
          <Link href="#eventos" className="text-xs font-bold tracking-widest text-muted hover:text-foreground transition-colors">MARKETPLACE</Link>
          <Link href="#sobrenos" className="text-xs font-bold tracking-widest text-muted hover:text-foreground transition-colors">SOBRE NOSOTROS</Link>
        </nav>

        <div className="flex items-center gap-4">
          {connected && shortAddress ? (
            <div className="relative" ref={walletMenuRef}>
              <button
                onClick={() => setShowWalletMenu(!showWalletMenu)}
                className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 text-primary text-xs font-bold rounded-lg hover:bg-primary/20 transition-all"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                {shortAddress}
                <svg className={`w-3 h-3 transition-transform ${showWalletMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showWalletMenu && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-[#161D14] border border-[#404A38]/50 rounded-xl shadow-xl overflow-hidden z-[60]">
                  <div className="p-3 border-b border-[#404A38]/30">
                    <p className="text-[10px] text-muted uppercase tracking-wider mb-1">Connected Wallet</p>
                    <p className="text-xs font-mono text-primary">{shortAddress}</p>
                  </div>
                  <div className="py-1">
                    <Link
                      href="/dashboard"
                      onClick={() => setShowWalletMenu(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-xs text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      User Dashboard
                    </Link>
                    <Link
                      href="/organizer"
                      onClick={() => setShowWalletMenu(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-xs text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Organizer Dashboard
                    </Link>
                  </div>
                  <div className="border-t border-[#404A38]/30 py-1">
                    <button
                      onClick={() => {
                        setShowWalletMenu(false)
                        disconnect()
                      }}
                      className="flex items-center gap-3 px-4 py-2.5 text-xs text-destructive hover:bg-destructive/10 transition-colors w-full text-left"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Disconnect Wallet
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setActiveModal('login')}
              className="px-5 py-2 font-bold rounded-lg text-xs uppercase tracking-wide bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
            >
              Login
            </button>
          )}
        </div>
      </header>

      {/* Hero + Events section */}
      <main className="px-6 py-12 max-w-7xl mx-auto">
        <div className="mb-16">
          <h1 className="text-5xl md:text-7xl font-bold text-primary mb-4" style={{ fontFamily: 'var(--font-climate)' }}>
            RANTI PROTOCOL
          </h1>
          <p className="text-muted text-lg">Web3 Event Management & Loyalty Ecosystem</p>
        </div>
      </main>

      {/* Modal Overlay */}
      {activeModal !== 'none' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={closeModal}
          />

          {/* LOGIN MODAL */}
          {activeModal === 'login' && (
            <div className="relative z-10 bg-[#161D14] border border-[#2a3528] rounded-2xl p-8 w-[400px] shadow-2xl">
              <CloseButton />
              <h2 className="text-2xl font-bold text-primary text-center mb-1" style={{ fontFamily: 'var(--font-climate)' }}>
                ACCESS
              </h2>
              <h2 className="text-2xl font-bold text-primary text-center mb-2" style={{ fontFamily: 'var(--font-climate)' }}>
                PROTOCOL
              </h2>
              <p className="text-[10px] text-muted text-center uppercase tracking-widest mb-6">
                Choose your verification method
              </p>

              <button
                onClick={() => openWalletModal(true)}
                className="w-full px-6 py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/20 text-sm flex items-center justify-center gap-3 mb-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
                </svg>
                CONNECT WALLET
              </button>

              <div className="flex items-center justify-center gap-4 mb-4">
                <span className="text-[10px] text-muted flex items-center gap-1">
                  <span className="text-primary">◄</span> PHANTOM
                </span>
                <span className="text-[10px] text-muted flex items-center gap-1">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
                  SOLFLARE
                </span>
              </div>

              <div className="flex items-center gap-4 my-4">
                <div className="flex-1 h-px bg-[#2a3528]"></div>
                <span className="text-[10px] text-muted">OR</span>
                <div className="flex-1 h-px bg-[#2a3528]"></div>
              </div>

              <button
                onClick={() => {
                  setPhoneNumber('')
                  setPhoneError(null)
                  setActiveModal('phone')
                }}
                className="w-full px-6 py-4 bg-[#1a2518] border border-[#2a3528] text-foreground font-bold rounded-xl hover:border-primary/30 transition-colors text-sm flex items-center justify-center gap-3 mb-3"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                CONTINUE WITH PHONE
              </button>

              <p className="text-[9px] text-muted text-center mt-6 leading-relaxed">
                NON-CUSTODIAL AND SECURE.<br/>
                YOUR KEYS, YOUR ACCESS.
              </p>
            </div>
          )}

          {/* PHONE INPUT MODAL */}
          {activeModal === 'phone' && (
            <div className="relative z-10 bg-[#161D14] border border-[#2a3528] rounded-2xl p-8 w-[420px] shadow-2xl">
              <CloseButton />
              <h2 className="text-xl font-bold text-primary mb-1" style={{ fontFamily: 'var(--font-climate)' }}>
                VERIFY PHONE
              </h2>
              <p className="text-[10px] text-muted uppercase tracking-widest mb-6">
                Enter your phone number to receive OTP
              </p>

              <div className="bg-primary/5 border border-primary/20 rounded-lg px-4 py-2 mb-6">
                <p className="text-[10px] text-primary flex items-center gap-2">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Available only for Latin America countries
                </p>
              </div>

              <div className="mb-6">
                <label className="text-[10px] text-muted uppercase tracking-widest block mb-2">
                  Phone number
                </label>
                <div className="flex gap-2">
                  <select
                    value={countryCode}
                    onChange={(e) => {
                      setCountryCode(e.target.value)
                      setPhoneError(null)
                    }}
                    className="w-32 bg-[#0E150C] border border-[#2a3528] rounded-xl px-3 py-4 text-sm text-foreground focus:border-primary focus:outline-none transition-colors cursor-pointer"
                    style={{ fontFamily: 'var(--font-grotesk)' }}
                  >
                    {LATAM_COUNTRIES.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.flag} {country.code}
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => {
                      setPhoneNumber(e.target.value.replace(/\D/g, ''))
                      setPhoneError(null)
                    }}
                    placeholder="55 1234 5678"
                    className={`flex-1 bg-[#0E150C] border rounded-xl px-4 py-4 text-lg text-foreground placeholder:text-muted/50 focus:border-primary focus:outline-none transition-colors ${
                      phoneError ? 'border-destructive' : 'border-[#2a3528]'
                    }`}
                    style={{ fontFamily: 'var(--font-grotesk)' }}
                    maxLength={12}
                  />
                </div>
                {selectedCountry && (
                  <p className="text-[10px] text-muted mt-2">
                    {selectedCountry.flag} {selectedCountry.name}
                  </p>
                )}
              </div>

              {phoneError && (
                <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
                  <p className="text-xs text-destructive flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {phoneError}
                  </p>
                </div>
              )}

              <button
                onClick={handlePhoneNext}
                disabled={phoneNumber.length < 10 || isLoading}
                className="w-full px-6 py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-primary/20"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    Send Code
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          )}

          {/* OTP MODAL */}
          {activeModal === 'otp' && (
            <div className="relative z-10 bg-[#0E150C] border border-[#2a3528] rounded-2xl overflow-hidden w-[900px] shadow-2xl flex">
              <CloseButton />
              <div className="flex-1 p-8">
                <h3 className="text-2xl font-bold text-primary mb-2" style={{ fontFamily: 'var(--font-climate)' }}>
                  VERIFICATION
                </h3>
                <p className="text-sm text-muted mb-2">
                  Sent code to <span className="text-primary">{selectedCountry?.flag} {countryCode}</span>
                </p>
                <p className="text-sm text-primary mb-8 font-mono">****{phoneNumber.slice(-4)}</p>

                {otpError && (
                  <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
                    <p className="text-xs text-destructive flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {otpError}
                    </p>
                  </div>
                )}

                <div className="flex gap-3 mb-6">
                  {otpValues.map((value, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={value}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className={`w-14 h-14 bg-[#161D14] border-2 rounded-xl text-center text-2xl font-bold text-primary focus:border-primary focus:outline-none transition-colors ${
                        otpError ? 'border-destructive' : value ? 'border-primary/50' : 'border-[#2a3528]'
                      }`}
                      style={{ fontFamily: 'var(--font-grotesk)' }}
                    />
                  ))}
                </div>

                <div className="flex gap-4 mb-8">
                  <button
                    onClick={handleOtpVerify}
                    disabled={otpValues.join('').length !== 6 || isLoading}
                    className="flex-1 px-6 py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-primary/20"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                        Verifying...
                      </>
                    ) : (
                      <>
                        Verify Code
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleResendOtp}
                    disabled={resendTimer > 0 || isLoading}
                    className={`px-6 py-4 text-sm flex items-center gap-2 border border-[#2a3528] rounded-xl transition-colors ${
                      resendTimer > 0 ? 'text-muted cursor-not-allowed' : 'text-muted hover:text-primary hover:border-primary/30'
                    }`}
                  >
                    Resend
                    {resendTimer > 0 && (
                      <span className="px-2 py-0.5 bg-primary/20 text-primary text-[10px] rounded font-mono">{resendTimer}s</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ROLE SELECTOR MODAL */}
          {activeModal === 'role' && (
            <div className="relative z-10 bg-[#0E150C] border border-[#2a3528] rounded-2xl p-8 w-[700px] shadow-2xl">
              <CloseButton />
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-bold text-primary" style={{ fontFamily: 'var(--font-climate)' }}>RANTI PROTOCOL</h3>
                {shortAddress ? (
                  <span className="text-[10px] font-mono bg-primary/10 border border-primary/20 text-primary px-3 py-1.5 rounded-lg flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                    {shortAddress}
                  </span>
                ) : (
                  <span className="text-[10px] text-muted uppercase tracking-widest">Solana Protocol v4.0</span>
                )}
              </div>

              <p className="text-sm text-muted mb-8">Select your role to continue:</p>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <button
                  onClick={() => handleRoleSelect('organizador')}
                  disabled={isLoading}
                  className="bg-[#161D14] border border-[#2a3528] rounded-2xl p-6 text-left hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <svg className="w-5 h-5 text-muted group-hover:text-primary group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-primary mb-3 group-hover:text-primary/90" style={{ fontFamily: 'var(--font-climate)' }}>
                    ORGANIZADOR
                  </h3>
                  <p className="text-xs text-muted leading-relaxed mb-4">
                    Create events, manage tickets, and analyze loyalty metrics.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-[9px] px-2 py-1 bg-primary/10 text-primary rounded border border-primary/20">Create Events</span>
                    <span className="text-[9px] px-2 py-1 bg-primary/10 text-primary rounded border border-primary/20">Analytics</span>
                    <span className="text-[9px] px-2 py-1 bg-primary/10 text-primary rounded border border-primary/20">Mint NFTs</span>
                  </div>
                </button>

                <button
                  onClick={() => handleRoleSelect('asistente')}
                  disabled={isLoading}
                  className="bg-[#161D14] border border-[#2a3528] rounded-2xl p-6 text-left hover:border-secondary/50 hover:shadow-lg hover:shadow-secondary/10 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-secondary/20 border border-secondary/30 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <svg className="w-5 h-5 text-muted group-hover:text-secondary group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-secondary mb-3 group-hover:text-secondary/90" style={{ fontFamily: 'var(--font-climate)' }}>
                    ASISTENTE
                  </h3>
                  <p className="text-xs text-muted leading-relaxed mb-4">
                    Explore events, secure your access, and build your reputation.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-[9px] px-2 py-1 bg-secondary/10 text-secondary rounded border border-secondary/20">My Tickets</span>
                    <span className="text-[9px] px-2 py-1 bg-secondary/10 text-secondary rounded border border-secondary/20">Rewards</span>
                    <span className="text-[9px] px-2 py-1 bg-secondary/10 text-secondary rounded border border-secondary/20">Check-in</span>
                  </div>
                </button>
              </div>

              {isLoading && (
                <div className="flex items-center justify-center gap-3 p-4 bg-primary/5 border border-primary/20 rounded-xl">
                  <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                  <span className="text-sm text-primary">Redirecting to dashboard...</span>
                </div>
              )}

              <div className="flex items-center justify-between text-[10px] text-muted pt-4 border-t border-[#2a3528]">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                  SOLANA {(process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet').toUpperCase()}: ACTIVE
                </span>
                <div className="flex items-center gap-6">
                  {shortAddress && <span className="text-primary font-mono">{shortAddress}</span>}
                  <span>RANTI <span className="text-primary">v2.0</span></span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
