'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'

type ModalType = 'none' | 'login' | 'phone' | 'otp' | 'role'

export default function Home() {
  const router = useRouter()
  const { connected, publicKey, disconnect } = useWallet()
  const { setVisible: openWalletModal } = useWalletModal()
  const [activeModal, setActiveModal] = useState<ModalType>('none')
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', ''])
  const [phoneNumber, setPhoneNumber] = useState('')
  const [countryCode, setCountryCode] = useState('+52')

  // When wallet connects, jump directly to role selector
  useEffect(() => {
    if (connected && publicKey) {
      setActiveModal('role')
    }
  }, [connected, publicKey])

  const shortAddress = publicKey
    ? `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}`
    : null

  const handleOtpChange = (index: number, value: string) => {
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

  const handleLoginNext = () => {
    setActiveModal('phone')
  }

  const handlePhoneNext = () => {
    if (phoneNumber.length >= 10) {
      setActiveModal('otp')
    }
  }

  const handleOtpNext = () => {
    setActiveModal('role')
  }

  const handleConnectWallet = () => {
    openWalletModal(true)
  }

  const closeModal = () => {
    setActiveModal('none')
    if (connected) disconnect()
  }

  const handleRoleSelect = (role: 'organizador' | 'asistente') => {
    setActiveModal('none')
    if (role === 'organizador') {
      router.push('/organizer')
    } else {
      router.push('/dashboard')
    }
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
            <Link href="/eventos" className="text-primary border-b-2 border-primary pb-1 uppercase tracking-widest font-bold hover:opacity-80 transition-opacity">Events</Link>
            <Link href="/marketplace" className="text-muted hover:text-primary transition-colors uppercase tracking-widest font-bold">Marketplace</Link>
            <Link href="/tickets" className="text-muted hover:text-primary transition-colors uppercase tracking-widest font-bold">My Tickets</Link>
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
          <button
            onClick={() => connected ? setActiveModal('role') : setActiveModal('login')}
            className={`px-5 py-2 font-bold rounded-lg transition-all text-xs uppercase tracking-wide flex items-center gap-2 ${
              connected
                ? 'bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20'
                : 'bg-primary text-primary-foreground hover:bg-primary/90'
            }`}
          >
            {connected && <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>}
            {connected ? shortAddress : 'Login'}
          </button>
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

              {/* Phone input */}
              <div className="mb-6">
                <label className="text-[10px] text-muted uppercase tracking-widest block mb-2">
                  Numero de telefono
                </label>
                <div className="flex gap-2">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="w-24 bg-[#0E150C] border border-[#2a3528] rounded-xl px-3 py-4 text-sm text-foreground focus:border-primary focus:outline-none transition-colors appearance-none cursor-pointer"
                    style={{ fontFamily: 'var(--font-grotesk)' }}
                  >
                    <option value="+52">+52</option>
                    <option value="+1">+1</option>
                    <option value="+34">+34</option>
                    <option value="+44">+44</option>
                    <option value="+55">+55</option>
                  </select>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="55 1234 5678"
                    className="flex-1 bg-[#0E150C] border border-[#2a3528] rounded-xl px-4 py-4 text-lg text-foreground placeholder:text-muted/50 focus:border-primary focus:outline-none transition-colors"
                    style={{ fontFamily: 'var(--font-grotesk)' }}
                    maxLength={10}
                  />
                </div>
              </div>

              {/* Submit button */}
              <button
                onClick={handlePhoneNext}
                disabled={phoneNumber.length < 10}
                className="w-full px-6 py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Enviar Codigo
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
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
                  {"We've sent a 6-digit code to your phone"} <span className="text-primary">{countryCode}</span>
                </p>
                <p className="text-sm text-primary mb-8">****{phoneNumber.slice(-4)}</p>

                {/* OTP Inputs */}
                <div className="flex gap-3 mb-8">
                  {otpValues.map((value, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength={1}
                      value={value}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      className="w-14 h-14 bg-[#161D14] border-2 border-[#2a3528] rounded-xl text-center text-2xl font-bold text-primary focus:border-primary focus:outline-none transition-colors"
                      style={{ fontFamily: 'var(--font-grotesk)' }}
                    />
                  ))}
                </div>

                {/* Buttons */}
                <div className="flex gap-4 mb-8">
                  <button
                    onClick={handleOtpNext}
                    className="flex-1 px-6 py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-colors text-sm flex items-center justify-center gap-2"
                  >
                    Verify & Link Wallet
                    <div className="w-2 h-2 rounded-full bg-primary-foreground"></div>
                  </button>
                  <button className="px-6 py-4 text-muted hover:text-primary transition-colors text-sm flex items-center gap-2 border border-[#2a3528] rounded-xl">
                    Resend Code
                    <span className="px-2 py-0.5 bg-primary/20 text-primary text-[10px] rounded">30s</span>
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
                  className="bg-[#161D14] border border-[#2a3528] rounded-2xl p-6 text-left hover:border-primary/50 transition-all group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="text-[10px] text-muted uppercase tracking-widest">REF: 00-[01]</span>
                  </div>
                  <h3 className="text-2xl font-bold text-primary mb-3" style={{ fontFamily: 'var(--font-climate)' }}>
                    ORGANIZADOR
                  </h3>
                  <p className="text-xs text-muted leading-relaxed">
                    Crea eventos, gestiona tickets y<br/>analiza metricas de lealtad.
                  </p>
                </button>

                {/* Asistente */}
                <button
                  onClick={() => handleRoleSelect('asistente')}
                  className="bg-[#161D14] border border-[#2a3528] rounded-2xl p-6 text-left hover:border-secondary/50 transition-all group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-secondary/20 border border-secondary/30 flex items-center justify-center text-secondary">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <span className="text-[10px] text-muted uppercase tracking-widest">ACE: 01-[47]</span>
                  </div>
                  <h3 className="text-2xl font-bold text-secondary mb-3" style={{ fontFamily: 'var(--font-climate)' }}>
                    ASISTENTE
                  </h3>
                  <p className="text-xs text-muted leading-relaxed">
                    Explora eventos, asegura tus<br/>accesos y construye tu reputacion.
                  </p>
                </button>
              </div>

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
