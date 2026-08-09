import { createClient } from '@supabase/supabase-js';
const supabase = createClient(
  process.env.VITE_NEXT_PUBLIC_SUPABASE_URL,
  process.env.VITE_NEXT_PUBLIC_SUPABASE_ANON_KEY
);