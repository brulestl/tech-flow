"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { ThemeProvider } from "@/components/theme-provider";
import { useEffect, useState } from "react";

// Create a singleton instance
let supabaseInstance: ReturnType<typeof createClientComponentClient> | null = null;

export default function Providers({ children }: { children: React.ReactNode }) {
  const [supabase, setSupabase] = useState<ReturnType<typeof createClientComponentClient> | null>(null);

  useEffect(() => {
    if (!supabaseInstance) {
      supabaseInstance = createClientComponentClient();
    }
    setSupabase(supabaseInstance);
  }, []);

  if (!supabase) {
    return null;
  }

  return (
    <SessionContextProvider supabaseClient={supabase}>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </SessionContextProvider>
  );
} 