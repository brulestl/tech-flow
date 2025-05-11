'use client';

import React from "react"
import { Suspense } from "react"
import SearchPage from "./SearchPage"

export default function Page() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Search</h1>
        <p className="text-muted-foreground">
          Find resources by keywords, tags, or content
        </p>
      </div>
      
      <Suspense fallback={<div>Loading search results...</div>}>
        <SearchPage />
      </Suspense>
    </div>
  )
}
