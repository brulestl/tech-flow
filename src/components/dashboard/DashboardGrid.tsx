"use client"

import React, { useEffect, useState } from "react"
import { getRecentResources, Resource, deleteResource } from "@/lib/dataService"
import ClusterPanel from "@/components/features/ClusterPanel"
import RecentSavesList from "@/components/features/RecentSavesList"
import SearchResultsPanel from "@/components/features/SearchResultsPanel"
import EditResourceModal from "@/components/features/EditResourceModal"
import { useSupabaseClient } from "@supabase/auth-helpers-react"

export default function DashboardGrid() {
  const supabase = useSupabaseClient()
  const [recentResources, setRecentResources] = useState<Resource[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingResource, setEditingResource] = useState<Resource | null>(null)
  
  const loadResources = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)

      if (error) {
        if (error.code === 'PGRST116') {
          // Table doesn't exist or user doesn't have access
          setError('Please connect your social media account to start saving resources')
          return
        }
        throw error
      }
      setRecentResources(data || [])
    } catch (err) {
      console.error('Error loading resources:', err)
      setError(err instanceof Error ? err.message : 'Failed to load resources')
    } finally {
      setIsLoading(false)
    }
  }
  
  useEffect(() => {
    loadResources()
  }, [supabase])
  
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
        <p className="text-lg text-destructive mb-2">Unable to load resources</p>
        <p className="text-muted-foreground">{error}</p>
        {error.includes('connect your social media account') && (
          <div className="mt-4">
            <p className="text-sm text-muted-foreground mb-2">
              To get started, please connect your social media account:
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => supabase.auth.signInWithOAuth({ provider: 'twitter' })}
                className="btn btn-outline"
              >
                Connect Twitter
              </button>
              <button
                onClick={() => supabase.auth.signInWithOAuth({ provider: 'github' })}
                className="btn btn-outline"
              >
                Connect GitHub
              </button>
            </div>
          </div>
        )}
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
