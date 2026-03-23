'use client'

import { useState } from 'react'

interface TicketDetailModalProps {
  ticket: {
    id: string
    event_name: string
    event_date: string
    venue: string
    status: string
    owner_wallet?: string
    authorized_by?: string
    token_id?: string
  }
  onClose: () => void
  onActivate?: () => void
}

export function TicketDetailModal({ ticket, onClose, onActivate }: TicketDetailModalProps) {
  const [isActivating, setIsActivating] = useState(false)

  const handleActivate = async () => {
    setIsActivating(true)
    try {
      if (onActivate) {
        await onActivate()
      }
    } finally {
      setIsActivating(false)
    }
  }

  // Generate barcode-like visualization
  const barcodePattern = Array.from({ length: 40 }, () => Math.random() > 0.5 ? 'h-full' : 'h-3/4')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-[#161D14] border border-[#2a3528] rounded-2xl overflow-hidden">
          {/* Header with close and actions */}
          <div className="flex items-center justify-between p-4 border-b border-[#2a3528]">
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#2a3528] flex items-center justify-center text-muted hover:text-foreground transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 rounded-full bg-[#2a3528] flex items-center justify-center text-muted hover:text-foreground transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
              <button className="w-8 h-8 rounded-full bg-[#2a3528] flex items-center justify-center text-muted hover:text-foreground transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Authorized by */}
            <div className="mb-4">
              <p className="text-[10px] text-muted uppercase tracking-widest mb-1">AUTHORIZED BY</p>
              <p className="text-primary font-bold text-sm" style={{ fontFamily: 'var(--font-climate)' }}>
                {ticket.authorized_by || 'NEONSYNDICATES'}
              </p>
            </div>

            {/* Event name */}
            <div className="mb-6">
              <p className="text-[10px] text-muted uppercase tracking-widest mb-1">EVENT</p>
              <h2 className="text-3xl font-bold text-primary leading-tight" style={{ fontFamily: 'var(--font-climate)' }}>
                {ticket.event_name}
              </h2>
            </div>

            {/* Owner and ID */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-[10px] text-muted uppercase tracking-widest mb-1">OWNER</p>
                <p className="text-sm font-mono text-foreground">
                  {ticket.owner_wallet ? `${ticket.owner_wallet.slice(0, 4)}...${ticket.owner_wallet.slice(-4)}` : '0x82...F91A'}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-muted uppercase tracking-widest mb-1">ID</p>
                <p className="text-xl font-bold text-primary">#{ticket.token_id || '8812'}</p>
              </div>
            </div>

            {/* QR Code placeholder */}
            <div className="bg-[#0E150C] border border-[#2a3528] rounded-xl p-4 mb-6 flex items-center justify-center">
              <div className="w-24 h-24 bg-primary/10 rounded-lg flex items-center justify-center">
                <svg className="w-16 h-16 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="3" height="3" />
                  <rect x="18" y="14" width="3" height="3" />
                  <rect x="14" y="18" width="3" height="3" />
                  <rect x="18" y="18" width="3" height="3" />
                </svg>
              </div>
            </div>

            {/* Barcode visualization */}
            <div className="flex items-end justify-center gap-[2px] h-12 mb-2">
              {barcodePattern.map((height, i) => (
                <div
                  key={i}
                  className={`w-1 bg-primary ${height}`}
                  style={{ opacity: 0.6 + Math.random() * 0.4 }}
                />
              ))}
            </div>

            {/* Date */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-[10px] text-muted uppercase tracking-widest">FECHA</p>
              <p className="text-lg font-bold text-primary" style={{ fontFamily: 'var(--font-grotesk)' }}>
                {new Date(ticket.event_date).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}
              </p>
            </div>

            {/* Activate button */}
            {ticket.status === 'active' && (
              <button
                onClick={handleActivate}
                disabled={isActivating}
                className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl text-sm uppercase tracking-wide hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {isActivating ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    ACTIVATING...
                  </span>
                ) : (
                  'ACTIVATE ACCESS KEY'
                )}
              </button>
            )}

            {ticket.status === 'checked_in' && (
              <div className="w-full py-4 bg-[#2a3528] text-primary font-bold rounded-xl text-sm uppercase tracking-wide text-center">
                CHECKED IN
              </div>
            )}

            {ticket.status === 'used' && (
              <div className="w-full py-4 bg-[#2a3528] text-muted font-bold rounded-xl text-sm uppercase tracking-wide text-center">
                TICKET USED
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
