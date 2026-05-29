-- 1. Add availability column to tutor_profiles
ALTER TABLE public.tutor_profiles 
ADD COLUMN IF NOT EXISTS availability JSONB DEFAULT '{}'::jsonb;

-- 2. Add parent_name to reviews
ALTER TABLE public.reviews
ADD COLUMN IF NOT EXISTS parent_name TEXT;

-- 3. Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  sender_name TEXT,
  sender_role TEXT,
  receiver_name TEXT,
  receiver_role TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read their own messages" ON public.messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Users can insert messages" ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
