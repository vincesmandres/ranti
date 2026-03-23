import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/server/auth'

export async function GET() {
  try {
    const { supabase, user, response } = await requireUser()
    if (response || !user) return response

    const { data, error } = await supabase
      .from('attestations')
      .select('*')
      .eq('user_id', user.id)
      .in('status', ['pending', 'failed'])
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) {
      console.warn('Get pending attestations warning:', error.message)
      return NextResponse.json({
        success: true,
        data: [],
      })
    }

    return NextResponse.json({
      success: true,
      data: data || [],
    })
  } catch (error) {
    console.error('GET /api/attestations/pending exception:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

