"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { X, Link, Tag, Save, Folder, Sparkles } from "lucide-react"
import { updateResource, getCollections, addResourceToCollection, removeResourceFromCollection, getCollectionResources } from "@/lib/dataService"
import type { Resource, Collection } from "@/lib/dataService"

type ResourceType = Resource['type']

interface EditResourceModalProps {
  resource: Resource;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function EditResourceModal({ resource, onClose, onSuccess }: EditResourceModalProps) {
  const [url, setUrl] = useState(resource.url || "")
  const [title, setTitle] = useState(resource.title)
  const [type, setType] = useState<ResourceType>(resource.type)
  const [tagInput, setTagInput] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [notes, setNotes] = useState(resource.description || "")
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null)
  const [collections, setCollections] = useState<Collection[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false)
  
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load collections
        const collectionsData = await getCollections()
        setCollections(collectionsData)
        
        // Load resource's current collection
        const resourceCollections = await getCollectionResources(resource.id)
        if (resourceCollections.length > 0) {
          setSelectedCollection(resourceCollections[0].id)
        }
      } catch (err) {
        console.error('Failed to load data:', err)
      }
    }
    loadData()
  }, [resource.id])
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    if (!url || !title) return
    
    try {
      setIsLoading(true)
      
      // Update resource
      await updateResource(resource.id, {
        title,
        url,
        type,
        description: notes || null,
      })
      
      // Handle collection changes
      const currentCollections = await getCollectionResources(resource.id)
      const currentCollectionId = currentCollections[0]?.id
      
      if (currentCollectionId !== selectedCollection) {
        // Remove from current collection if any
        if (currentCollectionId) {
          await removeResourceFromCollection(currentCollectionId, resource.id)
        }
        
        // Add to new collection if selected
        if (selectedCollection) {
          await addResourceToCollection(selectedCollection, resource.id)
        }
      }
      
      onSuccess?.()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update resource')
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags(prev => [...prev, tagInput.trim()])
      setTagInput("")
    }
  }
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }
  
  const handleGenerateSummary = async () => {
    setIsGeneratingSummary(true)
    setError(null)
    
    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: resource.url,
          title: resource.title,
          type: resource.type,
        }),
      })
      
      if (!response.ok) throw new Error('Failed to generate summary')
      
      const { summary } = await response.json()
      
      if (summary) {
        await updateResource(resource.id, {
          ...resource,
          summary,
          summary_status: "completed",
          summary_updated_at: new Date().toISOString(),
        })
        
        onSuccess?.()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate summary')
    } finally {
      setIsGeneratingSummary(false)
    }
  }
  
  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="w-full max-w-md bg-card rounded-2xl shadow-xl overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-xl font-bold">Edit Resource</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-accent"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          {error && (
            <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded-md text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            {/* URL Input */}
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="url">
                URL
              </label>
              <div className="relative">
                <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                  id="url"
                  type="url"
                  placeholder="https://example.com/article"
                  className="search-bar pl-10"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
            
            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="title">
                Title
              </label>
              <input
                id="title"
                type="text"
                placeholder="Enter a title for this resource"
                className="search-bar"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            
            {/* Type */}
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <div className="flex flex-wrap gap-2">
                {(["article", "video", "book", "course", "other"] as ResourceType[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={`tag cursor-pointer ${
                      type === t
                        ? "bg-primary text-primary-foreground"
                        : "bg-accent text-accent-foreground"
                    }`}
                    onClick={() => setType(t)}
                    disabled={isLoading}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Collection */}
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="collection">
                Collection
              </label>
              <div className="relative">
                <Folder className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                <select
                  id="collection"
                  className="search-bar pl-10"
                  value={selectedCollection || ""}
                  onChange={(e) => setSelectedCollection(e.target.value || null)}
                  disabled={isLoading}
                >
                  <option value="">No Collection</option>
                  {collections.map(collection => (
                    <option key={collection.id} value={collection.id}>
                      {collection.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Tags */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Tags
              </label>
              <div className="relative mb-2">
                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                  type="text"
                  placeholder="Add tags (press Enter)"
                  className="search-bar pl-10"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading}
                />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <div 
                    key={tag}
                    className="tag flex items-center gap-1"
                  >
                    <span>{tag}</span>
                    <button 
                      type="button"
                      onClick={() => setTags(prev => prev.filter(t => t !== tag))}
                      className="text-xs"
                      disabled={isLoading}
                    >
                      ✕
                    </button>
                  </div>
                ))}
                {tags.length === 0 && (
                  <span className="text-sm text-muted-foreground">
                    No tags added yet
                  </span>
                )}
              </div>
            </div>
            
            {/* Notes */}
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="notes">
                Notes
              </label>
              <textarea
                id="notes"
                placeholder="Add notes (optional)"
                className="search-bar min-h-[80px] resize-none"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={isLoading}
              />
            </div>
            
            {/* Summary section */}
            <div>
              <label className="block text-sm font-medium mb-1">
                AI Summary
              </label>
              <div className="space-y-2">
                {resource.summary ? (
                  <p className="text-sm text-muted-foreground">{resource.summary}</p>
                ) : (
                  <p className="text-sm text-muted-foreground">No summary generated yet</p>
                )}
                <button
                  type="button"
                  onClick={handleGenerateSummary}
                  disabled={isGeneratingSummary}
                  className="btn btn-ghost btn-sm flex items-center gap-2"
                >
                  <Sparkles size={14} />
                  {isGeneratingSummary ? 'Generating...' : 'Generate Summary'}
                </button>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-ghost"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary flex items-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin">⟳</span>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
} 