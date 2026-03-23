'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useState } from 'react'

interface AuthLayoutProps {
  children: React.ReactNode
}

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/eventos', label: 'Events' },
  { href: '/marketplace', label: 'Market' },
  { href: '/tickets', label: 'My Tickets' },
  { href: '/rewards', label: 'Rewards' },
]

export function AuthLayout({ children }: AuthLayoutProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Navigation */}
      <header className="border-b border-border px-4 md:px-6 h-14 flex items-center justify-between bg-background sticky top-0 z-50">
        {/* Logo + Brand */}
        <Link href="/dashboard" className="flex items-center gap-2 flex-shrink-0 hover:opacity-80 transition-opacity">
          <img src="/ranti-logo.svg" alt="Ranti" className="w-6 h-6" />
          <span className="text-sm font-bold text-primary tracking-widest hidden sm:block" style={{ fontFamily: 'var(--font-climate)' }}>
            RANTI
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors rounded-lg",
                  isActive
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-surface-container-high"
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Right side - User */}
        <div className="flex items-center gap-2">
          {/* Notification bell */}
          <button className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-surface-container-high">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>

          {/* User badge */}
          <div className="hidden sm:flex items-center gap-2 bg-surface-container-low border border-border rounded-lg px-3 py-1.5">
            <div className="w-5 h-5 bg-gradient-to-br from-primary to-secondary rounded-full" />
            <span className="text-xs font-bold text-foreground">phantom_hd</span>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-surface-container-high"
          >
            {mobileMenuOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-surface-container-low border-b border-border">
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "block px-4 py-3 text-sm font-bold uppercase tracking-widest transition-colors rounded-lg",
                    isActive
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-surface-container-high"
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1">{children}</main>
    </div>
  )
}
