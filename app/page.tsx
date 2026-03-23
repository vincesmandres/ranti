'use client'

// Ranti Protocol Landing Page - v35 (fixed)
import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'

type ModalType = 'none' | 'login' | 'phone' | 'otp' | 'role'

// LATAM country codes only
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

  const handleLoginNext = () => {
    setPhoneNumber('')
    setPhoneError(null)
    setActiveModal('phone')
  }

  const handlePhoneNext = async () => {
    if (phoneNumber.length < 10) {
      setPhoneError('Ingresa un numero valido de al menos 10 digitos')
      return
    }
    
    setIsLoading(true)
    setPhoneError(null)
    
    try {
      // Simulate API call to send OTP
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
      // Simulate OTP verification - accept any 6-digit code for demo
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // For demo: accept code "123456" or any code
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

  const handleConnectWallet = () => {
    openWalletModal(true)
  }

  const closeModal = useCallback(() => {
    // Don't disconnect if closing from role modal (user already authenticated)
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
    // Small delay for UX feedback
    setTimeout(() => {
      setActiveModal('none')
      if (role === 'organizador') {
        router.push('/organizer')
      } else {
        router.push('/dashboard')
      }
    }, 300)
  }

  // Shared close button component
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
    <main className="min-h-screen bg-[#0E150C] relative">
      {/* Header */}
      <header className="border-b border-[#1a2518] px-8 py-4 flex items-center justify-between relative z-50">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0 hover:opacity-80 transition-opacity">
            <img src="/ranti-logo.svg" alt="Ranti" className="w-6 h-6" />
            <span className="text-lg font-bold text-primary tracking-wider" style={{ fontFamily: 'var(--font-climate)' }}>RANTI</span>
          </Link>
          <nav className="flex items-center gap-6 text-xs">
            <Link href="/marketplace" className="text-primary border-b-2 border-primary pb-1 uppercase tracking-widest font-bold hover:opacity-80 transition-opacity">Marketplace</Link>
            <Link href="/eventos" className="text-muted hover:text-primary transition-colors uppercase tracking-widest font-bold">Events</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search protocol..."
              className="bg-[#161D14] border border-[#2a3528] rounded-lg px-4 py-2 text-xs text-muted placeholder:text-muted/50 w-48 focus:outline-none focus:border-primary/50"
            />
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          {/* Wallet Button with Dropdown */}
          {connected && shortAddress ? (
            <div className="relative" ref={walletMenuRef}>
              <button
                onClick={() => setShowWalletMenu(!showWalletMenu)}
                className="px-4 py-2 font-bold rounded-lg transition-all text-xs uppercase tracking-wide flex items-center gap-2 bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                {shortAddress}
                <svg className={`w-3 h-3 transition-transform ${showWalletMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {showWalletMenu && (
                <div className="absolute top-full right-0 mt-2 w-52 bg-[#161D14] border border-[#404A38]/50 rounded-xl shadow-xl overflow-hidden z-[60]">
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
                    <Link
                      href="/settings"
                      onClick={() => setShowWalletMenu(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-xs text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Settings
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
              className="px-5 py-2 font-bold rounded-lg transition-all text-xs uppercase tracking-wide bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Login
            </button>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-start gap-12">
            {/* Logo Carousel */}
            <div className="w-64 h-64 bg-[#161D14] border border-[#2a3528] rounded-2xl flex flex-col items-center justify-center gap-4 flex-shrink-0">
              <img src="/ranti-logo.svg" alt="Ranti" className="w-24 h-24" />
              <span className="text-3xl font-bold text-primary tracking-wider" style={{ fontFamily: 'var(--font-climate)' }}>RANTI</span>
            </div>

            {/* Hero Text */}
            <div className="flex-1 pt-4">
              <h1 className="text-6xl font-bold text-primary mb-6 leading-[1.1]" style={{ fontFamily: 'var(--font-climate)' }}>
                Entradas<br/>
                como<br/>
                activos<br/>
                verificables
              </h1>
              <p className="text-sm text-muted mb-8 max-w-md leading-relaxed">
                Protocolo en Solana para tickets programables, check-ins on-chain e historial de participacion demostrable. Explora activos y documentacion para integrar tu proximo evento.
              </p>
              <div className="flex gap-4">
                <button className="px-6 py-3 bg-transparent border border-primary text-primary font-bold rounded-lg hover:bg-primary/10 transition-colors text-sm flex items-center gap-2">
                  Explore Assets
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
                <button className="px-6 py-3 bg-[#161D14] border border-[#2a3528] text-muted font-bold rounded-lg hover:border-primary/30 transition-colors text-sm">
                  Documentation
                </button>
              </div>
            </div>
          </div>

          {/* Carousel Dots */}
          <div className="flex justify-center gap-2 mt-6 ml-32">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <div className="w-2 h-2 rounded-full bg-muted/30"></div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section id="eventos" className="py-12 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-primary" style={{ fontFamily: 'var(--font-climate)' }}>
              EVENTOS
            </h2>
            <button className="text-xs text-muted hover:text-primary transition-colors flex items-center gap-2 uppercase tracking-widest font-bold">
              Scroll to Explore
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {[
              { id: 1, name: 'Evento 1', date: '24.09.24', tier: 'PLATINUM', color: '#B8FF8C' },
              { id: 2, name: 'Evento 2', date: '12.09.24', tier: 'GOLD', color: '#4ADDB4' },
              { id: 3, name: 'Evento 3', date: '08.07.24', tier: 'VIP', color: '#C0CAB3' },
            ].map((event) => (
              <div key={event.id} className="bg-[#161D14] border border-[#2a3528] rounded-2xl overflow-hidden group hover:border-primary/30 transition-all">
                <p className="text-[10px] text-muted px-4 pt-4 uppercase tracking-widest">Protocol Asset 00{event.id}</p>
                <div className="aspect-[4/3] bg-gradient-to-br from-[#1a2518] to-[#0E150C] flex items-center justify-center relative">
                  {event.id === 1 && (
                    <div className="w-3/4 h-1/2 border border-primary/20 rounded-lg"></div>
                  )}
                  {event.id === 2 && (
                    <div className="w-24 h-24 border-4 border-primary/30 rounded-full flex items-center justify-center">
                      <div className="w-12 h-12 border-2 border-primary/20 rounded-full"></div>
                    </div>
                  )}
                  {event.id === 3 && (
                    <div className="flex gap-2">
                      <div className="w-16 h-16 rounded-full bg-[#2a3528]"></div>
                      <div className="w-16 h-16 rounded-full bg-[#3a4538] -ml-8"></div>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold text-primary mb-3" style={{ fontFamily: 'var(--font-climate)' }}>
                    {event.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-muted uppercase tracking-wide">Date</p>
                      <p className="text-xs text-foreground font-bold">{event.date}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted uppercase tracking-wide">Tier</p>
                      <p className="text-xs font-bold" style={{ color: event.color }}>{event.tier}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted">
                      <span>See More</span>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1a2518] py-6 px-8 mt-12">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-primary mb-1" style={{ fontFamily: 'var(--font-climate)' }}>Ranti</h3>
            <p className="text-[10px] text-muted">© 2024 Ranti Protocol. Built on Solana.</p>
          </div>
          <div className="flex items-center gap-8 text-xs text-muted">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Support</a>
            <a href="#" className="hover:text-primary transition-colors">Solscan</a>
          </div>
        </div>
      </footer>

          {/* Modal Overlay */}
      {activeModal !== 'none' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          {/* Backdrop */}
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

              {/* Connect Wallet — real Solana adapter */}
              <button
                onClick={handleConnectWallet}
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
                onClick={handleLoginNext}
                className="w-full px-6 py-4 bg-[#1a2518] border border-[#2a3528] text-foreground font-bold rounded-xl hover:border-primary/30 transition-colors text-sm flex items-center justify-center gap-3 mb-3"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                CONTINUE WITH PHONE
              </button>

              <button className="w-full px-6 py-4 bg-[#1a2518] border border-[#2a3528] text-foreground font-bold rounded-xl hover:border-primary/30 transition-colors text-sm flex items-center justify-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                USE EMAIL ADDRESS
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
              {/* Back button */}
              <button
                onClick={() => setActiveModal('login')}
                className="flex items-center gap-2 text-muted hover:text-primary transition-colors mb-6"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="text-xs uppercase tracking-widest">Volver</span>
              </button>

              <h2 className="text-3xl font-bold text-primary mb-2" style={{ fontFamily: 'var(--font-climate)' }}>
                Ingresa tu<br/>numero
              </h2>
              <p className="text-xs text-muted mb-8">
                Te enviaremos un codigo de verificacion para confirmar tu identidad.
              </p>

              {/* LATAM Notice */}
              <div className="bg-primary/5 border border-primary/20 rounded-lg px-4 py-2 mb-6">
                <p className="text-[10px] text-primary flex items-center gap-2">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Disponible solo para paises de Latinoamerica
                </p>
              </div>

              {/* Phone input */}
              <div className="mb-6">
                <label className="text-[10px] text-muted uppercase tracking-widest block mb-2">
                  Numero de telefono
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

              {/* Error message */}
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

              {/* Submit button */}
              <button
                onClick={handlePhoneNext}
                disabled={phoneNumber.length < 10 || isLoading}
                className="w-full px-6 py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-primary/20"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                    Enviando...
                  </>
                ) : (
                  <>
                    Enviar Codigo
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>

              <p className="text-[9px] text-muted text-center mt-6 leading-relaxed">
                Al continuar, aceptas recibir mensajes SMS para verificacion.
              </p>
            </div>
          )}

          {/* OTP MODAL */}
          {activeModal === 'otp' && (
            <div className="relative z-10 bg-[#0E150C] border border-[#2a3528] rounded-2xl overflow-hidden w-[900px] shadow-2xl flex">
              {/* X close */}
              <CloseButton />
              {/* Left Panel */}
              <div className="flex-1 p-8" style={{ background: 'radial-gradient(circle at 30% 70%, rgba(139, 230, 85, 0.15) 0%, transparent 50%)' }}>
                {/* Back + Header */}
                <div className="flex items-center justify-between mb-8">
                  <button
                    onClick={() => setActiveModal('phone')}
                    className="flex items-center gap-2 text-muted hover:text-primary transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="text-xl font-bold text-primary" style={{ fontFamily: 'var(--font-climate)' }}>RANTI</span>
                  </button>
                  <div className="flex items-center gap-3">
                    <button className="p-2 text-muted hover:text-primary transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </button>
                    <button className="p-2 text-muted hover:text-primary transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                    </button>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary"></div>
                  </div>
                </div>

                {/* Step indicator */}
                <p className="text-[10px] text-muted uppercase tracking-widest mb-4">
                  --- Step 2: Human Verification
                </p>

                {/* Title */}
                <h1 className="text-5xl font-bold text-primary mb-6 leading-tight" style={{ fontFamily: 'var(--font-climate)' }}>
                  Verify your<br/>Identity
                </h1>

                <p className="text-sm text-muted mb-2">
                  Enviamos un codigo de 6 digitos a <span className="text-primary">{selectedCountry?.flag} {countryCode}</span>
                </p>
                <p className="text-sm text-primary mb-8 font-mono">****{phoneNumber.slice(-4)}</p>

                {/* OTP Error */}
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

                {/* OTP Inputs */}
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

                {/* Buttons */}
                <div className="flex gap-4 mb-8">
                  <button
                    onClick={handleOtpVerify}
                    disabled={otpValues.join('').length !== 6 || isLoading}
                    className="flex-1 px-6 py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-primary/20"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                        Verificando...
                      </>
                    ) : (
                      <>
                        Verificar Codigo
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
                    Reenviar
                    {resendTimer > 0 && (
                      <span className="px-2 py-0.5 bg-primary/20 text-primary text-[10px] rounded font-mono">{resendTimer}s</span>
                    )}
                  </button>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between text-[10px] text-muted">
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    ENCRYPTED VIA SOLANA PROTOCOL
                  </span>
                  <div className="flex gap-4">
                    <span className="text-primary">REQUIRED</span>
                    <span>PROGRESS</span>
                    <span>ABSTRACT</span>
                  </div>
                </div>
              </div>

              {/* Right Panel - Protocol Activity */}
              <div className="w-[320px] bg-[#161D14] border-l border-[#2a3528] p-6">
                <h3 className="text-lg font-bold text-primary mb-1" style={{ fontFamily: 'var(--font-climate)' }}>
                  Protocol Activity
                </h3>
                <p className="text-[10px] text-muted uppercase tracking-widest mb-6">Verified on Solana</p>

                <div className="space-y-3 mb-8">
                  {[
                    { icon: 'doc', label: 'Evidence Panel', active: true },
                    { icon: 'history', label: 'Transaction History', active: false },
                    { icon: 'check', label: 'Identity Verified', active: false },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className={`flex items-center justify-between p-3 rounded-xl border ${
                        item.active ? 'border-primary/50 bg-primary/5' : 'border-[#2a3528]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded flex items-center justify-center ${item.active ? 'bg-primary/20 text-primary' : 'bg-[#2a3528] text-muted'}`}>
                          {item.icon === 'doc' && <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
                          {item.icon === 'history' && <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                          {item.icon === 'check' && <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
                        </div>
                        <span className={`text-xs font-bold ${item.active ? 'text-primary' : 'text-muted'}`}>{item.label}</span>
                      </div>
                      <svg className="w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  ))}
                </div>

                {/* Network Status */}
                <div className="mb-6">
                  <div className="flex items-center justify-between text-[10px] text-muted mb-2">
                    <span className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                      SOL NETWORK STATUS
                    </span>
                  </div>
                  <div className="h-1 bg-[#2a3528] rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-muted mt-2">
                    <span>GLOBAL</span>
                    <span>LATENCY <span className="text-primary">12ms</span></span>
                  </div>
                </div>

                {/* View on Solscan */}
                <button className="w-full px-4 py-3 border border-[#2a3528] rounded-xl text-xs font-bold text-muted hover:border-primary/30 hover:text-primary transition-colors uppercase tracking-widest">
                  View on Solscan
                </button>
              </div>
            </div>
          )}

          {/* ROLE SELECTOR MODAL */}
          {activeModal === 'role' && (
            <div className="relative z-10 bg-[#0E150C] border border-[#2a3528] rounded-2xl p-8 w-[700px] shadow-2xl">
              <CloseButton />
              {/* Header */}
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

              {/* Title */}
              <h1 className="text-4xl font-bold text-primary text-center mb-2" style={{ fontFamily: 'var(--font-climate)' }}>
                ELIGE TU ROL
              </h1>
              <p className="text-sm text-muted text-center mb-10">
                Personaliza tu experiencia en el protocolo.
              </p>

              {/* Role Cards */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                {/* Organizador */}
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
                    Crea eventos, gestiona tickets y analiza metricas de lealtad.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-[9px] px-2 py-1 bg-primary/10 text-primary rounded border border-primary/20">Crear Eventos</span>
                    <span className="text-[9px] px-2 py-1 bg-primary/10 text-primary rounded border border-primary/20">Analytics</span>
                    <span className="text-[9px] px-2 py-1 bg-primary/10 text-primary rounded border border-primary/20">Mint NFTs</span>
                  </div>
                </button>

                {/* Asistente/Usuario */}
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
                    Explora eventos, asegura tus accesos y construye tu reputacion.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-[9px] px-2 py-1 bg-secondary/10 text-secondary rounded border border-secondary/20">Mis Tickets</span>
                    <span className="text-[9px] px-2 py-1 bg-secondary/10 text-secondary rounded border border-secondary/20">Rewards</span>
                    <span className="text-[9px] px-2 py-1 bg-secondary/10 text-secondary rounded border border-secondary/20">Check-in</span>
                  </div>
                </button>
              </div>

              {/* Loading indicator when selecting role */}
              {isLoading && (
                <div className="flex items-center justify-center gap-3 mb-6 p-4 bg-primary/5 border border-primary/20 rounded-xl">
                  <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                  <span className="text-sm text-primary">Redirigiendo al dashboard...</span>
                </div>
              )}

              {/* Footer */}
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
    </main>
  )
}
