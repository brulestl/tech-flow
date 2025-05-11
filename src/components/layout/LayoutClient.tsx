"use client";

import React, { useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { usePathname } from "next/navigation";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { createBrowserClient } from "@/lib/supabaseClient";
import MobileNavbar from "@/components/layout/MobileNavbar";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import StatsBar from "@/components/layout/StatsBar";
import RequireAuth from "@/components/auth/RequireAuth";

export default function LayoutClient({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith('/(auth)') || pathname?.includes('/login') || pathname?.includes('/signup');
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    
    // Preload the Supabase auth helpers for later use
    if (typeof window !== 'undefined') {
      import('@supabase/auth-helpers-nextjs').then(module => {
        // Store the module for synchronous access later
        (window as any).__supabaseAuthHelpers = module;
      });
    }
  }, []);
  
  // Don't render Supabase provider during SSR
  if (!mounted) {
    return isAuthPage ? (
      children
    ) : (
      <div className="relative min-h-screen flex flex-col md:flex-row">
        {/* Desktop sidebar - hidden on mobile */}
        <div className="hidden md:flex">
          <Sidebar />
        </div>
        
        {/* Main content area */}
        <div className="flex-1 flex flex-col h-screen">
          {/* Header with search */}
          <Header />
          
          {/* Main content */}
          <main className="flex-1 overflow-auto p-4 md:p-6">
            {children}
          </main>
          
          {/* Stats bar - desktop only */}
          <div className="hidden md:block border-t border-border">
            <StatsBar />
          </div>
          
          {/* Mobile navigation - visible only on mobile */}
          <div className="md:hidden">
            <MobileNavbar />
          </div>
        </div>
      </div>
    );
  }
  
  // Create the client once, outside of render
  const supabaseClient = createBrowserClient();
  
  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      {isAuthPage ? (
        children
      ) : (
          <div className="relative min-h-screen flex flex-col md:flex-row">
          {/* Desktop sidebar - hidden on mobile */}
          <div className="hidden md:flex">
            <Sidebar />
          </div>
          
          {/* Main content area */}
          <div className="flex-1 flex flex-col h-screen">
            {/* Header with search */}
            <Header />
            
            {/* Main content */}
            <main className="flex-1 overflow-auto p-4 md:p-6">
              {children}
            </main>
            
            {/* Stats bar - desktop only */}
            <div className="hidden md:block border-t border-border">
              <StatsBar />
            </div>
            
            {/* Mobile navigation - visible only on mobile */}
            <div className="md:hidden">
              <MobileNavbar />
            </div>
          </div>
        </div>
      )}
    </SessionContextProvider>
  );
}
