"use client"

import React, { useState, useEffect } from "react"
import { Resource, getRecentResources, deleteResource } from "@/lib/dataService"
import ResourceCard from "@/components/features/ResourceCard"
import EditResourceModal from "@/components/features/EditResourceModal"
import { Filter, Grid, List } from "lucide-react"

export default function RecentsContent() {
  const [resources, setResources] = useState<Resource[]>([])
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingResource, setEditingResource] = useState<Resource | null>(null)
  
  const loadResources = async () => {
    try {
      setIsLoading(true)
      const recentResources = await getRecentResources(20)
      setResources(recentResources)
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
      setResources(prev => prev.filter(r => r.id !== resource.id))
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
        <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-3"}>
          {resources.map(resource => (
            <ResourceCard 
              key={resource.id} 
              resource={resource}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground mb-2">No recent saves</p>
          <p className="text-muted-foreground">Save your first resource using the + button</p>
        </div>
      )}
      
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
