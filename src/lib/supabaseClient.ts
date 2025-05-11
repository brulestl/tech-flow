import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * A minimal "no-op" stub that satisfies TypeScript but
 * throws at runtime if you accidentally use it before wiring
 * real Supabase credentials.  Safe for static builds.
 */
function stub(): SupabaseClient<any, any, any> {
  const handler = {
    get() {
      throw new Error(
        'Supabase client has not been initialised. ' +
        'Add NEXT_PUBLIC_SUPABASE_URL & NEXT_PUBLIC_SUPABASE_ANON_KEY ' +
        'or replace stub() with createBrowserSupabaseClient().'
      );
    },
  };
  // @ts-expect-error – we knowingly return a Proxy that masquerades as SupabaseClient
  return new Proxy({}, handler);
}

/** Browser-side helper (returns stub during SSR/build) */
export const createBrowserClient = () => {
  if (typeof window === 'undefined') return stub();
  const url  = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return stub();
  const { createBrowserSupabaseClient } = require('@supabase/auth-helpers-nextjs');
  return createBrowserSupabaseClient({ supabaseUrl: url, supabaseKey: key });
};

/** Server helper (unused for now; returns stub) */
export const createServerClient = stub;
