import type { Metadata } from 'next'
import { Climate_Crisis, Poppins, Space_Grotesk } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { RantiWalletProvider } from '@/lib/solana/wallet-provider'
import './globals.css'

const climateCrisis = Climate_Crisis({ subsets: ["latin"], weight: ["400"] });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: 'Ranti — Tickets that stay alive after check-in',
  description:
    'Smart ticketing and loyalty on Solana: verified check-in, rewards, badges, and participation history that compounds.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" style={{
      '--font-climate': climateCrisis.style.fontFamily,
      '--font-poppins': poppins.style.fontFamily,
      '--font-grotesk': spaceGrotesk.style.fontFamily,
    } as React.CSSProperties}>
      <body className="font-sans antialiased">
        <RantiWalletProvider>
          {children}
        </RantiWalletProvider>
        <Analytics />
      </body>
    </html>
  )
}
