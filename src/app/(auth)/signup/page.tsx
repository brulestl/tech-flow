'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { createBrowserClient } from '@/lib/supabaseClient';
import { ThemeSupa } from '@supabase/auth-ui-shared';

const Auth = dynamic(
  () => import('@supabase/auth-ui-react').then(m => m.Auth),
  { ssr: false }
);

export default function SignupPage() {
  const [redirectUrl, setRedirectUrl] = useState('');
  
  useEffect(() => {
    setRedirectUrl(`${window.location.origin}/`);
    
    // Only create client when in browser
    const supabase = createBrowserClient();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md p-6 bg-card rounded-2xl shadow-lg border border-border">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Create an Account</h1>
          <p className="text-muted-foreground mt-1">
            Sign up to organize your tech resources
          </p>
        </div>
        
        <div className="w-full">
          {typeof window !== 'undefined' && (
            <Auth 
              supabaseClient={createBrowserClient()}
              view="sign_up"
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: 'var(--primary)',
                      brandAccent: 'var(--primary)',
                    }
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
          )}
        </div>
      </div>
    </div>
  );
}
