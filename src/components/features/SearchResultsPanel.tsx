"use client"

import React, { useEffect, useState } from "react"
import { getRecentResources, getResourcesByTags } from "@/lib/utils"
import ResourceCard from "@/components/features/ResourceCard"
import { motion } from "framer-motion"
import { Search, Filter, SlidersHorizontal } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import type { Database } from "@/lib/database.types"

type Resource = Database['public']['Tables']['resources']['Row']
type ResourceWithTags = Resource & { tags: string[] }

export default function SearchResultsPanel() {
  const supabase = useSupabaseClient()
  const [resources, setResources] = useState<ResourceWithTags[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [availableTags, setAvailableTags] = useState<string[]>([])
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    const loadResources = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const { data, error } = await supabase
          .from('resources')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(15)

        if (error) {
          if (error.code === 'PGRST116') {
            setError('Please connect your social media account to start saving resources')
            return
          }
          throw error
        }

        const resourcesWithTags = (data || []).map(resource => ({
          ...resource,
          tags: resource.tags || []
        }))
        setResources(resourcesWithTags)
        
        // Extract unique tags
        const tags = Array.from(
          new Set(
            resourcesWithTags.flatMap(resource => resource.tags)
          )
        )
        setAvailableTags(tags)
      } catch (err) {
        console.error('Error loading resources:', err)
        setError(err instanceof Error ? err.message : 'Failed to load resources')
      } finally {
        setIsLoading(false)
      }
    }
    
    loadResources()
  }, [supabase])
  
  const handleTagClick = (tag: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag);
      } else {
        return [...prev, tag];
      }
    })
  }
  
  const filteredResources = selectedTags.length > 0 
    ? resources.filter(resource => 
        selectedTags.every(tag => resource.tags.includes(tag))
      )
    : resources;
  
  if (isLoading) {
    return (
      <div className="card p-5 h-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Semantic Search</h2>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin text-2xl">⟳</div>
        </div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="card p-5 h-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Semantic Search</h2>
        </div>
        <div className="text-center py-8">
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
      </div>
    )
  }
  
  return (
    <div className="card p-5 h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Semantic Search</h2>
        
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button size="icon" variant="ghost"><SlidersHorizontal size={18} /></Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80">
            <h3 className="mb-4 text-lg font-semibold">Filters (stub)</h3>
            <p className="text-muted-foreground">Tag, Date, Source…</p>
          </SheetContent>
        </Sheet>
      </div>
      
      {/* Search filters */}
      {availableTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {availableTags.slice(0, 5).map((tag) => (
            <motion.button
              key={tag}
              className={`tag cursor-pointer ${
                selectedTags.includes(tag)
                  ? "bg-primary text-primary-foreground"
                  : "bg-accent text-accent-foreground"
              }`}
              onClick={() => handleTagClick(tag)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {tag}
            </motion.button>
          ))}
        </div>
      )}
      
      <div className="space-y-4 mt-5">
        {filteredResources.length > 0 ? (
          filteredResources.slice(0, 5).map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              {selectedTags.length > 0 
                ? "No resources found with selected tags"
                : "No resources found. Start saving to see them here!"}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
