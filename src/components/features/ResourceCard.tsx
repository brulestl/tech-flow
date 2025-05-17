"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { ExternalLink, FileText, Bookmark, Video, Book, GraduationCap, MoreVertical, Edit, Trash2 } from "lucide-react"
import type { Database } from "@/lib/database.types"

type Resource = Database['public']['Tables']['resources']['Row']

interface ResourceWithTags extends Resource {
  tags: string[]
}

interface ResourceCardProps {
  resource: ResourceWithTags;
  onEdit?: (resource: ResourceWithTags) => void;
  onDelete?: (resource: ResourceWithTags) => void;
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
  
  if (diffInDays === 0) return 'Today'
  if (diffInDays === 1) return 'Yesterday'
  if (diffInDays < 7) return `${diffInDays} days ago`
  
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  })
}

export default function ResourceCard({ resource, onEdit, onDelete }: ResourceCardProps) {
  const [showDropdown, setShowDropdown] = useState(false)
  
  const getIconByType = () => {
    switch (resource.type) {
      case "video": return <Video size={16} className="text-accent-blue" />;
      case "book": return <Book size={16} className="text-accent-green" />;
      case "course": return <GraduationCap size={16} className="text-accent-purple" />;
      case "article": return <FileText size={16} className="text-accent-orange" />;
      default: return <Bookmark size={16} />;
    }
  }

  return (
    <motion.div 
      className="resource-card"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-start gap-4">
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {getIconByType()}
            <p className="text-xs text-muted-foreground">{formatDate(resource.created_at)}</p>
          </div>
          
          <h3 className="font-medium text-base truncate">{resource.title}</h3>
          
          {resource.summary && (
            <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
              {resource.summary}
            </p>
          )}
          
          {resource.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">
              {resource.description}
            </p>
          )}

          {resource.tags && resource.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {resource.tags.map(tag => (
                <span 
                  key={tag}
                  className="tag text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {resource.url && (
            <a 
              href={resource.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-1.5 rounded-md hover:bg-accent"
            >
              <ExternalLink size={16} />
            </a>
          )}
          
          <div className="relative">
            <button
              className="p-1.5 rounded-md hover:bg-accent"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <MoreVertical size={16} />
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 mt-1 w-48 bg-card rounded-md shadow-lg border border-border z-10">
                <div className="py-1">
                  <button
                    className="w-full px-4 py-2 text-sm text-left hover:bg-accent flex items-center gap-2"
                    onClick={() => {
                      setShowDropdown(false)
                      onEdit?.(resource)
                    }}
                  >
                    <Edit size={16} />
                    Edit Resource
                  </button>
                  <button
                    className="w-full px-4 py-2 text-sm text-left hover:bg-accent flex items-center gap-2 text-destructive"
                    onClick={() => {
                      setShowDropdown(false)
                      onDelete?.(resource)
                    }}
                  >
                    <Trash2 size={16} />
                    Delete Resource
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
