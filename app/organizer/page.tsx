'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useOrganizer } from '@/lib/hooks/use-organizer'

type ModalType = 'none' | 'create-event' | 'success'

interface TransactionData {
  user_signature: string
  organizer_signature: string
  asset_id: string
  transaction_hash: string
}

export default function OrganizerDashboard() {
  const { data, loading, error, createEvent } = useOrganizer()
  const [activeModal, setActiveModal] = useState<ModalType>('none')
  const [activeNav, setActiveNav] = useState('overview')
  const [eventName, setEventName] = useState('')
  const [eventId, setEventId] = useState('')
  const [walletAddress, setWalletAddress] = useState('')
  const [description, setDescription] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [transactionData, setTransactionData] = useState<TransactionData | null>(null)
  const [createError, setCreateError] = useState<string | null>(null)

  const handleCreateEvent = async () => {
    setIsCreating(true)
    setCreateError(null)
    
    const result = await createEvent({
      name: eventName,
      event_id: eventId,
      wallet_address: walletAddress || undefined,
      description: description || undefined
    })

    setIsCreating(false)

    if (result.success && result.transaction) {
      setTransactionData(result.transaction)
      setActiveModal('success')
    } else {
      setCreateError(result.error || 'Failed to create event')
    }
  }

  const handleCloseSuccess = () => {
    setActiveModal('none')
    setEventName('')
    setEventId('')
    setWalletAddress('')
    setDescription('')
    setTransactionData(null)
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0E150C] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-muted">Loading organizer data...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-[#0E150C] flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0E150C] flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[#404A38]/10 flex flex-col fixed left-0 top-0 h-full bg-[#0E150C]">
        <div className="px-6 py-6">
          <Link href="/" className="flex items-center gap-2">
            <img src="/ranti-logo.svg" alt="Ranti" className="w-6 h-6" />
            <span className="text-lg font-bold text-primary tracking-wider" style={{ fontFamily: 'var(--font-climate)' }}>RANTI</span>
          </Link>
          <p className="text-[10px] text-muted uppercase tracking-widest mt-1">Protocol v2.0</p>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {[
            { id: 'overview', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', label: 'OVERVIEW' },
            { id: 'analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', label: 'ANALYTICS' },
            { id: 'sessions', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', label: 'SESSIONS' },
            { id: 'settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z', label: 'SETTINGS' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                activeNav === item.id
                  ? 'bg-[#1A2217] text-primary border-r-2 border-primary'
                  : 'text-muted hover:text-foreground hover:bg-[#1A2217]/50'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
              </svg>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4">
          <button
            onClick={() => setActiveModal('create-event')}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-primary/30 text-primary rounded-lg text-xs font-bold uppercase tracking-wide hover:bg-primary/10 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            CREATE EVENT
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        {/* Header */}
        <header className="h-14 border-b border-[#404A38]/10 px-6 flex items-center justify-between bg-[#0E150C] sticky top-0 z-30">
          <nav className="flex items-center gap-6">
            <span className="text-primary text-xs font-bold uppercase tracking-widest border-b-2 border-primary pb-1">DASHBOARD</span>
            <span className="text-muted text-xs font-bold uppercase tracking-widest hover:text-foreground cursor-pointer transition-colors">EVENTS</span>
            <Link href="/marketplace" className="text-muted text-xs font-bold uppercase tracking-widest hover:text-foreground transition-colors">MARKETPLACE</Link>
          </nav>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#1A2217] border border-[#404A38]/20 rounded-full px-3 py-1.5">
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary to-secondary"></div>
              <span className="text-xs font-bold text-foreground">0xF4c...8D3F</span>
            </div>
            <button className="p-2 text-muted hover:text-primary transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
          </div>
        </header>

        <div className="p-6 flex gap-6">
          {/* Left Column */}
          <div className="flex-1 space-y-6">
            {/* Banner */}
            <div className="bg-gradient-to-r from-[#1A2217] to-[#252C21] rounded-xl p-6 border border-[#404A38]/10 relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-3xl font-bold text-primary mb-2" style={{ fontFamily: 'var(--font-climate)' }}>
                  READY TO SCALE?
                </h2>
                <p className="text-sm text-muted mb-4 max-w-md">
                  Launch your next exclusive event on the Solana blockchain with our premium ticketing protocol.
                </p>
                <button
                  onClick={() => setActiveModal('create-event')}
                  className="flex items-center gap-2 px-4 py-2 bg-[#0E150C] border border-primary/30 text-primary rounded-lg text-xs font-bold hover:bg-primary/10 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  CREAR EVENTO
                </button>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
            </div>

            {/* Community Table */}
            <div className="bg-[#161D14] rounded-xl border border-[#404A38]/10 overflow-hidden">
              <div className="px-5 py-4 border-b border-[#404A38]/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-foreground" style={{ fontFamily: 'var(--font-climate)' }}>Comunidad</h3>
                  <span className="text-[10px] text-muted">1,054 TOTAL MEMBERS</span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-[10px] text-muted uppercase tracking-widest border-b border-[#404A38]/10">
                      <th className="text-left px-5 py-3 font-bold">Name</th>
                      <th className="text-left px-5 py-3 font-bold">Wallet</th>
                      <th className="text-left px-5 py-3 font-bold">Participation</th>
                      <th className="text-left px-5 py-3 font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.members && data.members.length > 0 ? (
                      data.members.map((member, i) => (
                        <tr key={i} className="border-b border-[#404A38]/5 hover:bg-[#1A2217]/50 transition-colors">
                          <td className="px-5 py-3">
                            <span className="text-xs font-bold text-primary">{member.name}</span>
                          </td>
                          <td className="px-5 py-3">
                            <code className="text-xs text-muted font-mono">{member.wallet}</code>
                          </td>
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, j) => (
                                <div
                                  key={j}
                                  className={`w-2 h-2 rounded-full ${j < member.participation ? 'bg-primary' : 'bg-[#404A38]/30'}`}
                                />
                              ))}
                              <span className="text-[10px] text-muted ml-2">Level {member.participation}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3">
                            <span className={`text-[10px] font-bold uppercase tracking-wide ${
                              member.status === 'Verified' ? 'text-primary' : member.status === 'Syncing' ? 'text-secondary animate-pulse' : 'text-muted'
                            }`}>
                              {member.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-5 py-8 text-center text-muted text-xs">
                          No community members yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column - Events */}
          <div className="w-80 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-foreground" style={{ fontFamily: 'var(--font-climate)' }}>Comunidad</h3>
                    <span className="text-[10px] text-muted">{data?.stats?.totalMembers || 0} TOTAL MEMBERS</span>
                  </div>
                </div>

            {data?.events && data.events.length > 0 ? (
              data.events.map((event) => (
                <div
                  key={event.id}
                  className="bg-[#161D14] rounded-xl border border-[#404A38]/10 overflow-hidden hover:border-primary/30 transition-all cursor-pointer group"
                >
                  <div className="h-28 bg-gradient-to-br from-[#1A2217] to-[#252C21] relative">
                    <span className={`absolute top-3 left-3 text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wide ${
                      event.status === 'ACTIVE' ? 'bg-primary text-[#143800]' : 'bg-[#404A38] text-muted'
                    }`}>
                      {event.status}
                    </span>
                    <div className="absolute bottom-3 right-3 text-right">
                      <p className="text-xs text-muted">{event.tickets_sold}/{event.max_capacity}</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="text-lg font-bold text-primary leading-tight whitespace-pre-line" style={{ fontFamily: 'var(--font-climate)' }}>
                      {event.name}
                    </h4>
                    <p className="text-[10px] text-muted mt-1">{event.venue}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-[#161D14] rounded-xl border border-dashed border-[#404A38]/30 p-8 text-center">
                <p className="text-muted text-xs mb-2">No events yet</p>
                <button
                  onClick={() => setActiveModal('create-event')}
                  className="text-primary text-xs font-bold hover:underline"
                >
                  Create your first event
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Create Event Modal */}
      {activeModal === 'create-event' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#0E150C]/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-[#161D14] rounded-xl border border-[#404A38]/10 overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="px-8 pt-8 pb-4 flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-primary uppercase" style={{ fontFamily: 'var(--font-climate)' }}>
                  REGISTER NEW EVENT
                </h2>
                <p className="text-muted text-xs mt-1 uppercase tracking-widest">Protocol Deployment Interface</p>
              </div>
              <button
                onClick={() => setActiveModal('none')}
                className="text-muted hover:text-primary transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <div className="px-8 py-6 space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="text-[10px] font-bold text-muted uppercase tracking-widest block mb-2">
                    Nombre del Evento
                  </label>
                  <input
                    type="text"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    placeholder="Enter event name"
                    className="w-full bg-[#252C21] border-none text-foreground placeholder:text-muted/50 p-4 rounded-lg focus:ring-1 focus:ring-primary/40 transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-muted uppercase tracking-widest block mb-2">
                    ID Evento (UUID/Slug)
                  </label>
                  <input
                    type="text"
                    value={eventId}
                    onChange={(e) => setEventId(e.target.value)}
                    placeholder="luminous-summit-2024"
                    className="w-full bg-[#252C21] border-none text-foreground placeholder:text-muted/50 p-4 rounded-lg focus:ring-1 focus:ring-primary/40 transition-all text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-muted uppercase tracking-widest block mb-2">
                  Signer (Wallet Address)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    placeholder="0x... or Solana Address"
                    className="w-full bg-[#252C21] border-none text-foreground placeholder:text-muted/50 p-4 pr-12 rounded-lg focus:ring-1 focus:ring-primary/40 transition-all text-sm"
                  />
                  <svg className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-primary/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-muted uppercase tracking-widest block mb-2">
                  Logo de la Comunidad
                </label>
                <div className="border-2 border-dashed border-[#404A38]/30 bg-[#1A2217] rounded-xl p-8 flex flex-col items-center justify-center gap-2 hover:border-primary/30 transition-all cursor-pointer">
                  <svg className="w-8 h-8 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-xs text-muted">
                    Drag and drop or <span className="text-primary font-bold">browse files</span>
                  </p>
                  <p className="text-[10px] text-muted/60">SVG, PNG, JPG (max 800x400px)</p>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-muted uppercase tracking-widest block mb-2">
                  Informacion Adicional
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the event purpose and protocol requirements..."
                  rows={3}
                  className="w-full bg-[#252C21] border-none text-foreground placeholder:text-muted/50 p-4 rounded-lg focus:ring-1 focus:ring-primary/40 transition-all text-sm resize-none"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 pb-8">
              {createError && (
                <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-xs text-center">
                  {createError}
                </div>
              )}
              <button
                onClick={handleCreateEvent}
                disabled={isCreating || !eventName || !eventId}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary text-[#143800] font-bold rounded-xl hover:bg-primary/90 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-[#143800]/30 border-t-[#143800] rounded-full animate-spin"></div>
                    CREATING...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    FIRMAR Y CREAR EVENTO
                  </>
                )}
              </button>
              <p className="text-[9px] text-muted text-center mt-4">
                By signing, you authorize the immutable digital record to be created and logged on the Solana network.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {activeModal === 'success' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#0E150C]/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-[#091007] rounded-2xl border border-[#404A38]/10 overflow-hidden shadow-2xl p-8 relative">
            {/* Decorative */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-secondary/10 rounded-full blur-3xl pointer-events-none"></div>

            {/* Success Icon */}
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 rounded-full bg-[#8BE655] flex items-center justify-center">
                <svg className="w-8 h-8 text-[#143800]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            {/* Title */}
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-primary uppercase" style={{ fontFamily: 'var(--font-climate)' }}>
                EVENTO CREADO<br/>EXITOSAMENTE
              </h2>
            </div>

            {/* Transaction Data */}
            <div className="space-y-4 mb-10">
              {/* Status */}
              <div className="flex items-center justify-between border-b border-[#404A38]/10 pb-4">
                <span className="text-[10px] text-muted uppercase tracking-widest">Status</span>
                <div className="flex items-center gap-2 text-primary text-xs font-bold">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  CONFIRMED ON SOLANA MAINNET
                </div>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#161D14] p-4 rounded-lg">
                  <span className="text-[10px] text-muted uppercase tracking-widest block mb-2">User Signature</span>
                  <code className="text-xs text-foreground/80 font-mono">{transactionData?.user_signature || '0x8B...E655...55BC'}</code>
                </div>
                <div className="bg-[#161D14] p-4 rounded-lg">
                  <span className="text-[10px] text-muted uppercase tracking-widest block mb-2">Organizer Signature</span>
                  <code className="text-xs text-foreground/80 font-mono">{transactionData?.organizer_signature || '0x4A...DD8C...1A22'}</code>
                </div>
              </div>

              {/* Asset ID */}
              <div className="bg-[#161D14] p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-muted uppercase tracking-widest">Asset ID (Compressed NFT)</span>
                  <button 
                    onClick={() => navigator.clipboard.writeText(transactionData?.asset_id || '')}
                    className="text-muted hover:text-primary transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
                <code className="text-sm text-secondary font-mono">{transactionData?.asset_id || 'RP-EVT-0000-XXX-000-SOL-XXX-0000'}</code>
              </div>

              {/* Transaction Hash */}
              <div className="flex items-center justify-between bg-[#161D14] p-4 rounded-lg">
                <div>
                  <span className="text-[10px] text-muted uppercase tracking-widest block mb-1">Transaction Hash</span>
                  <code className="text-xs text-foreground/60 font-mono">{transactionData?.transaction_hash || '0x...'}</code>
                </div>
                <a 
                  href={`https://solscan.io/tx/${transactionData?.transaction_hash || ''}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-[#252C21] px-3 py-2 rounded-lg text-secondary text-xs font-bold hover:bg-[#2F372C] transition-colors"
                >
                  SOLSCAN
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Done Button */}
            <button
              onClick={handleCloseSuccess}
              className="w-full py-4 bg-[#8BE655] text-[#143800] font-bold rounded-xl hover:bg-primary transition-colors text-lg"
              style={{ fontFamily: 'var(--font-grotesk)' }}
            >
              DONE
            </button>
            <p className="text-[10px] text-muted text-center mt-4 uppercase tracking-widest">
              Ranti Protocol v2.0.4 // Solana Ecosystem
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
