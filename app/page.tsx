'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { SolanaWalletStrip } from '@/components/solana-wallet-strip'

type ModalType = 'none' | 'login' | 'phone' | 'otp' | 'role'

export default function HomePage() {
  const router = useRouter()
  const { connected, publicKey, disconnect } = useWallet()
  const { setVisible: openWalletModal } = useWalletModal()
  
  const [activeModal, setActiveModal] = useState<ModalType>('none')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [phoneError, setPhoneError] = useState<string | null>(null)
  const [otpError, setOtpError] = useState<string | null>(null)
  const [otpSent, setOtpSent] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)
  const [showWalletMenu, setShowWalletMenu] = useState(false)
  const walletMenuRef = useRef<HTMLDivElement>(null)

  const shortAddress = publicKey
    ? `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}`
    : null

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

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer <= 0) return
    const interval = setInterval(() => setResendTimer(prev => prev - 1), 1000)
    return () => clearInterval(interval)
  }, [resendTimer])

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPhoneError(null)
    
    if (!phoneNumber.match(/^\+?[1-9]\d{1,14}$/)) {
      setPhoneError('Por favor ingresa un número válido')
      return
    }

    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      setOtpSent(true)
      setResendTimer(60)
      setOtpValues(['', '', '', '', '', ''])
      setActiveModal('otp')
    } catch {
      setPhoneError('Error al enviar el código')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return
    const newValues = [...otpValues]
    newValues[index] = value
    setOtpValues(newValues)
  }

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otpValues.some(v => !v)) {
      setOtpError('Por favor completa todos los dígitos')
      return
    }

    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setActiveModal('role')
    } catch {
      setOtpError('Error verificando OTP')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRoleSelect = (role: 'user' | 'organizer') => {
    setActiveModal('none')
    router.push(role === 'user' ? '/dashboard' : '/organizer')
  }

  const handleLogout = async () => {
    setShowWalletMenu(false)
    await disconnect()
    setActiveModal('none')
  }

  const closeModal = useCallback(() => {
    setActiveModal('none')
    setPhoneNumber('')
    setOtpValues(['', '', '', '', '', ''])
    setOtpError(null)
    setPhoneError(null)
    setOtpSent(false)
  }, [])

  const handleResendOtp = useCallback(() => {
    if (resendTimer > 0) return
    setResendTimer(60)
    setOtpValues(['', '', '', '', '', ''])
    setOtpError(null)
  }, [resendTimer])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border px-6 h-14 flex items-center justify-between bg-background sticky top-0 z-40">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <img src="/ranti-logo.svg" alt="Ranti" className="w-6 h-6" />
          <span className="text-sm font-bold text-primary tracking-widest" style={{ fontFamily: 'var(--font-climate)' }}>RANTI</span>
        </Link>

        <nav className="flex items-center gap-6 text-xs">
          <Link href="/marketplace" className="text-primary border-b-2 border-primary pb-1 uppercase tracking-widest font-bold hover:opacity-80 transition-opacity">
            Marketplace
          </Link>
          <Link href="/eventos" className="text-muted hover:text-primary transition-colors uppercase tracking-widest font-bold">
            Events
          </Link>
        </nav>

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
                <div className="absolute top-full right-0 mt-2 w-52 bg-[#161D14] border border-[#404A38]/50 rounded-xl shadow-xl overflow-hidden z-50">
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
                    <button
                      onClick={handleLogout}
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

      {/* Main Content */}
      <main className="p-6 md:p-12 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-primary mb-4">
            Solana · Smart ticketing + loyalty
          </p>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 leading-tight" style={{ fontFamily: 'var(--font-climate)' }}>
            El ticket no muere
            <span className="block text-primary mt-1">después del check-in</span>
          </h1>
          <p className="text-base md:text-lg text-muted-foreground mb-6 max-w-2xl mx-auto leading-relaxed">
            Convierte entradas &quot;muertas&quot; en activos: acceso verificado, recompensas, badges e historial de participación para comunidades y experiencias.
          </p>
          <SolanaWalletStrip showHint className="mx-auto mb-8 max-w-xl" />
        </div>

        {/* CTA */}
        {!connected ? (
          <div className="text-center space-y-4">
            <button
              onClick={() => openWalletModal(true)}
              className="px-8 py-4 bg-primary text-primary-foreground text-lg font-bold rounded-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
            >
              Conectar wallet — empezar demo
            </button>
            <p className="text-[11px] text-muted-foreground max-w-md mx-auto">
              Identidad con firma en wallet + sesión verificada. La demo prioriza el flujo ticket → check-in → recompensa.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={() => router.push('/dashboard')}
              className="p-6 bg-surface-container-low border border-border rounded-lg hover:border-primary/30 transition-colors text-left"
            >
              <h3 className="text-xl font-bold mb-2">Panel asistente</h3>
              <p className="text-muted-foreground text-sm">Tickets activos, check-in y puntos de participación</p>
            </button>
            <button
              onClick={() => router.push('/organizer')}
              className="p-6 bg-surface-container-low border border-border rounded-lg hover:border-primary/30 transition-colors text-left"
            >
              <h3 className="text-xl font-bold mb-2">Modo organizador</h3>
              <p className="text-muted-foreground text-sm">Eventos y control de acceso (demo)</p>
            </button>
            <button
              onClick={() => router.push('/marketplace')}
              className="p-6 bg-surface-container-low border border-border rounded-lg hover:border-primary/30 transition-colors text-left"
            >
              <h3 className="text-xl font-bold mb-2">Marketplace</h3>
              <p className="text-muted-foreground text-sm">Descubrir y adquirir entradas</p>
            </button>
          </div>
        )}
      </main>

      {/* Login Modal */}
      {activeModal === 'login' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#161D14] border border-[#404A38] rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground">Connect to Ranti</h2>
              <button onClick={closeModal} className="text-muted hover:text-foreground">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <button
              onClick={() => openWalletModal(true)}
              className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-all mb-4"
            >
              Connect Solana Wallet
            </button>

            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#404A38]"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-[#161D14] text-muted">or continue with phone</span>
              </div>
            </div>

            <button
              onClick={() => setActiveModal('phone')}
              className="w-full py-3 border border-[#404A38] text-foreground font-bold rounded-lg hover:border-primary/30 transition-all"
            >
              Phone Number
            </button>
          </div>
        </div>
      )}

      {/* Phone Modal */}
      {activeModal === 'phone' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#161D14] border border-[#404A38] rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-foreground mb-4">Enter Phone Number</h2>
            <form onSubmit={handlePhoneSubmit}>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value)
                  setPhoneError(null)
                }}
                placeholder="+52 123 4567890"
                className="w-full px-4 py-2 bg-surface-container-low border border-border rounded-lg text-foreground mb-2 focus:outline-none focus:border-primary/50"
              />
              {phoneError && <p className="text-xs text-destructive mb-4">{phoneError}</p>}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50"
              >
                {isLoading ? 'Sending...' : 'Send Code'}
              </button>
              <button
                type="button"
                onClick={() => setActiveModal('login')}
                className="w-full mt-2 py-2 border border-[#404A38] text-foreground font-bold rounded-lg hover:border-primary/30 transition-all"
              >
                Back
              </button>
            </form>
          </div>
        </div>
      )}

      {/* OTP Modal */}
      {activeModal === 'otp' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#161D14] border border-[#404A38] rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-foreground mb-2">Enter Verification Code</h2>
            <p className="text-xs text-muted-foreground mb-4">We sent a code to {phoneNumber}</p>
            <form onSubmit={handleOtpSubmit}>
              <div className="flex gap-2 mb-4">
                {otpValues.map((value, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    value={value}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    className="w-12 h-12 text-center bg-surface-container-low border border-border rounded-lg text-foreground text-lg focus:outline-none focus:border-primary/50"
                  />
                ))}
              </div>
              {otpError && <p className="text-xs text-destructive mb-4">{otpError}</p>}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 mb-2"
              >
                {isLoading ? 'Verifying...' : 'Verify'}
              </button>
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendTimer > 0}
                className="w-full py-2 border border-[#404A38] text-foreground font-bold rounded-lg hover:border-primary/30 transition-all disabled:opacity-50 disabled:text-muted"
              >
                {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Role Selection Modal */}
      {activeModal === 'role' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#161D14] border border-[#404A38] rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-foreground mb-4">Choose Your Role</h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleRoleSelect('user')}
                className="p-4 border border-border rounded-lg hover:border-primary/30 transition-all text-center"
              >
                <svg className="w-8 h-8 mx-auto mb-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <p className="font-bold text-foreground">User</p>
                <p className="text-xs text-muted-foreground mt-1">Attend events</p>
              </button>
              <button
                onClick={() => handleRoleSelect('organizer')}
                className="p-4 border border-border rounded-lg hover:border-primary/30 transition-all text-center"
              >
                <svg className="w-8 h-8 mx-auto mb-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="font-bold text-foreground">Organizer</p>
                <p className="text-xs text-muted-foreground mt-1">Create events</p>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
