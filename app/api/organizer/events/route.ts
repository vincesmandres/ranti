import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET all events for organizer
export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: events, error } = await supabase
      .from('events')
      .select('*')
      .eq('organizer_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ events })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST create new event
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, event_id, wallet_address, description, event_date, venue, max_capacity, image_url } = body

    // Validate required fields
    if (!name || !event_id) {
      return NextResponse.json({ error: 'Name and event ID are required' }, { status: 400 })
    }

    // Check if event_id already exists
    const { data: existingEvent } = await supabase
      .from('events')
      .select('id')
      .eq('event_id', event_id)
      .single()

    if (existingEvent) {
      return NextResponse.json({ error: 'Event ID already exists' }, { status: 400 })
    }

    // Create event
    const { data: event, error } = await supabase
      .from('events')
      .insert({
        organizer_id: user.id,
        name,
        event_id,
        description,
        event_date: event_date || new Date().toISOString(),
        venue: venue || 'TBD',
        max_capacity: max_capacity || 500,
        image_url,
        wallet_address: wallet_address || null,
        status: 'active'
      })
      .select()
      .single()

    if (error) {
      console.error('Create event error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Generate mock transaction data for success modal
    const transactionData = {
      user_signature: `0x${Array.from({ length: 8 }, () => Math.random().toString(16).slice(2, 6)).join('...')}`,
      organizer_signature: `0x${Array.from({ length: 8 }, () => Math.random().toString(16).slice(2, 6)).join('...')}`,
      asset_id: `RP-${Math.random().toString(36).slice(2, 6).toUpperCase()}-QLA-${Math.random().toString(36).slice(2, 6).toUpperCase()}-LM5-BB42`,
      transaction_hash: `0x${Array.from({ length: 12 }, () => Math.random().toString(16).slice(2, 4)).join('...')}`,
    }

    return NextResponse.json({ 
      event,
      transaction: transactionData,
      message: 'Event created successfully'
    })
  } catch (error) {
    console.error('Create event error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
