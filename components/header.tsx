'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-border">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="font-bold text-2xl text-primary">
          RANTI
        </Link>
        
        <div className="flex items-center gap-8">
          <ul className="hidden md:flex gap-6 text-foreground">
            <li><Link href="#events" className="hover:text-primary transition">Events</Link></li>
            <li><Link href="#marketplace" className="hover:text-primary transition">Marketplace</Link></li>
            <li><Link href="#protocol" className="hover:text-primary transition">Protocol</Link></li>
          </ul>
          
          <div className="flex gap-3">
            <Button variant="outline" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button className="bg-primary hover:bg-primary/90 text-white" asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </nav>
    </header>
  )
}
