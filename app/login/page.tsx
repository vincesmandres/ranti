'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'radial-gradient(64.03% 80.04% at 50% 50%, rgba(139, 230, 85, 0.05) 0%, #0E150C 70%), #0E150C' }}>
      <div className="max-w-md w-full mx-4">
        <div className="bg-card border border-border rounded-2xl p-8 relative">
          {/* Overlay blur effect */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 -translate-y-1/2 left-0 w-96 h-96 bg-gradient-to-r from-primary/10 to-transparent blur-3xl rounded-full"></div>
          </div>

          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-1 bg-primary"></div>
              <h2 className="text-xs font-bold tracking-widest text-accent uppercase">ACCESS PROTOCOL</h2>
            </div>

            {/* Title */}
            <h1 className="text-5xl font-bold text-primary mb-4" style={{ fontFamily: 'Climate Crisis' }}>
              UNLOCK PROTOCOL
            </h1>

            {/* Description */}
            <p className="text-muted text-base mb-8">
              Ingresa a tu cuenta para acceder a eventos verificados en Solana
            </p>

            {/* Form */}
            <form className="space-y-6">
              {/* Email/Usuario */}
              <div>
                <label className="block text-xs font-semibold text-muted mb-2 uppercase tracking-wide">Usuario o Email</label>
                <input
                  type="text"
                  placeholder="tu_usuario@ranti.com"
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-muted mb-2 uppercase tracking-wide">Contraseña</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Submit Button */}
              <div className="relative pt-2">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-20 blur-sm rounded-lg"></div>
                <Link
                  href="/role-selector"
                  className="relative w-full block text-center px-6 py-4 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-colors"
                  style={{ fontFamily: 'Space Grotesk' }}
                >
                  VERIFY & ENTER
                </Link>
              </div>
            </form>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-border flex items-center justify-between text-xs">
              <Link href="/role-selector" className="text-accent hover:text-primary transition-colors font-bold uppercase tracking-wide">
                ¿No tienes cuenta?
              </Link>
              <span className="text-muted/40">
                <span className="text-primary font-bold">RANTI</span> • <span className="text-secondary">PROTOCOL</span> • <span className="text-primary">v1.0</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
