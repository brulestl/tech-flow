import type { SupabaseClient } from '@supabase/supabase-js';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';

/**
 * Returns a do-nothing proxy so that any supabase.*
 * chain returns the same proxy or a resolved Promise({ data:[], error:null }).
 * Keeps UI functional without real creds.
 */
function createMock(): SupabaseClient<any, any, any> {
  const handler: ProxyHandler<any> = {
    get(_, prop) {
      // make .then undefined so React won't treat the proxy as a promise
      if (prop === 'then') return undefined;

      // common pattern: supabase.from('table')
      if (prop === 'from') {
        return () => createMock();
      }

      // leaf methods usually return a promise → resolve immediately
      return (...args) =>
        Promise.resolve({
          data: args.length > 0 && Array.isArray(args[0]) ? [] : null,
          error: null,
          count: 0,
        });
    },
  };
  return new Proxy({}, handler) as SupabaseClient<any, any, any>;
}

/** Browser helper – real client later, mock for now/SSR */
export const createBrowserClient = () => {
  if (typeof window === 'undefined') return createMock();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return createMock();

  return createBrowserSupabaseClient({ supabaseUrl: url, supabaseKey: key });
};

/** Server helper – mock until backend wiring day */
export const createServerClient = createMock;
