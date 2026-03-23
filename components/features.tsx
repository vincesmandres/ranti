'use client'

export default function Features() {
  const features = [
    {
      icon: "🔒",
      title: "SECURE",
      description: "Non-custodial and encrypted via Solana Protocol"
    },
    {
      icon: "🔐",
      title: "PRIVATE",
      description: "Your keys, your access. Complete control"
    },
    {
      icon: "⚡",
      title: "INSTANT",
      description: "Verified reputation and instant transactions"
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Why Choose Ranti
          </h2>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
            Built on Solana for speed, security, and transparency
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <div key={i} className="p-8 bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl border border-primary/10 hover:border-primary/30 transition">
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
              <p className="text-foreground/60">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
