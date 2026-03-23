'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative py-20 md:py-32 bg-gradient-to-br from-background via-white to-secondary/20 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-block px-4 py-2 bg-primary/10 rounded-full">
              <span className="text-primary text-sm font-semibold">LUMINOUS PROTOCOL</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
              Liquid Tickets for 
              <span className="block text-primary">High-End Events</span>
            </h1>
            
            <p className="text-lg text-foreground/70 max-w-xl">
              Experience verified reputation and secure access on Solana. 
              Create, manage, or explore events with liquid NFT tickets.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white" asChild>
                <Link href="/events">Explore Events</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/create">Create Event</Link>
              </Button>
            </div>
          </div>
          
          <div className="relative h-96 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl border border-primary/20 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="text-6xl font-bold text-primary">⚡</div>
              <p className="text-foreground font-semibold">Live Network Status</p>
              <p className="text-primary text-2xl font-bold">2,401 TPS</p>
              <p className="text-foreground/60 text-sm">Solana Mainnet Active</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
