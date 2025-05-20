'use client';

import React from "react"
import { Suspense } from "react"
import RecentsContent from "./RecentsContent"

export default function RecentsPage() {
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
