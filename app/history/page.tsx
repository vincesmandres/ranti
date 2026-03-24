'use client'

import { useEffect, useState } from 'react'
import { AuthLayout } from '@/components/layouts/auth-layout'
import { ActivityTimeline, type ActivityItem } from '@/components/ui/activity-timeline'

function formatTime(iso: string) {
  try {
    const d = new Date(iso)
    const now = Date.now()
    const diff = now - d.getTime()
    const mins = Math.floor(diff / 60000)
    const hrs = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    if (mins < 1) return 'ahora'
    if (mins < 60) return `hace ${mins} min`
    if (hrs < 24) return `hace ${hrs} h`
    if (days < 7) return `hace ${days} d`
    return d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short' })
  } catch {
    return ''
  }
}

function mapRowToItem(row: {
  id: string
  type: string
  title: string
  description?: string | null
  created_at: string
}): ActivityItem {
  const t = (row.type || '').toLowerCase()
  let kind: ActivityItem['type'] = 'system'
  if (t === 'check_in' || t === 'check-in') kind = 'check-in'
  else if (t === 'mint') kind = 'mint'
  else if (t === 'transfer') kind = 'transfer'
  else if (t === 'reward') kind = 'reward'
  else if (t === 'verification' || t === 'phone') kind = 'verification'

  return {
    id: row.id,
    type: kind,
    title: row.title || 'Actividad',
    description: row.description || undefined,
    timestamp: formatTime(row.created_at),
    status: 'success',
  }
}

export default function HistoryPage() {
  const [items, setItems] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/history')
        if (!res.ok) {
          setError('No se pudo cargar el historial')
          return
        }
        const json = await res.json()
        const rows = json?.data?.activity || []
        setItems(rows.map(mapRowToItem))
      } catch {
        setError('Error de red')
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [])

  return (
    <AuthLayout>
      <div className="p-4 md:p-6 lg:p-8 max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'var(--font-climate)' }}>
            Historial
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Participación verificada y continuidad después del check-in (sesión + registro en Ranti).
          </p>
        </div>

        <div className="bg-surface-container-low border border-border rounded-2xl p-4 md:p-6">
          {loading ? (
            <p className="text-sm text-muted-foreground py-8 text-center">Cargando…</p>
          ) : error ? (
            <p className="text-sm text-destructive py-8 text-center">{error}</p>
          ) : items.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">
              Aún no hay actividad. Haz check-in en un ticket para generar la primera prueba de participación.
            </p>
          ) : (
            <ActivityTimeline items={items} />
          )}
        </div>
      </div>
    </AuthLayout>
  )
}
