'use client';

import RequireAuth from '@/components/auth/RequireAuth';
import { Button } from '@/components/ui/button';

// Metadata can't be exported from client components
// export const metadata = { title: 'Settings | TechVault' };

export default function SettingsPage() {
  return (
    <RequireAuth>
      <div className="p-6 text-muted-foreground">
        <h1 className="text-3xl font-bold mb-4">Settings</h1>
        <p>Coming soon – your settings will show here.</p>
        
        <Button
          onClick={() => alert('OAuth flow soon 🙂')}
          className="mt-6"
        >
          Connect X (Twitter)
        </Button>
      </div>
    </RequireAuth>
  );
}
