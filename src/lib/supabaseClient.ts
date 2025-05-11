import type { SupabaseClient } from '@supabase/supabase-js';

/* ---------- helpers ---------- */
type Ok<T = unknown> = Promise<{ data: T; error: null }>;
const ok = <T = unknown>(data: T): Ok<T> => Promise.resolve({ data, error: null });

const noopSubscription = { unsubscribe() {} };
const syncOnAuthStateChange = (cb: any) => {
  // immediate callback so Auth-UI initialises
  cb('INITIAL_SESSION', { session: null });
  return { data: { subscription: noopSubscription }, error: null };
};

/* ---------- storage mock ---------- */
const createStorageMock = () => ({
  from: () => ({
    upload: () => ok(null),
    download: () => ok(null),
    remove: () => ok(null),
    list: () => ok<any[]>([]),
    getPublicUrl: () => ({ data: { publicUrl: '' }, error: null }),
  }),
});

/* ---------- SupabaseClient mock ---------- */
function createMock(): SupabaseClient<any, any, any> {
  const auth = {
    getSession: () => ok<{ session: null }>({ session: null }),
    onAuthStateChange: syncOnAuthStateChange,
    signInWithPassword: () => ok(null),
    signInWithOAuth: () => ok(null),
    signUp: () => ok(null),
    updateUser: () => ok(null),
    signOut: () => ok(null),
  };

  const handler: ProxyHandler<any> = {
    get(_t, prop) {
      if (prop === 'then') return undefined;                // not a Promise
      if (prop === 'auth') return auth;
      if (prop === 'storage') return createStorageMock;
      if (prop === 'channel')
        return () => ({ on: () => ({ subscribe: () => ({}) }) });
      if (prop === 'removeAllChannels') return () => {};    // sync

      if (prop === 'from' || prop === 'rpc')
        return () => new Proxy({}, handler);

      const leaf = [
        'select','insert','update','delete','upsert',
        'eq','neq','lt','lte','gt','gte','like','ilike',
        'order','limit','single','maybeSingle','textSearch',
        'in','contains',
      ];
      if (leaf.includes(String(prop))) return () => ok<any[]>([]);

      return new Proxy({}, handler);
    },
  };

  // @ts-expect-error proxy is a structural mock
  return new Proxy({}, handler);
}

/* ---------- exported helpers ---------- */
export const createBrowserClient = () => {
  if (typeof window === 'undefined') return createMock();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return createMock();

  const { createBrowserSupabaseClient } =
    require('@supabase/auth-helpers-nextjs');
  return createBrowserSupabaseClient({ supabaseUrl: url, supabaseKey: key });
};

export const createServerClient = createMock;
