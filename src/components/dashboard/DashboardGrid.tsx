"use client"

import React, { useEffect, useState } from "react"
import { getRecentResources, Resource, generateMockData } from "@/lib/utils"
import ClusterPanel from "@/components/features/ClusterPanel"
import RecentSavesList from "@/components/features/RecentSavesList"
import SearchResultsPanel from "@/components/features/SearchResultsPanel"

export default function DashboardGrid() {
  const [recentResources, setRecentResources] = useState<Resource[]>([])
  
  useEffect(() => {
    // Generate mock data if none exists
    generateMockData()
    
    // Get recent resources
    const resources = getRecentResources(5)
    setRecentResources(resources)
  }, [])
  
  return (
    <div className="flex flex-col md:grid md:grid-cols-12 gap-6">
      {/* Mobile view: Stack vertically */}
      <div className="md:hidden space-y-6">
        <div className="card p-5">
          <h2 className="text-xl font-bold mb-4">Recent Saves</h2>
          <RecentSavesList resources={recentResources} />
        </div>
        
        <div className="card p-5">
          <h2 className="text-xl font-bold mb-4">Suggested Clusters</h2>
          <ClusterPanel />
        </div>
      </div>
      
      {/* Desktop view: 3-column grid */}
      <div className="hidden md:block md:col-span-4">
        <SearchResultsPanel />
      </div>
      
      <div className="hidden md:block md:col-span-4">
        <div className="card p-5 h-full">
          <h2 className="text-xl font-bold mb-4">Suggested Clusters</h2>
          <ClusterPanel />
        </div>
      </div>
      
      <div className="hidden md:block md:col-span-4">
        <div className="card p-5 h-full">
          <h2 className="text-xl font-bold mb-4">Recent Saves</h2>
          <RecentSavesList resources={recentResources} />
        </div>
      </div>
    </div>
  )
}
