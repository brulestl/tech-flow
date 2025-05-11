'use client';

import React from "react"
import CollectionsGrid from "./CollectionsGrid"
import { useSession } from '@supabase/auth-helpers-react'
import { redirect } from 'next/navigation'

export default function CollectionsPage() {
  const session = useSession();
  
  if (!session) {
    redirect('/login');
  }
  
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Collections</h1>
          <p className="text-muted-foreground">
            Organize your resources into themed collections
          </p>
        </div>
        
        <button className="btn btn-primary">
          New Collection
        </button>
      </div>
      
      <CollectionsGrid />
    </div>
  )
}
