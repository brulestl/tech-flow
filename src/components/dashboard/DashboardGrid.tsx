"use client"

import React, { useEffect, useState } from "react"
import { getRecentResources, Resource, deleteResource } from "@/lib/dataService"
import ClusterPanel from "@/components/features/ClusterPanel"
import RecentSavesList from "@/components/features/RecentSavesList"
import SearchResultsPanel from "@/components/features/SearchResultsPanel"
import EditResourceModal from "@/components/features/EditResourceModal"

export default function DashboardGrid() {
  const [recentResources, setRecentResources] = useState<Resource[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingResource, setEditingResource] = useState<Resource | null>(null)
  
  const loadResources = async () => {
    try {
      setIsLoading(true)
      const resources = await getRecentResources(5)
      setRecentResources(resources)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load resources')
    } finally {
      setIsLoading(false)
    }
  }
  
  useEffect(() => {
    loadResources()
  }, [])
  
  const handleEdit = (resource: Resource) => {
    setEditingResource(resource)
  }
  
  const handleDelete = async (resource: Resource) => {
    if (!confirm('Are you sure you want to delete this resource?')) return
    
    try {
      await deleteResource(resource.id)
      setRecentResources(prev => prev.filter(r => r.id !== resource.id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete resource')
    }
  }
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin text-2xl">⟳</div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-destructive mb-2">Error loading resources</p>
        <p className="text-muted-foreground">{error}</p>
      </div>
    )
  }
  
  return (
    <div className="flex flex-col md:grid md:grid-cols-12 gap-6">
      {/* Mobile view: Stack vertically */}
      <div className="md:hidden space-y-6">
        <div className="card p-5">
          <h2 className="text-xl font-bold mb-4">Recent Saves</h2>
          <RecentSavesList 
            resources={recentResources}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
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
          <RecentSavesList 
            resources={recentResources}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>
      
      {editingResource && (
        <EditResourceModal
          resource={editingResource}
          onClose={() => setEditingResource(null)}
          onSuccess={loadResources}
        />
      )}
    </div>
  )
}
