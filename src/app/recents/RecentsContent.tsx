"use client"

import React, { useState, useEffect } from "react"
import { Resource, getRecentResources, generateMockData } from "@/lib/utils"
import ResourceCard from "@/components/features/ResourceCard"
import { Filter, Grid, List } from "lucide-react"

export default function RecentsContent() {
  const [resources, setResources] = useState<Resource[]>([])
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  
  useEffect(() => {
    // Generate mock data if none exists
    generateMockData()
    
    const recentResources = getRecentResources(20)
    setResources(recentResources)
  }, [])
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {resources.length} items
        </p>
        
        <div className="flex items-center gap-2">
          <button 
            className={`p-2 rounded-md ${viewMode === "list" ? "bg-accent" : ""}`}
            onClick={() => setViewMode("list")}
          >
            <List size={18} />
          </button>
          <button 
            className={`p-2 rounded-md ${viewMode === "grid" ? "bg-accent" : ""}`}
            onClick={() => setViewMode("grid")}
          >
            <Grid size={18} />
          </button>
        </div>
      </div>
      
      {resources.length > 0 ? (
        <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "space-y-3"}>
          {resources.map(resource => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground mb-2">No recent saves</p>
          <p className="text-muted-foreground">Save your first resource using the + button</p>
        </div>
      )}
    </div>
  )
}
