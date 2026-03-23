'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { AuthLayout } from '@/components/layouts/auth-layout'
import { StatusPill } from '@/components/ui/status-pill'
import { ActionCTA } from '@/components/ui/action-cta'

// Mock data - in production this would come from an API
const ticketData = {
  id: '1',
  name: 'CYBERPUNK NIGHTS',
  venue: 'NEON DISTRICT HUB',
  date: 'OCT 24',
  year: '2024',
  status: 'active' as const,
  tokenId: '#0012',
  collection: 'NEON SYNDICATE',
  owner: '0x82...F91A',
}

export default function TicketDetailPage() {
  const params = useParams()

  return (
    <AuthLayout>
      <div className="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto">
        {/* Back */}
        <Link
          href="/tickets"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm">Back to Tickets</span>
        </Link>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Left - QR & Visual */}
          <div className="bg-surface-container-low border border-border rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <button className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-surface-container-high">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
              <button className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-surface-container-high">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
            </div>

            <div className="mb-4">
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">
                Collection by
              </p>
              <p className="text-sm font-bold text-secondary">{ticketData.collection}</p>
            </div>

            <h1 className="text-3xl font-bold text-primary mb-4" style={{ fontFamily: 'var(--font-climate)' }}>
              {ticketData.name}
            </h1>

            {/* QR Code placeholder */}
            <div className="bg-primary/10 border border-primary/30 rounded-xl p-8 flex items-center justify-center mb-4">
              <div className="w-32 h-32 bg-primary rounded-lg grid grid-cols-6 grid-rows-6 gap-1 p-2">
                {Array.from({ length: 36 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-sm"
                    style={{ background: [0,1,4,5,6,7,10,11,12,17,18,23,24,29,30,31,34,35].includes(i) ? '#143800' : 'transparent' }}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Token ID</p>
                <p className="text-sm font-bold text-foreground" style={{ fontFamily: 'var(--font-grotesk)' }}>
                  {ticketData.tokenId}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary" style={{ fontFamily: 'var(--font-climate)' }}>
                  {ticketData.date}
                </p>
                <p className="text-sm font-bold text-foreground">{ticketData.year}</p>
              </div>
            </div>
          </div>

          {/* Right - Details */}
          <div className="space-y-4">
            <div className="bg-surface-container-low border border-border rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-foreground uppercase tracking-widest">Status</h2>
                <StatusPill variant={ticketData.status}>{ticketData.status}</StatusPill>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Venue</p>
                  <p className="text-sm font-bold text-foreground">{ticketData.venue}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Owner</p>
                  <p className="text-sm font-bold text-foreground font-mono">{ticketData.owner}</p>
                </div>
              </div>
            </div>

            <ActionCTA
              href={`/check-in/success?ticket=${params.id}`}
              variant="primary"
              size="lg"
              className="w-full"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              }
              iconPosition="left"
            >
              Activate Access Key
            </ActionCTA>

            <ActionCTA
              href="https://solscan.io"
              variant="outline"
              size="md"
              className="w-full"
            >
              View on Solscan
            </ActionCTA>
          </div>
        </div>
      </div>
    </AuthLayout>
  )
}
