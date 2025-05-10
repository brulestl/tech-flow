"use client"

import React from "react"
import { Resource, formatDate, stringToColor } from "@/lib/utils"
import { motion } from "framer-motion"
import { ExternalLink, Twitter, Instagram, Code, FileText, Bookmark } from "lucide-react"
import Image from "next/image"

interface ResourceCardProps {
  resource: Resource;
}

export default function ResourceCard({ resource }: ResourceCardProps) {
  const getIconByType = () => {
    switch (resource.type) {
      case "tweet": return <Twitter size={16} className="text-accent-blue" />;
      case "instagram": return <Instagram size={16} className="text-accent-pink" />;
      case "code": return <Code size={16} className="text-accent-green" />;
      case "article": return <FileText size={16} className="text-accent-purple" />;
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
        {/* Thumbnail if available */}
        {resource.thumbnail && (
          <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-accent">
            <div className="relative w-full h-full">
              <Image 
                src={resource.thumbnail} 
                alt={resource.title}
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
        )}
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {getIconByType()}
            <p className="text-xs text-muted-foreground">{formatDate(resource.dateAdded)}</p>
          </div>
          
          <h3 className="font-medium text-base truncate">{resource.title}</h3>
          
          {resource.summary && (
            <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
              {resource.summary}
            </p>
          )}
          
          <div className="flex flex-wrap gap-1.5 mt-2">
            {resource.tags.slice(0, 3).map((tag) => (
              <div 
                key={tag} 
                className="tag"
                style={{ 
                  backgroundColor: `${stringToColor(tag)}20`, // 20% opacity
                  color: stringToColor(tag),
                  borderWidth: 1,
                  borderColor: `${stringToColor(tag)}40`, // 40% opacity
                }}
              >
                {tag}
              </div>
            ))}
            
            {resource.tags.length > 3 && (
              <div className="tag bg-accent text-accent-foreground">
                +{resource.tags.length - 3}
              </div>
            )}
          </div>
        </div>
        
        {/* Actions */}
        <a 
          href={resource.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="p-1.5 rounded-md hover:bg-accent flex-shrink-0"
        >
          <ExternalLink size={16} />
        </a>
      </div>
    </motion.div>
  )
}
