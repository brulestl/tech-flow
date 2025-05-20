'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { ThemeSupa } from '@supabase/auth-ui-shared';

const Auth = dynamic(
  () => import('@supabase/auth-ui-react').then(m => m.Auth),
  { ssr: false }           // never rendered on the server
);

export default function LoginPage() {
  /** loaded === true only after the first client-side effect runs */
  const [loaded, setLoaded] = useState(false);
  const [supabase, setSupabase] = useState<any>(null);
  const [redirectUrl, setRedirectUrl] = useState<string>('');

  useEffect(() => {
    // This block runs only in the browser
    setSupabase(createClientComponentClient());
    setRedirectUrl(`${window.location.origin}/`);
    setLoaded(true);
  }, []);

  // Render nothing during the server pass AND the very first client pass.
  if (!loaded) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md p-6 bg-card rounded-2xl shadow-lg border border-border">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-muted-foreground mt-1">
            Sign in to your TechVault account
          </p>
        </div>

        <Auth
          supabaseClient={supabase}
          view="sign_in"
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: 'var(--primary)',
                  brandAccent: 'var(--primary)',
                },
              },
            },
            className: {
              button: 'btn btn-primary w-full',
              input: 'search-bar',
              label: 'text-sm font-medium block mb-1',
            },
          }}
          redirectTo={redirectUrl}
        />
        
        <div className="mt-6 text-center">
          <button
            className="btn btn-secondary w-full"
            onClick={() => {
              localStorage.setItem('demoAuth', '1');
              window.location.href = '/home';
            }}
          >
            Try the demo&nbsp;🚀
          </button>
        </div>
      </div>
    </div>
  );
}
