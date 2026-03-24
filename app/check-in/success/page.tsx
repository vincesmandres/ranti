'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useWallet } from '@solana/wallet-adapter-react'
import { ActionCTA } from '@/components/ui/action-cta'
import { config } from '@/lib/config'

function CheckInSuccessContent() {
  const searchParams = useSearchParams()
  const ticketId = searchParams.get('t')
  const { publicKey } = useWallet()
  const network = config.solanaNetwork

  const walletShort = publicKey
    ? `${publicKey.toBase58().slice(0, 6)}…${publicKey.toBase58().slice(-4)}`
    : 'Wallet no conectada en esta vista'

  const attestationId =
    ticketId && publicKey
      ? `ranti-${ticketId.slice(0, 8)}-${publicKey.toBase58().slice(0, 4)}`
      : ticketId
        ? `ranti-${ticketId.slice(0, 8)}-session`
        : 'ranti-demo-session'

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="w-20 h-20 bg-primary/20 border-2 border-primary rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-primary mb-2 leading-tight" style={{ fontFamily: 'var(--font-climate)' }}>
          Check-in
          <br />
          confirmado
        </h1>

        <p className="text-sm text-muted-foreground mb-6">
          Tu asistencia quedó registrada. El ticket <span className="text-foreground font-semibold">sigue vivo</span>: ahora
          alimenta reputación, recompensas e historial en Ranti.
        </p>

        <div className="bg-surface-container-low border border-border rounded-2xl p-6 mb-6 text-left space-y-4">
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Capa verificada (demo)</p>
            <p className="text-sm font-bold text-foreground">
              Sesión + API (Supabase){' '}
              <span className="text-xs font-normal text-muted-foreground">— firma de wallet vinculada al perfil</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-sm font-bold text-primary">
              Red: {network === 'mainnet-beta' ? 'Solana Mainnet' : `Solana ${network}`}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Identidad (wallet)</p>
              <p className="text-xs font-mono text-foreground break-all">{walletShort}</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">ID de asistencia</p>
              <p className="text-xs font-mono text-primary break-all">{attestationId}</p>
            </div>
          </div>

          <div className="rounded-lg border border-dashed border-border bg-background/50 p-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
              Transacción on-chain del programa
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {config.features.onChainCheckIn
                ? 'Habilitada — el hash aparecerá aquí tras confirmar en wallet.'
                : 'Pendiente de integración del programa en devnet (roadmap). En demo, la verdad operativa es sesión + estado del ticket en backend.'}
            </p>
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Explorador</p>
              <p className="text-xs font-mono text-foreground truncate">Solscan ({network})</p>
            </div>
            <ActionCTA
              href={network === 'mainnet-beta' ? 'https://solscan.io' : 'https://solscan.io/?cluster=devnet'}
              variant="outline"
              size="sm"
            >
              Abrir
            </ActionCTA>
          </div>
        </div>

        <ActionCTA href="/dashboard" variant="primary" size="lg" className="w-full">
          Ver mi progreso
        </ActionCTA>

        <div className="mt-4 flex flex-col gap-2">
          <Link href="/rewards" className="text-xs font-bold text-primary hover:underline">
            Ir a recompensas →
          </Link>
          <Link href="/history" className="text-xs font-bold text-muted-foreground hover:text-primary">
            Ver historial de participación →
          </Link>
        </div>

        <p className="text-[10px] text-muted-foreground mt-6">Ranti · demo hackathon · {network}</p>
      </div>
    </main>
  )
}

export default function CheckInSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-background flex items-center justify-center p-4">
          <p className="text-sm text-muted-foreground">Cargando confirmación…</p>
        </main>
      }
    >
      <CheckInSuccessContent />
    </Suspense>
  )
}
