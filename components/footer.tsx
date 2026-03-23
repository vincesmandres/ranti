'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-foreground text-white border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <p className="font-bold text-lg mb-4">Ranti</p>
            <p className="text-white/60 text-sm">Liquid tickets and verified reputation for high-end Solana events.</p>
          </div>

          <div>
            <p className="font-semibold mb-4">Product</p>
            <ul className="space-y-2 text-sm text-white/60">
              <li><Link href="#" className="hover:text-white transition">Events</Link></li>
              <li><Link href="#" className="hover:text-white transition">Marketplace</Link></li>
              <li><Link href="#" className="hover:text-white transition">My Tickets</Link></li>
            </ul>
          </div>

          <div>
            <p className="font-semibold mb-4">Protocol</p>
            <ul className="space-y-2 text-sm text-white/60">
              <li><Link href="#" className="hover:text-white transition">Documentation</Link></li>
              <li><Link href="#" className="hover:text-white transition">Protocol Activity</Link></li>
              <li><Link href="#" className="hover:text-white transition">Status</Link></li>
            </ul>
          </div>

          <div>
            <p className="font-semibold mb-4">Legal</p>
            <ul className="space-y-2 text-sm text-white/60">
              <li><Link href="#" className="hover:text-white transition">Privacy</Link></li>
              <li><Link href="#" className="hover:text-white transition">Terms</Link></li>
              <li><Link href="#" className="hover:text-white transition">Support</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-white/60">
          <p>© 2024 Ranti Protocol. Built on Solana.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="#" className="hover:text-white transition">Solscan</Link>
            <Link href="#" className="hover:text-white transition">GitHub</Link>
            <Link href="#" className="hover:text-white transition">Twitter</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
