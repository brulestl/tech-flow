"use client"

import React, { useState, useEffect } from "react"
import { getFromStorage, Collection, generateMockData } from "@/lib/utils"
import { motion } from "framer-motion"
import { 
  FolderOpen, 
  Code, 
  Paintbrush, 
  Server, 
  BarChart, 
  Layout, 
  BookOpen 
} from "lucide-react"

export default function CollectionsGrid() {
  const [collections, setCollections] = useState<Collection[]>([])
  
  useEffect(() => {
    // Generate mock data if none exists
    generateMockData()
    
    const storedCollections = getFromStorage<Collection[]>('collections', [])
    setCollections(storedCollections)
  }, [])
  
  const getIconComponent = (iconName?: string) => {
    switch (iconName) {
      case 'code': return <Code size={24} />;
      case 'paintbrush': return <Paintbrush size={24} />;
      case 'server': return <Server size={24} />;
      case 'chart': return <BarChart size={24} />;
      case 'layout': return <Layout size={24} />;
      case 'book': return <BookOpen size={24} />;
      default: return <FolderOpen size={24} />;
    }
  }
  
  const templates = [
    { name: "UI Components", icon: "layout", color: "var(--accent-purple)" },
    { name: "Architecture", icon: "server", color: "var(--accent-blue)" },
    { name: "Learning Path", icon: "book", color: "var(--accent-green)" },
    { name: "Analytics", icon: "chart", color: "var(--accent-cyan)" },
  ]
  
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {collections.map((collection) => (
          <motion.div
            key={collection.id}
            className="card p-5 cursor-pointer"
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-md bg-accent flex items-center justify-center text-primary">
                {getIconComponent(collection.icon)}
              </div>
              <div>
                <h3 className="font-medium text-lg">{collection.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {collection.resources.length} resources
                </p>
              </div>
            </div>
            
            {collection.description && (
              <p className="text-sm text-muted-foreground mb-3">
                {collection.description}
              </p>
            )}
            
            <div className="mt-4 pt-3 border-t border-border flex justify-between text-sm text-muted-foreground">
              <span>Updated {new Date(collection.dateModified).toLocaleDateString()}</span>
              <button className="text-primary hover:underline">View</button>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Templates section */}
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4">Collection Templates</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {templates.map((template, index) => (
            <motion.div
              key={index}
              className="card p-4 cursor-pointer border border-dashed"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex flex-col items-center text-center p-4">
                <div 
                  className="p-2 rounded-md mb-3" 
                  style={{ 
                    backgroundColor: `${template.color}20`,
                    color: template.color
                  }}
                >
                  {getIconComponent(template.icon)}
                </div>
                <h3 className="font-medium">{template.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">Start with pre-configured structure</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
