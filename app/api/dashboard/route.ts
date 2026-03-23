import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Fetch profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('Profile fetch error:', profileError)
    }

    // Fetch active tickets
    const { data: tickets, error: ticketsError } = await supabase
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

    if (ticketsError) {
      console.error('Tickets fetch error:', ticketsError)
    }

    // Fetch ticket history summary (last 5)
    const { data: ticketHistory, error: historyError } = await supabase
      .from('tickets')
      .select('id, status, created_at, events(name)')
      .eq('user_id', user.id)
      .in('status', ['checked_in', 'used', 'expired'])
      .order('created_at', { ascending: false })
      .limit(5)

    if (historyError) {
      console.error('History fetch error:', historyError)
    }

    // Fetch rewards summary
    const { data: rewards, error: rewardsError } = await supabase
      .from('rewards')
      .select('*')
      .eq('user_id', user.id)
      .order('unlocked_at', { ascending: false })

    if (rewardsError) {
      console.error('Rewards fetch error:', rewardsError)
    }

    // Fetch recent activity
    const { data: activity, error: activityError } = await supabase
      .from('activity_log')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10)

    if (activityError) {
      console.error('Activity fetch error:', activityError)
    }

    // Calculate participation score from rewards and check-ins
    const participationScore = profile?.participation_score || 0
    const level = Math.floor(participationScore / 1000) + 1
    const progress = (participationScore % 1000) / 10 // Percentage to next level

    // Map ticket statuses
    const activeTickets = (tickets || []).filter(t => 
      ['issued', 'active', 'claimed'].includes(t.status)
    ).map(t => ({
      ...t,
      statusLabel: t.status === 'issued' ? 'ACTIVE' : t.status.toUpperCase(),
    }))

    const checkedInTickets = (tickets || []).filter(t => 
      t.status === 'checked_in'
    )

    const usedTickets = (tickets || []).filter(t => 
      ['used', 'expired', 'completed', 'rewarded'].includes(t.status)
    )

    // Rewards summary
    const unlockedRewards = (rewards || []).filter(r => r.unlocked)
    const lockedRewards = (rewards || []).filter(r => !r.unlocked)

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          walletAddress: profile?.wallet_address,
          displayName: profile?.display_name || profile?.wallet_address?.slice(0, 8) || 'User',
        },
        profile: {
          ...profile,
          phoneVerified: profile?.phone_verified || false,
          phone: profile?.phone ? `***${profile.phone.slice(-4)}` : null,
        },
        participation: {
          score: participationScore,
          level,
          progress,
          nextLevelAt: level * 1000,
        },
        tickets: {
          active: activeTickets,
          checkedIn: checkedInTickets,
          used: usedTickets,
          total: tickets?.length || 0,
        },
        ticketHistory: ticketHistory || [],
        rewards: {
          unlocked: unlockedRewards,
          locked: lockedRewards,
          total: rewards?.length || 0,
        },
        activity: activity || [],
      },
    })
  } catch (error) {
    console.error('Dashboard data error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
