"use client"

import React, { useEffect, useState } from "react"
import { getRecentResources, Resource, getResourcesByTags } from "@/lib/utils"
import ResourceCard from "@/components/features/ResourceCard"
import { motion } from "framer-motion"
import { Search, Filter, SlidersHorizontal } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

export default function SearchResultsPanel() {
  const [resources, setResources] = useState<Resource[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [availableTags, setAvailableTags] = useState<string[]>([])
  const [open, setOpen] = useState(false)
  
  useEffect(() => {
    const recentResources = getRecentResources(15)
    setResources(recentResources)
    
    // Extract unique tags
    const tags = Array.from(
      new Set(
        recentResources.flatMap(resource => resource.tags)
      )
    )
    setAvailableTags(tags)
  }, [])
  
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
    ? getResourcesByTags(selectedTags)
    : resources;
  
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
      
      <div className="space-y-4 mt-5">
        {filteredResources.length > 0 ? (
          filteredResources.slice(0, 5).map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No matching resources found</p>
          </div>
        )}
      </div>
    </div>
  )
}
