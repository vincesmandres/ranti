'use client'

import Link from 'next/link'
import { useState } from 'react'

const rewards = [
  { id: 1, name: 'OG Collector', status: 'Active', icon: 'T' },
  { id: 2, name: 'Genesis Mint', status: 'Check-in Verified', icon: 'G' },
  { id: 3, name: 'Lollapalooza 2024', status: 'Your Reputation', icon: 'L' },
  { id: 4, name: 'Early Adopter', status: 'Season 1 Rare', icon: 'E' },
]

const tickets = [
  { id: 1, name: 'CYBERPUNK NIGHTS', venue: 'NEON DISTRICT HUB', date: 'OCT 24', year: '2024', status: 'Active' },
  { id: 2, name: 'SOLANA BREAKPOINT', venue: 'CONVENTION CENTER', date: 'NOV 12', year: '2024', status: 'Active' },
  { id: 3, name: 'SUMMER ROOFTOP', venue: 'SKY GARDEN', date: 'AUG 15', year: '2024', status: 'Used' },
]

const activityLog = [
  { time: '10:44:21', type: 'SYS', message: 'Connecting to mainnet-beta...' },
  { time: '10:44:22', type: 'RPC', message: 'Handshake established with validator pool.' },
  { time: '10:44:23', type: 'TX', message: 'Constructing Transaction: Mint_Protocol_V3' },
  { time: '10:44:23', type: 'TX', message: 'Allocating 0.00203 SOL for storage rent.' },
  { time: '10:44:24', type: 'SIG', message: 'User signature requested...' },
]

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-bold text-primary" style={{ fontFamily: 'var(--font-climate)' }}>RANTI</h1>
          <nav className="flex items-center gap-6 text-sm">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`uppercase tracking-wide font-bold transition-colors ${activeTab === 'dashboard' ? 'text-primary' : 'text-muted hover:text-foreground'}`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('eventos')}
              className={`uppercase tracking-wide font-bold transition-colors ${activeTab === 'eventos' ? 'text-primary' : 'text-muted hover:text-foreground'}`}
            >
              Eventos
            </button>
            <Link href="/marketplace" className="uppercase tracking-wide font-bold text-muted hover:text-foreground transition-colors">
              Marketplace
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-4 py-2">
            <div className="w-6 h-6 bg-gradient-to-br from-primary to-secondary rounded-full"></div>
            <span className="text-sm font-bold text-foreground">phantom_hd_88x</span>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Left Sidebar */}
        <aside className="w-80 border-r border-border p-6 min-h-[calc(100vh-73px)]">
          {/* Balance */}
          <div className="mb-8">
            <p className="text-xs text-muted uppercase tracking-wide mb-2">Puntaje de Participacion</p>
            <div className="flex items-baseline gap-2">
              <span className="text-6xl font-bold text-primary" style={{ fontFamily: 'var(--font-grotesk)' }}>2,840</span>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <span className="text-xs text-muted">Nivel:</span>
              <span className="text-xs font-bold text-foreground">Protocol Level 4</span>
              <span className="text-xs text-muted">92% al Siguiente Rango</span>
            </div>
            <div className="mt-2 h-1 bg-card rounded-full overflow-hidden">
              <div className="h-full w-[92%] bg-gradient-to-r from-primary to-secondary rounded-full"></div>
            </div>
          </div>

          {/* Rewards */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">Rewards</h3>
              <span className="text-xs text-primary">On-chain Activity</span>
            </div>
            <div className="space-y-3">
              {rewards.map((reward) => (
                <div key={reward.id} className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg hover:border-primary/30 transition-colors">
                  <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center text-primary font-bold text-sm">
                    {reward.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-foreground">{reward.name}</p>
                    <p className="text-xs text-muted">{reward.status}</p>
                  </div>
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-bold rounded">Active</span>
                </div>
              ))}
            </div>
          </div>

          {/* On-chain Activity */}
          <div>
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wide mb-4">On-chain Activity</h3>
            <div className="bg-card border border-border rounded-lg p-4 font-mono text-xs space-y-2 max-h-48 overflow-y-auto">
              {activityLog.map((log, index) => (
                <div key={index} className="flex gap-2">
                  <span className="text-muted">{log.time}</span>
                  <span className="text-secondary">[{log.type}]</span>
                  <span className="text-foreground/80">{log.message}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-primary" style={{ fontFamily: 'var(--font-climate)' }}>Mis Tickets</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted">Operator_0x1</span>
            </div>
          </div>

          {/* Tickets Grid */}
          <div className="grid grid-cols-3 gap-6 mb-12">
            {tickets.map((ticket) => (
              <Link 
                key={ticket.id} 
                href={`/inventory?ticket=${ticket.id}`}
                className="group"
              >
                <div className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all">
                  <div className="aspect-[4/3] bg-gradient-to-br from-primary/20 via-secondary/10 to-transparent relative">
                    <div className="absolute top-4 right-4">
                      <span className={`px-2 py-1 text-xs font-bold rounded ${ticket.status === 'Active' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                        {ticket.status}
                      </span>
                    </div>
                    <div className="absolute bottom-4 right-4 text-right">
                      <p className="text-2xl font-bold text-primary">{ticket.date}</p>
                      <p className="text-sm text-muted">{ticket.year}</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-primary mb-1" style={{ fontFamily: 'var(--font-climate)' }}>
                      {ticket.name}
                    </h3>
                    <p className="text-xs text-muted uppercase tracking-wide">{ticket.venue}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Upcoming Events */}
          <div>
            <h3 className="text-xl font-bold text-foreground mb-6" style={{ fontFamily: 'var(--font-climate)' }}>Proximos Eventos</h3>
            <div className="grid grid-cols-3 gap-4">
              {['Retrowave Expo', 'Zen Garden', 'Hacker House'].map((event, index) => (
                <div key={index} className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-colors">
                  <p className="text-sm font-bold text-foreground mb-1">{event}</p>
                  <p className="text-xs text-muted">
                    {index === 0 ? 'Nov 12, 2024' : index === 1 ? 'Dec 05, 2024' : 'Dec 15, 2024'}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <Link 
              href="/marketplace"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-colors"
            >
              Redimir Nuevo Ticket
            </Link>
          </div>
        </main>
      </div>
    </main>
  )
}
