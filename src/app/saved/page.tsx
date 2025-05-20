'use client';

import RequireAuth from '@/components/auth/RequireAuth';

// Metadata can't be exported from client components
// export const metadata = { title: 'Saved | TechVault' };

export default function SavedPage() {
  return (
    <RequireAuth>
      <div className="p-6 text-muted-foreground">
        <h1 className="text-3xl font-bold mb-4">Saved Resources</h1>
        <p>Coming soon – your bookmarks will show here.</p>
      </div>
    </RequireAuth>
  );
}
