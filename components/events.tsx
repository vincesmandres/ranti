'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Events() {
  const events = [
    {
      title: "Evento 1",
      date: "24.05.24",
      tier: "Platinum",
      code: "RNT-992-01"
    },
    {
      title: "Evento 2",
      date: "12.06.24",
      tier: "Gold",
      code: "RNT-992-02"
    },
    {
      title: "Evento 3",
      date: "05.07.24",
      tier: "VIP",
      code: "RNT-992-03"
    }
  ]

  return (
    <section id="events" className="py-20 bg-gradient-to-br from-secondary/10 to-accent/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Upcoming Events
          </h2>
          <p className="text-lg text-foreground/60">
            Scroll to explore upcoming high-end events
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {events.map((event, i) => (
            <div key={i} className="bg-white rounded-xl border border-border overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-40 bg-gradient-to-br from-primary/30 to-accent/30 border-b border-border flex items-center justify-center">
                <div className="text-center">
                  <p className="text-sm text-primary font-semibold mb-2">{event.date}</p>
                  <p className="text-2xl font-bold text-foreground">{event.tier}</p>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-bold text-foreground">{event.title}</h3>
                <div className="bg-secondary/10 p-4 rounded-lg text-center">
                  <p className="text-xs text-foreground/60 mb-1">Reference</p>
                  <p className="font-mono font-bold text-primary">{event.code}</p>
                </div>
                <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
