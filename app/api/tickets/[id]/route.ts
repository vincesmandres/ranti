import { NextRequest, NextResponse } from 'next/server'
import { requireUser } from '@/lib/server/auth'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
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
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error) {
    console.error('Get /api/tickets/[id] exception:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

