import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch organizer profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    // Fetch events created by this organizer
    const { data: events } = await supabase
      .from('events')
      .select('*, tickets(count)')
      .eq('organizer_id', user.id)
      .order('event_date', { ascending: false })

    // Fetch community members (attendees of organizer's events)
    const { data: members } = await supabase
      .from('tickets')
      .select(`
        user_id,
        profiles!tickets_user_id_fkey(id, wallet_address, display_name),
        events!inner(organizer_id)
      `)
      .eq('events.organizer_id', user.id)
      .limit(50)

    // Calculate stats
    const totalEvents = events?.length || 0
    const activeEvents = events?.filter(e => new Date(e.event_date) >= new Date()).length || 0
    const totalTicketsSold = events?.reduce((acc, e) => acc + (e.tickets?.[0]?.count || 0), 0) || 0

    // Format members for display
    const formattedMembers = members?.reduce((acc: any[], ticket: any) => {
      const existingMember = acc.find(m => m.user_id === ticket.user_id)
      if (!existingMember && ticket.profiles) {
        acc.push({
          user_id: ticket.user_id,
          name: ticket.profiles.display_name || 'Anonymous',
          wallet: ticket.profiles.wallet_address 
            ? `${ticket.profiles.wallet_address.slice(0, 4)}...${ticket.profiles.wallet_address.slice(-4)}`
            : 'N/A',
          participation: Math.floor(Math.random() * 5) + 1, // TODO: Calculate real participation
          status: 'Verified'
        })
      }
      return acc
    }, []) || []

    // Format events for display
    const formattedEvents = events?.map(event => ({
      id: event.id,
      name: event.name,
      status: new Date(event.event_date) >= new Date() ? 'ACTIVE' : 'PAST',
      event_date: event.event_date,
      venue: event.venue,
      tickets_sold: event.tickets?.[0]?.count || 0,
      max_capacity: event.max_capacity || 500,
      image: event.image_url || '/placeholder.svg?height=120&width=200'
    })) || []

    return NextResponse.json({
      profile,
      events: formattedEvents,
      members: formattedMembers,
      stats: {
        totalEvents,
        activeEvents,
        totalTicketsSold,
        totalMembers: formattedMembers.length
      }
    })
  } catch (error) {
    console.error('Organizer API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
