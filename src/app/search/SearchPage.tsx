"use client"

import React, { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { searchResources, Resource, stringToColor } from "@/lib/utils"
import ResourceCard from "@/components/features/ResourceCard"
import { Filter, SlidersHorizontal, Calendar, Hash } from "lucide-react"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ""
  
  const [results, setResults] = useState<Resource[]>([])
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  
  useEffect(() => {
    if (query) {
      const searchResults = searchResources(query)
      setResults(searchResults)
    }
  }, [query])
  
  // Extract unique tags from search results
  const allTags = Array.from(
    new Set(results.flatMap(resource => resource.tags))
  )
  
  // Group resources by date
  const groupedByDate = results.reduce((groups: Record<string, Resource[]>, resource) => {
    const date = new Date(resource.dateAdded).toLocaleDateString('en-US', {
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
          {query && (
            <p className="text-sm text-muted-foreground">
              {results.length} results for <span className="font-medium text-foreground">"{query}"</span>
            </p>
          )}
        </div>
        
        <button
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          className="btn btn-ghost flex items-center gap-2"
        >
          <Filter size={16} />
          <span>Filters</span>
        </button>
      </div>
      
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
        {Object.keys(groupedByDate).length > 0 ? (
          Object.entries(groupedByDate).map(([date, resources]) => (
            <div key={date}>
              <h3 className="text-lg font-medium mb-3">{date}</h3>
              <div className="space-y-3">
                {resources.map(resource => (
                  <ResourceCard key={resource.id} resource={resource} />
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
