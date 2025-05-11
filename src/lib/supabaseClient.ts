import type { SupabaseClient } from '@supabase/supabase-js';

type Ok<T = unknown> = Promise<{ data: T; error: null; count?: number }>;
const ok = <T = unknown>(data: T): Ok<T> => Promise.resolve({ data, error: null });

/* ------------------------------------------------------------------ */
/*  Create a no-op Storage mock so calls like supabase.storage.from() */
/*  won't throw.                                                      */
/* ------------------------------------------------------------------ */
const createStorageMock = () => ({
  from: () => ({
    upload: () => ok(null),
    download: () => ok(null),
    remove: () => ok(null),
    list: () => ok<any[]>([]),
    getPublicUrl: () => ({ data: { publicUrl: '' }, error: null }),
  }),
});

/* ------------------------------------------------------------------ */
/*  Main SupabaseClient mock                                          */
/* ------------------------------------------------------------------ */
function createMock(): SupabaseClient<any, any, any> {
  /* ------ auth sub-object expected by Auth-UI & helpers ------ */
  const auth = {
    getSession: () => ok<{ session: null }>({ session: null }),
    onAuthStateChange: (cb: any) => {
      cb('INITIAL_SESSION', { session: null });
      return ok({ subscription: { unsubscribe() {} } });
    },
    signInWithPassword: () => ok(null),
    signInWithOAuth: () => ok(null),
    signUp: () => ok(null),
    updateUser: () => ok(null),
    signOut: () => ok(null),
    /* add cheap stubs for any other auth method if needed */
  };

  /* ------ generic query builder (from, select, etc.) ------ */
  const handler: ProxyHandler<any> = {
    get(_target, prop) {
      if (prop === 'then') return undefined;  // Don't look like a Promise to React
      if (prop === 'auth') return auth;
      if (prop === 'storage') return createStorageMock;
      if (prop === 'channel') return () => ({ on: () => ({ subscribe: () => ({}) }) });
      if (prop === 'from' || prop === 'rpc') return () => new Proxy({}, handler);

      /* leaf methods commonly used in query chains */
      const leafMethods = [
        'select', 'insert', 'update', 'delete', 'upsert',
        'eq', 'neq', 'lt', 'lte', 'gt', 'gte',
        'like', 'ilike', 'order', 'limit', 'single',
        'maybeSingle', 'textSearch', 'in', 'contains',
      ];
      if (leafMethods.includes(String(prop))) return () => ok<any[]>([]);

      /* default fallback: return proxy again */
      return new Proxy({}, handler);
    },
  };

  // @ts-expect-error — proxy only pretends to be SupabaseClient
  return new Proxy({}, handler);
}

/* ------------------ export helpers ------------------ */
export const createBrowserClient = () => {
  if (typeof window === 'undefined') return createMock();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return createMock();

  const { createBrowserSupabaseClient } = require('@supabase/auth-helpers-nextjs');
  return createBrowserSupabaseClient({ supabaseUrl: url, supabaseKey: key });
};

export const createServerClient = createMock;
