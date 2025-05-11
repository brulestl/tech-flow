'use client';

import React from "react";
import DashboardGrid from "@/components/dashboard/DashboardGrid";
import SaveButton from "@/components/ui/SaveButton";
import { useSession } from '@supabase/auth-helpers-react';
import { redirect } from 'next/navigation';

export default function HomePage() {
  const session = useSession();
  
  if (!session) {
    redirect('/login');
  }
  
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Welcome back</h1>
        <p className="text-muted-foreground">
          Continue your learning journey where you left off
        </p>
      </div>
      
      <DashboardGrid />
      
      {/* Floating action button for quick save - mobile & desktop */}
      <SaveButton />
    </div>
  );
}
