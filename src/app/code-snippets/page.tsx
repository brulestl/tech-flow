'use client';

import RequireAuth from '@/components/auth/RequireAuth';

// Metadata can't be exported from client components
// export const metadata = { title: 'Code Snippets | TechVault' };

export default function CodeSnippetsPage() {
  return (
    <RequireAuth>
      <div className="p-6 text-muted-foreground">
        <h1 className="text-3xl font-bold mb-4">Code Snippets</h1>
        <p>Coming soon – your code snippets will show here.</p>
      </div>
    </RequireAuth>
  );
}
