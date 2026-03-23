-- Create profiles table for user data
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  wallet_address TEXT UNIQUE,
  phone_number TEXT,
  phone_verified BOOLEAN DEFAULT FALSE,
  role TEXT CHECK (role IN ('asistente', 'organizador')) DEFAULT 'asistente',
  display_name TEXT,
  avatar_url TEXT,
  participation_score INTEGER DEFAULT 0,
  protocol_level INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create tickets table
CREATE TABLE IF NOT EXISTS public.tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_name TEXT NOT NULL,
  event_venue TEXT,
  event_date DATE NOT NULL,
  status TEXT CHECK (status IN ('active', 'used', 'expired', 'transferred')) DEFAULT 'active',
  mint_address TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create events table
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  venue TEXT,
  event_date TIMESTAMPTZ NOT NULL,
  max_capacity INTEGER,
  ticket_price NUMERIC(10, 2),
  logo_url TEXT,
  status TEXT CHECK (status IN ('draft', 'active', 'past', 'cancelled')) DEFAULT 'draft',
  mint_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create check_ins table
CREATE TABLE IF NOT EXISTS public.check_ins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  checked_in_at TIMESTAMPTZ DEFAULT NOW(),
  tx_signature TEXT,
  metadata JSONB DEFAULT '{}'
);

-- Create rewards table
CREATE TABLE IF NOT EXISTS public.rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reward_type TEXT NOT NULL,
  reward_name TEXT NOT NULL,
  description TEXT,
  points INTEGER DEFAULT 0,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

-- Create activity_log table
CREATE TABLE IF NOT EXISTS public.activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  description TEXT,
  tx_signature TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.check_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Tickets policies
CREATE POLICY "tickets_select_own" ON public.tickets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "tickets_insert_own" ON public.tickets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "tickets_update_own" ON public.tickets FOR UPDATE USING (auth.uid() = user_id);

-- Events policies (organizers can manage their events, everyone can view active)
CREATE POLICY "events_select_all" ON public.events FOR SELECT USING (status = 'active' OR auth.uid() = organizer_id);
CREATE POLICY "events_insert_organizer" ON public.events FOR INSERT WITH CHECK (auth.uid() = organizer_id);
CREATE POLICY "events_update_organizer" ON public.events FOR UPDATE USING (auth.uid() = organizer_id);

-- Check-ins policies
CREATE POLICY "check_ins_select_own" ON public.check_ins FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "check_ins_insert_own" ON public.check_ins FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Rewards policies
CREATE POLICY "rewards_select_own" ON public.rewards FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "rewards_insert_own" ON public.rewards FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Activity log policies
CREATE POLICY "activity_select_own" ON public.activity_log FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "activity_insert_own" ON public.activity_log FOR INSERT WITH CHECK (auth.uid() = user_id);
