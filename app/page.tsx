'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-background" style={{ background: 'radial-gradient(64.03% 80.04% at 50% 50%, rgba(139, 230, 85, 0.05) 0%, #0E150C 70%), #0E150C' }}>
      {/* Header */}
      <header className="border-b border-border p-6 flex items-center justify-between relative z-50">
        <div className="flex items-center gap-8">
          <h1 className="text-4xl font-bold text-primary" style={{ fontFamily: 'Climate Crisis' }}>R</h1>
          <nav className="flex items-center gap-8 text-sm">
            <a href="#eventos" className="text-muted hover:text-foreground transition-colors uppercase tracking-wide font-bold">Eventos</a>
            <a href="#protocolo" className="text-muted hover:text-foreground transition-colors uppercase tracking-wide font-bold">Protocolo</a>
            <a href="#about" className="text-muted hover:text-foreground transition-colors uppercase tracking-wide font-bold">Acerca de</a>
          </nav>
        </div>
        <Link href="/login" className="px-6 py-2 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-colors text-sm">
          LOGIN
        </Link>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-80px)] flex items-center justify-center overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-primary/5 to-secondary/5 blur-3xl rounded-full"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-tl from-secondary/5 to-primary/5 blur-3xl rounded-full"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-8 text-center">
          <div className="mb-6 inline-block">
            <div className="flex items-center gap-3 bg-card border border-border rounded-full px-4 py-2">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
              <span className="text-xs font-bold tracking-widest text-accent uppercase">Protocol Live</span>
            </div>
          </div>

          <h1 className="text-8xl font-bold text-primary mb-6 leading-tight" style={{ fontFamily: 'Climate Crisis' }}>
            Texto 1
          </h1>

          <p className="text-2xl text-muted mb-12 max-w-2xl mx-auto leading-relaxed">
            Liquid tickets y reputación verificada para eventos premium en Solana
          </p>

          <div className="flex gap-4 justify-center mb-16">
            <Link href="/role-selector" className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-colors text-lg">
              Comenzar Ahora
            </Link>
            <button className="px-8 py-4 border-2 border-primary text-primary font-bold rounded-lg hover:bg-primary/10 transition-colors text-lg">
              Aprender Más
            </button>
          </div>

          {/* Events Preview */}
          <div id="eventos" className="pt-16">
            <h2 className="text-3xl font-bold text-foreground mb-12" style={{ fontFamily: 'Climate Crisis' }}>
              EVENTOS
            </h2>
            <div className="grid grid-cols-3 gap-6">
              {[1, 2, 3].map((event) => (
                <div key={event} className="group">
                  <div className="relative overflow-hidden rounded-2xl bg-card border border-border aspect-video mb-4 hover:border-primary/50 transition-all">
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 via-secondary/10 to-transparent flex items-center justify-center">
                      <div className="text-6xl opacity-30">🎟️</div>
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all"></div>
                  </div>
                  <h3 className="text-lg font-bold text-foreground" style={{ fontFamily: 'Climate Crisis' }}>
                    Evento {event}
                  </h3>
                  <p className="text-sm text-muted mt-2">Premium experience on Solana</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Protocol Section */}
      <section id="protocolo" className="relative py-24 px-8 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-primary mb-16 text-center" style={{ fontFamily: 'Climate Crisis' }}>
            PROTOCOLO
          </h2>

          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div className="bg-card border border-border rounded-2xl p-12">
              <h3 className="text-2xl font-bold text-primary mb-4" style={{ fontFamily: 'Climate Crisis' }}>
                ORGANIZADOR
              </h3>
              <ul className="space-y-3 text-muted">
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">✓</span>
                  <span>Crear eventos premium verificados</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">✓</span>
                  <span>Gestionar asistentes y reputación</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">✓</span>
                  <span>Emitir tickets líquidos NFT</span>
                </li>
              </ul>
            </div>

            <div className="bg-card border border-border rounded-2xl p-12">
              <h3 className="text-2xl font-bold text-secondary mb-4" style={{ fontFamily: 'Climate Crisis' }}>
                ASISTENTE
              </h3>
              <ul className="space-y-3 text-muted">
                <li className="flex items-start gap-3">
                  <span className="text-secondary mt-1">✓</span>
                  <span>Acceder a eventos verificados</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-secondary mt-1">✓</span>
                  <span>Comprar y revender tickets</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-secondary mt-1">✓</span>
                  <span>Construir reputación en el protocolo</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-8 bg-card/50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6 text-xs text-muted">
            <span className="font-bold uppercase tracking-wide">© 2024 RANTI</span>
            <span>•</span>
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <span>•</span>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted">
            <span className="text-primary font-bold">RANTI</span>
            <span>•</span>
            <span className="text-secondary font-bold">PROTOCOL</span>
            <span>•</span>
            <span className="text-primary font-bold">v1.0</span>
          </div>
        </div>
      </footer>
    </main>
  )
}

