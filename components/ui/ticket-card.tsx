'use client'

import { cn } from "@/lib/utils"
import Link from "next/link"
import { StatusPill } from "./status-pill"

export interface TicketData {
  id: string
  name: string
  venue: string
  date: string
  year: string
  status: 'active' | 'used' | 'pending'
  imageUrl?: string
}

interface TicketCardProps {
  ticket: TicketData
  href?: string
  onClick?: () => void
  className?: string
}

export function TicketCard({ ticket, href, onClick, className }: TicketCardProps) {
  const isActive = ticket.status === 'active'
  const bgColor = isActive ? '#B8FF8C' : '#161D14'
  const fgColor = isActive ? '#143800' : ticket.status === 'used' ? '#8A947F' : '#DDE5D5'

  const content = (
    <div
      className={cn(
        "rounded-xl overflow-hidden transition-all hover:scale-[1.02] relative group",
        !isActive && ticket.status === 'used' && "opacity-60 grayscale",
        className
      )}
      style={{ background: bgColor }}
    >
      <div className="p-5">
        {/* Top row */}
        <div className="flex justify-between items-start mb-6">
          <StatusPill variant={ticket.status === 'active' ? 'active' : ticket.status === 'pending' ? 'pending' : 'used'}>
            {ticket.status.toUpperCase()}
          </StatusPill>
          <div className="text-right">
            <p className="text-xs font-bold uppercase" style={{ fontFamily: 'var(--font-grotesk)', color: fgColor }}>
              {ticket.date}
            </p>
            <p className="text-lg font-black leading-none" style={{ fontFamily: 'var(--font-grotesk)', color: fgColor }}>
              {ticket.year}
            </p>
          </div>
        </div>

        {/* Title */}
        <h3
          className="text-xl uppercase leading-tight mb-4 whitespace-pre-line"
          style={{ fontFamily: 'var(--font-climate)', color: fgColor }}
        >
          {ticket.name}
        </h3>

        {/* Bottom row */}
        <div className="flex justify-between items-end pt-3 mt-6" style={{ borderTop: `1px solid ${fgColor}20` }}>
          <div>
            <p className="text-[9px] uppercase font-bold tracking-widest opacity-60" style={{ color: fgColor }}>
              Venue
            </p>
            <p className="text-xs font-bold" style={{ fontFamily: 'var(--font-grotesk)', color: fgColor }}>
              {ticket.venue}
            </p>
          </div>
          {/* QR Icon */}
          <div
            className="w-10 h-10 flex items-center justify-center rounded"
            style={{ background: isActive ? '#14380010' : '#B8FF8C10' }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={fgColor} strokeWidth="1.5">
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
      </div>
      {/* Decorative Notches */}
      <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-background rounded-full" />
      <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-background rounded-full" />
    </div>
  )

  if (href) {
    return <Link href={href}>{content}</Link>
  }

  if (onClick) {
    return <button onClick={onClick} className="w-full text-left">{content}</button>
  }

  return content
}
