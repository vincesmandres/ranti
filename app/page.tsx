'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Header from '@/components/header'
import Hero from '@/components/hero'
import Features from '@/components/features'
import Events from '@/components/events'
import Protocol from '@/components/protocol'
import Footer from '@/components/footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Features />
      <Events />
      <Protocol />
      <Footer />
    </main>
  )
}
