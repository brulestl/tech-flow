import { createClient as createBrowserSupabaseClient } from '@supabase/supabase-js';
import { createServerClient as createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const createBrowserClient = () =>
  createBrowserSupabaseClient({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL!,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY!,
  });

export const createServerClient = () => {
  // Ensure we have cookie store access
  const cookieStore = cookies();
  
  return createServerSupabaseClient({
    supabaseUrl: process.env.SUPABASE_URL!,
    supabaseKey: process.env.SUPABASE_ANON_KEY!,
    cookies: () => cookieStore,
  });
};
