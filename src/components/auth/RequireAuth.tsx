'use client';
import { useSession } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

function hasDemoAuth() {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('demoAuth') === '1';
}

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const realSession = useSession();
  const router      = useRouter();

  // ① Track demo flag and ② whether we've done the first client check
  const [demo, setDemo]   = useState(false);
  const [checked, setChecked] = useState(false);

  /* On mount: read demo flag once, then listen for storage events */
  useEffect(() => {
    setDemo(hasDemoAuth());
    setChecked(true);                               // we've now checked localStorage

    const handler = () => setDemo(hasDemoAuth());
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  /* Redirect only after first check */
  useEffect(() => {
    if (checked && !realSession && !demo) router.push('/login');
  }, [checked, realSession, demo, router]);

  if (!realSession && !demo) return null;           // loading spinner placeholder
  return <>{children}</>;
}
