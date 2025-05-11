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
  const [demo, setDemo] = useState<boolean>(hasDemoAuth());

  // Keep demo state in sync with storage
  useEffect(() => {
    const handler = () => setDemo(hasDemoAuth());
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  useEffect(() => {
    if (!realSession && !demo) router.push('/login');
  }, [realSession, demo, router]);

  if (!realSession && !demo) return null;      // could render spinner
  return <>{children}</>;
}
