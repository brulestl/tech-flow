"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { X, Link, Tag, Save, Folder } from "lucide-react"
import { saveResource, getCollections, addResourceToCollection } from "@/lib/dataService"
import type { Resource, Collection } from "@/lib/dataService"

type ResourceType = Resource['type']

interface SaveModalProps {
  onClose: () => void;
}

export default function SaveModal({ onClose }: SaveModalProps) {
  const [url, setUrl] = useState("")
  const [title, setTitle] = useState("")
  const [type, setType] = useState<ResourceType>("article")
  const [tagInput, setTagInput] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [notes, setNotes] = useState("")
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null)
  const [collections, setCollections] = useState<Collection[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    const loadCollections = async () => {
      try {
        const data = await getCollections()
        setCollections(data)
      } catch (err) {
        console.error('Failed to load collections:', err)
      }
    }
    loadCollections()
  }, [])
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    if (!url || !title) return
    
    try {
      setIsLoading(true)
      const resource = await saveResource({
        title,
        url,
        type,
        description: notes || null,
        summary: null,
        summary_status: "pending",
        summary_updated_at: null,
      })
      
      // Add to collection if selected
      if (selectedCollection) {
        await addResourceToCollection(selectedCollection, resource.id)
      }
      
      // Generate summary asynchronously
      try {
        const response = await fetch('/api/summarize', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url,
            title,
            type,
          }),
        })
        
        if (!response.ok) throw new Error('Failed to generate summary')
        
        const { summary } = await response.json()
        
        if (summary) {
          await saveResource({
            ...resource,
            summary,
            summary_status: "completed",
            summary_updated_at: new Date().toISOString(),
          })
        }
      } catch (summaryError) {
        console.error('Error generating summary:', summaryError)
        // Don't show error to user since this is async
      }
      
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save resource')
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
          <h2 className="text-xl font-bold">Save Resource</h2>
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
                    Save Resource
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
