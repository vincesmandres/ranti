'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Protocol() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Verified Status
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 pt-8">
            <div className="p-8 bg-gradient-to-br from-primary/10 to-transparent rounded-xl border border-primary/20">
              <div className="text-4xl mb-4">👤</div>
              <h3 className="text-xl font-bold text-foreground mb-2">ASISTENTE</h3>
              <p className="text-foreground/60 mb-6">
                Explora eventos, asegura tus accesos y construye tu reputación.
              </p>
              <Button className="w-full bg-primary hover:bg-primary/90 text-white" asChild>
                <Link href="/login?role=asistente">Entrar como usuario</Link>
              </Button>
            </div>

            <div className="p-8 bg-gradient-to-br from-accent/10 to-transparent rounded-xl border border-accent/20">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-foreground mb-2">ORGANIZADOR</h3>
              <p className="text-foreground/60 mb-6">
                Crea eventos, gestiona tickets y analiza métricas de lealtad.
              </p>
              <Button className="w-full bg-accent hover:bg-accent/90 text-white" asChild>
                <Link href="/login?role=organizador">Entrar como gestor</Link>
              </Button>
            </div>
          </div>

          <div className="pt-8 text-foreground/60 text-sm">
            <p>Built on Solana | Non-custodial Protocol</p>
          </div>
        </div>
      </div>
    </section>
  )
}
