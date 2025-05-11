'use client';

import React, { useState } from "react"
import CollectionsGrid from "./CollectionsGrid"

export default function CollectionsPage() {
  const [open, setOpen] = useState(false);
  
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Collections</h1>
          <p className="text-muted-foreground">
            Organize your resources into themed collections
          </p>
        </div>
        
        <button className="btn btn-primary" onClick={() => setOpen(true)}>
          New Collection
        </button>
      </div>
      
      <CollectionsGrid />
    </div>
  )
}
