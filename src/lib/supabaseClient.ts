import type { SupabaseClient } from '@supabase/supabase-js';

// Extend the Window interface to define our custom properties
declare global {
  interface Window {
    __supabaseClient?: SupabaseClient<any, "public", any>;
    __supabaseAuthHelpers?: {
      createBrowserSupabaseClient?: (options: {
        supabaseUrl: string;
        supabaseKey: string;
      }) => SupabaseClient<any, "public", any>;
    };
  }
}

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

  return new Proxy({}, handler) as unknown as SupabaseClient<any, any, any>;
}

/* ---------- exported helpers ---------- */
// Create a synchronous client that won't cause TypeScript errors
export const createBrowserClient = (): SupabaseClient<any, "public", any> => {
  // Early return for server-side rendering
  if (typeof window === 'undefined') return createMock();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return createMock();

  // All browser-specific code in this function
  const createBrowserSupabase = () => {
    // Access window properties safely with explicit checks
    if (typeof window !== 'undefined') {
      // Use existing client from window if available
      const existingClient = window.__supabaseClient as SupabaseClient<any, "public", any> | undefined;
      if (existingClient) {
        return existingClient;
      }

      try {
        // Check if auth helpers module was preloaded
        if (typeof window !== 'undefined') {
          const helpers = window.__supabaseAuthHelpers;
          if (helpers?.createBrowserSupabaseClient) {
            const client = helpers.createBrowserSupabaseClient({
              supabaseUrl: url,
              supabaseKey: key
            });
            
            // Cache the client
            if (typeof window !== 'undefined') {
              window.__supabaseClient = client;
            }
            return client;
          }
        }
      }
      
      // Fallback to mock
      return createMock();
    } catch (error) {
      console.warn("Failed to create Supabase client, using mock instead", error);
      return createMock();
    }
  };

  // Call the browser-specific function since we know window exists
  return createBrowserSupabase();
};

export const createServerClient = createMock;
