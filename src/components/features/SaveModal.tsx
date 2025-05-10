"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { X, Link, Tag, Save } from "lucide-react"
import { ResourceType, saveResource } from "@/lib/utils"

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
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!url || !title) return
    
    saveResource({
      title,
      url,
      type,
      tags,
      notes,
      summary: "", // Could be auto-generated in a real app
    })
    
    onClose()
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
              />
            </div>
            
            {/* Type */}
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <div className="flex flex-wrap gap-2">
                {(["tweet", "instagram", "code", "article", "other"] as ResourceType[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={`tag cursor-pointer ${
                      type === t
                        ? "bg-primary text-primary-foreground"
                        : "bg-accent text-accent-foreground"
                    }`}
                    onClick={() => setType(t)}
                  >
                    {t}
                  </button>
                ))}
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
              />
            </div>
            
            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-ghost"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary flex items-center gap-2"
              >
                <Save size={18} />
                Save Resource
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}
