"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { X, Save } from "lucide-react"
import { createCollection } from "@/lib/dataService"

interface NewCollectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function NewCollectionModal({ open, onOpenChange, onSuccess }: NewCollectionModalProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [isPublic, setIsPublic] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setName("")
      setDescription("")
      setIsPublic(false)
      setError(null)
    }
  }, [open])
  
  if (!open) return null
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    if (!name.trim()) {
      setError('Please enter a collection name')
      return
    }
    
    try {
      setIsLoading(true)
      await createCollection({
        name: name.trim(),
        description: description.trim() || null,
        is_public: isPublic,
      })
      onSuccess?.()
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create collection')
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => onOpenChange(false)}
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
          <h2 className="text-xl font-bold">New Collection</h2>
          <button 
            onClick={() => onOpenChange(false)}
            className="p-1 rounded-full hover:bg-accent"
            disabled={isLoading}
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
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="name">
                Name <span className="text-destructive">*</span>
              </label>
              <input
                id="name"
                type="text"
                placeholder="Enter collection name"
                className="search-bar"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
                autoFocus
              />
            </div>
            
            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                placeholder="Add a description (optional)"
                className="search-bar min-h-[80px] resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isLoading}
              />
            </div>
            
            {/* Public/Private */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPublic"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                disabled={isLoading}
                className="rounded border-border"
              />
              <label htmlFor="isPublic" className="text-sm">
                Make this collection public
              </label>
            </div>
            
            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
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
                    Creating...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Create Collection
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
