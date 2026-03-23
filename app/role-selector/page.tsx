'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RoleSelectorPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: 'radial-gradient(64.03% 80.04% at 50% 50%, rgba(139, 230, 85, 0.05) 0%, #0E150C 70%), #0E150C' }}>
      {/* Header */}
      <div className="absolute top-8 left-8">
        <Link href="/" className="text-foreground hover:text-primary transition-colors font-bold text-2xl" style={{ fontFamily: 'Climate Crisis' }}>
          R
        </Link>
      </div>

      <div className="max-w-4xl w-full mx-4 text-center">
        {/* Title */}
        <div className="mb-16">
          <h1 className="text-7xl font-bold text-primary mb-4" style={{ fontFamily: 'Climate Crisis' }}>
            ELIGE TU ROL
          </h1>
          <p className="text-lg text-muted">
            Selecciona cómo deseas participar en eventos Ranti
          </p>
        </div>

        {/* Roles Grid */}
        <div className="grid md:grid-cols-2 gap-12 mb-12">
          {/* ORGANIZADOR */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent blur-xl rounded-2xl group-hover:blur-2xl transition-all duration-300"></div>
            <div className="relative bg-card border border-border rounded-2xl p-12 hover:border-primary/50 transition-all cursor-pointer" onClick={() => router.push('/otp')}>
              <div className="mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-lg mx-auto mb-6 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary-foreground">📋</span>
                </div>
              </div>
              <h2 className="text-4xl font-bold text-foreground mb-4" style={{ fontFamily: 'Climate Crisis' }}>
                ORGANIZADOR
              </h2>
              <p className="text-muted text-base leading-relaxed mb-8">
                Crea eventos premium, gestiona asistentes, y construye comunidad verificada en Solana
              </p>
              <div className="flex items-center justify-center gap-2 text-accent font-bold uppercase text-sm">
                <span>Gestionar Eventos</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </div>

          {/* ASISTENTE */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-secondary/20 to-transparent blur-xl rounded-2xl group-hover:blur-2xl transition-all duration-300"></div>
            <div className="relative bg-card border border-border rounded-2xl p-12 hover:border-secondary/50 transition-all cursor-pointer" onClick={() => router.push('/otp')}>
              <div className="mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-secondary to-primary rounded-lg mx-auto mb-6 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary-foreground">🎟️</span>
                </div>
              </div>
              <h2 className="text-4xl font-bold text-foreground mb-4" style={{ fontFamily: 'Climate Crisis' }}>
                ASISTENTE
              </h2>
              <p className="text-muted text-base leading-relaxed mb-8">
                Accede a eventos verificados, compra tickets líquidos, y construye tu reputación
              </p>
              <div className="flex items-center justify-center gap-2 text-secondary font-bold uppercase text-sm">
                <span>Explorar Eventos</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-xs text-muted/60 space-y-2">
          <p className="uppercase tracking-wide font-bold">
            <span className="text-primary">RANTI PROTOCOL</span> • LIQUID TICKETS & VERIFIED REPUTATION
          </p>
          <p>© 2024 Ranti - Built on Solana</p>
        </div>
      </div>
    </div>
  )
}
