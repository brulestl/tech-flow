"use client"

import React from "react"
import { Resource, formatDate } from "@/lib/utils"
import { motion } from "framer-motion"
import { ExternalLink, Twitter, Instagram, Code, FileText } from "lucide-react"
import ResourceCard from "@/components/features/ResourceCard"

interface RecentSavesListProps {
  resources: Resource[];
}

export default function RecentSavesList({ resources }: RecentSavesListProps) {
  if (resources.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No recent saves found</p>
        <p className="text-sm text-muted-foreground mt-1">
          Use the + button to save your first resource
        </p>
      </div>
    )
  }
  
  return (
    <div className="space-y-4">
      {resources.map((resource) => (
        <ResourceCard key={resource.id} resource={resource} />
      ))}
    </div>
  )
}
