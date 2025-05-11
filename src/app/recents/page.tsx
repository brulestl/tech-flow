'use client';

import React from "react"
import { Suspense } from "react"
import RecentsContent from "./RecentsContent"
import { useSession } from '@supabase/auth-helpers-react'
import { redirect } from 'next/navigation'

export default function RecentsPage() {
  const session = useSession();
  
  if (!session) {
    redirect('/login');
  }
  
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Recent Saves</h1>
        <p className="text-muted-foreground">
          Your recently saved resources
        </p>
      </div>
      
      <Suspense fallback={<div>Loading recent resources...</div>}>
        <RecentsContent />
      </Suspense>
    </div>
  )
}
