import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/server/auth'

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
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Get /api/tickets error:', error)
      return NextResponse.json({ error: 'Failed to fetch tickets' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: data || [],
      total: data?.length ?? 0,
    })
  } catch (error) {
    console.error('Get /api/tickets exception:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

