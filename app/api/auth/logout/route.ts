import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * POST /api/auth/logout
 * Logs out the user by clearing session
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    await supabase.auth.signOut()

    const response = NextResponse.json({ success: true })

    // Clear auth cookies
    response.cookies.set('sb-access-token', '', { maxAge: 0 })
    response.cookies.set('sb-refresh-token', '', { maxAge: 0 })

    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    )
  }
}
