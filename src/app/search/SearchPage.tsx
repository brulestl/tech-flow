"use client"

import React, { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { stringToColor } from "@/lib/utils"
import ResourceCard from "@/components/features/ResourceCard"
import { Filter, SlidersHorizontal, Calendar, Hash } from "lucide-react"
import type { Database } from "@/lib/database.types"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

type Resource = Database['public']['Tables']['resources']['Row']
type ResourceTag = Database['public']['Tables']['resource_tags']['Row']
type Tag = Database['public']['Tables']['tags']['Row']

interface ResourceWithTags extends Resource {
  tags: string[]
}

interface Cluster {
  id: number
  title: string
  resourceIds: number[]
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ""
  const clusterId = searchParams.get('cluster')
  
  const [results, setResults] = useState<Resource[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [tags, setTags] = useState<Record<string, string[]>>({})
  const [cluster, setCluster] = useState<Cluster | null>(null)
  
  useEffect(() => {
    const searchResources = async () => {
      if (!query && !clusterId) {
        setResults([])
        return
      }

      setIsLoading(true)
      setError(null)
      
      try {
        let data: Resource[]
        
        if (clusterId) {
          // Fetch cluster details and its resources
          const clusterResponse = await fetch('/api/clusters')
          if (!clusterResponse.ok) {
            throw new Error('Failed to fetch cluster details')
          }
          const clusterData = await clusterResponse.json()
          const cluster = clusterData.clusters.find((c: Cluster) => c.id === parseInt(clusterId))
          
          if (!cluster) {
            throw new Error('Cluster not found')
          }
          
          setCluster(cluster)
          
          // Fetch resources for this cluster
          const supabase = createClientComponentClient<Database>()
          const { data: clusterResources, error: resourcesError } = await supabase
            .from('resources')
            .select('*')
            .in('id', cluster.resourceIds)
          
          if (resourcesError) throw resourcesError
          data = clusterResources
        } else {
          // Regular semantic search
          const response = await fetch(`/api/semantic-search?q=${encodeURIComponent(query)}`)
          if (!response.ok) {
            throw new Error('Failed to fetch search results')
          }
          data = await response.json()
        }

        setResults(data)

        // Fetch tags for each resource
        const supabase = createClientComponentClient<Database>()
        const resourceIds = data.map((r: Resource) => r.id)
        
        const { data: resourceTags, error: tagsError } = await supabase
          .from('resource_tags')
          .select(`
            resource_id,
            tags (
              id,
              name
            )
          `)
          .in('resource_id', resourceIds)

        if (tagsError) throw tagsError

        // Group tags by resource ID
        const tagsByResource = resourceTags.reduce((acc: Record<string, string[]>, rt: any) => {
          if (!acc[rt.resource_id]) {
            acc[rt.resource_id] = []
          }
          acc[rt.resource_id].push(rt.tags.name)
          return acc
        }, {})

        setTags(tagsByResource)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }

    searchResources()
  }, [query, clusterId])
  
  // Extract unique tags from all resources
  const allTags = Array.from(
    new Set(Object.values(tags).flat())
  )
  
  // Group resources by date
  const groupedByDate = results.reduce((groups: Record<string, Resource[]>, resource) => {
    const date = new Date(resource.created_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    })
    
    if (!groups[date]) {
      groups[date] = []
    }
    
    groups[date].push(resource)
    return groups
  }, {})
  
  return (
    <div className="space-y-6">
      {/* Search header */}
      <div className="flex items-center justify-between">
        <div>
          {cluster ? (
            <p className="text-sm text-muted-foreground">
              {isLoading ? (
                "Loading cluster resources..."
              ) : (
                `${results.length} resources in cluster "${cluster.title}"`
              )}
            </p>
          ) : query && (
            <p className="text-sm text-muted-foreground">
              {isLoading ? (
                "Searching..."
              ) : (
                `${results.length} results for <span class="font-medium text-foreground">"${query}"</span>`
              )}
            </p>
          )}
        </div>
        
        {!cluster && (
          <button
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className="btn btn-ghost flex items-center gap-2"
          >
            <Filter size={16} />
            <span>Filters</span>
          </button>
        )}
      </div>
      
      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-md">
          {error}
        </div>
      )}
      
      {/* Filters panel */}
      {isFiltersOpen && (
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">Filter Results</h3>
            <button onClick={() => setIsFiltersOpen(false)} className="text-sm text-primary">
              Apply
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={16} />
                <h4 className="text-sm font-medium">Date Range</h4>
              </div>
              <div className="flex gap-2">
                <input 
                  type="date" 
                  className="search-bar text-sm py-1.5 flex-1"
                />
                <span className="flex items-center">to</span>
                <input 
                  type="date" 
                  className="search-bar text-sm py-1.5 flex-1"
                />
              </div>
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Hash size={16} />
                <h4 className="text-sm font-medium">Tags</h4>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {allTags.map(tag => (
                  <button 
                    key={tag}
                    className="tag cursor-pointer"
                    style={{ backgroundColor: `${stringToColor(tag)}20` }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Search results */}
      <div className="space-y-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin text-2xl">⟳</div>
          </div>
        ) : Object.keys(groupedByDate).length > 0 ? (
          Object.entries(groupedByDate).map(([date, resources]) => (
            <div key={date}>
              <h3 className="text-lg font-medium mb-3">{date}</h3>
              <div className="space-y-3">
                {resources.map(resource => (
                  <ResourceCard 
                    key={resource.id} 
                    resource={{
                      ...resource,
                      tags: tags[resource.id] || []
                    } as ResourceWithTags} 
                  />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-2">No results found</p>
            <p className="text-muted-foreground">Try a different search query or add new resources</p>
          </div>
        )}
      </div>
    </div>
  )
}
