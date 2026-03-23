import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/server/auth'

const ACTIVE_STATES = ['issued', 'active', 'claimed', 'checked_in']

export async function GET() {
  try {
    const { supabase, user, response } = await requireUser()
    if (response || !user) return response

    const { data, error } = await supabase
      .from('tickets')
      .select(`
        *,
        events (
          id,
          name,
          slug,
          venue,
          date,
          cover_url
        )
      `)
      .eq('user_id', user.id)
      .in('status', ACTIVE_STATES)
      .order('created_at', { ascending: false })
      .limit(1)

    if (error) {
      console.error('Get /api/tickets/active error:', error)
      return NextResponse.json({ error: 'Failed to fetch active ticket' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: data?.[0] || null,
    })
  } catch (error) {
    console.error('Get /api/tickets/active exception:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

