'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface DashboardHeaderProps {
  username?: string
}

export default function DashboardHeader({ username = 'phantom_hd_88x' }: DashboardHeaderProps) {
  const pathname = usePathname()

  const navItems = [
    { label: 'DASHBOARD', href: '/dashboard' },
    { label: 'EVENTS', href: '/eventos' },
    { label: 'MARKET', href: '/marketplace' },
    { label: 'VERIFY', href: '/verify-phone' },
  ]

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  return (
    <header className="border-b border-border px-6 h-14 flex items-center justify-between bg-background sticky top-0 z-40">
      {/* Logo + Brand */}
      <Link href="/dashboard" className="flex items-center gap-2 flex-shrink-0 hover:opacity-80 transition-opacity">
        <img src="/ranti-logo.svg" alt="Ranti" className="w-6 h-6" />
        <span className="text-sm font-bold text-primary tracking-widest" style={{ fontFamily: 'var(--font-climate)' }}>RANTI</span>
      </Link>

      {/* Nav - centered */}
      <nav className="absolute left-1/2 -translate-x-1/2 flex items-center gap-8">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`text-xs font-bold tracking-widest transition-colors relative pb-1 ${
              isActive(item.href)
                ? 'text-foreground'
                : 'text-muted hover:text-foreground'
            }`}
          >
            {item.label}
            {isActive(item.href) && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </Link>
        ))}
      </nav>

      {/* Right: Connect Wallet or user badge */}
      <div className="flex items-center gap-3">
        {username ? (
          <>
            <div className="flex items-center gap-2 bg-[#161D14] border border-[#404A38]/30 rounded-lg px-3 py-1.5">
              <div className="w-5 h-5 bg-primary/30 border border-primary/50 rounded flex items-center justify-center">
                <div className="w-2 h-2 bg-primary rounded-sm" />
              </div>
              <span className="text-xs font-bold text-foreground">{username}</span>
            </div>
            <button className="w-8 h-8 flex items-center justify-center text-muted hover:text-foreground transition-colors rounded-lg hover:bg-[#1A2217]">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
          </>
        ) : (
          <Link
            href="/wallet-connect"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-[#143800] text-xs font-bold rounded-lg hover:bg-primary/90 transition-all hover:shadow-md hover:shadow-primary/20"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Connect Wallet
          </Link>
        )}
      </div>
    </header>
  )
}
