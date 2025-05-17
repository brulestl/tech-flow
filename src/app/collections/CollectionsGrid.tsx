"use client"

import React, { useState, useEffect } from "react"
import { CollectionWithResourceCount, getCollections, deleteCollection } from "@/lib/dataService"
import { motion } from "framer-motion"
import { Folder, Plus, MoreVertical, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import NewCollectionModal from "@/components/collections/NewCollectionModal"

export default function CollectionsGrid() {
  const [collections, setCollections] = useState<CollectionWithResourceCount[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showNewModal, setShowNewModal] = useState(false)
  const [showDropdown, setShowDropdown] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  
  const loadCollections = async () => {
    try {
      setIsLoading(true)
      const data = await getCollections()
      setCollections(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load collections')
    } finally {
      setIsLoading(false)
    }
  }
  
  useEffect(() => {
    loadCollections()
  }, [])
  
  const handleDelete = async (collection: CollectionWithResourceCount) => {
    if (!confirm('Are you sure you want to delete this collection?')) return
    
    try {
      await deleteCollection(collection.id)
      setCollections(prev => prev.filter(c => c.id !== collection.id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete collection')
    }
  }

  const handleCollectionCreated = () => {
    loadCollections()
    setSuccessMessage('Collection created successfully')
    setTimeout(() => setSuccessMessage(null), 3000)
  }
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin text-2xl">⟳</div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-destructive mb-2">Error loading collections</p>
        <p className="text-muted-foreground">{error}</p>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {collections.length} collections
        </p>
        
        <button 
          className="btn btn-primary flex items-center gap-2"
          onClick={() => setShowNewModal(true)}
        >
          <Plus size={18} />
          New Collection
        </button>
      </div>

      {successMessage && (
        <div className="p-3 bg-green-500/10 text-green-500 rounded-md text-sm">
          {successMessage}
        </div>
      )}
      
      {collections.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {collections.map(collection => (
            <div key={collection.id} className="relative">
              <Link 
                href={`/collections/${collection.id}`}
                className="block"
              >
                <motion.div 
                  className="card p-5 hover:bg-accent/50 transition-colors"
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Folder size={24} className="text-primary" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-base truncate">
                        {collection.name}
                      </h3>
                      
                      {collection.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">
                          {collection.description}
                        </p>
                      )}
                      
                      <p className="text-xs text-muted-foreground mt-2">
                        {collection.resource_count} {collection.resource_count === 1 ? 'resource' : 'resources'}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </Link>
              
              <div className="absolute top-2 right-2">
                <button
                  className="p-1.5 rounded-md hover:bg-accent"
                  onClick={(e) => {
                    e.preventDefault()
                    setShowDropdown(showDropdown === collection.id ? null : collection.id)
                  }}
                >
                  <MoreVertical size={16} />
                </button>
                
                {showDropdown === collection.id && (
                  <div className="absolute right-0 mt-1 w-48 bg-card rounded-md shadow-lg border border-border z-10">
                    <div className="py-1">
                      <Link
                        href={`/collections/${collection.id}/edit`}
                        className="w-full px-4 py-2 text-sm text-left hover:bg-accent flex items-center gap-2"
                        onClick={() => setShowDropdown(null)}
                      >
                        <Edit size={16} />
                        Edit Collection
                      </Link>
                      <button
                        className="w-full px-4 py-2 text-sm text-left hover:bg-accent flex items-center gap-2 text-destructive"
                        onClick={() => {
                          setShowDropdown(null)
                          handleDelete(collection)
                        }}
                      >
                        <Trash2 size={16} />
                        Delete Collection
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground mb-2">No collections yet</p>
          <p className="text-muted-foreground">
            Create your first collection to organize your resources
          </p>
        </div>
      )}
      
      <NewCollectionModal
        open={showNewModal}
        onOpenChange={setShowNewModal}
        onSuccess={handleCollectionCreated}
      />
    </div>
  )
}
