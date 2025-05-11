'use client';

import { Auth } from '@supabase/auth-ui-react';
import { createBrowserClient } from '@/lib/supabaseClient';
import { ThemeSupa } from '@supabase/auth-ui-shared';

export default function LoginPage() {
  const supabase = createBrowserClient();

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
                borderRadii: {
                  button: '8px',
                  input: '8px',
                },
              },
            },
            className: {
              button: 'btn btn-primary w-full',
              input: 'search-bar',
              label: 'text-sm font-medium block mb-1',
            },
          }}
          redirectTo={`${window.location.origin}/`}
        />
      </div>
    </div>
  );
}
