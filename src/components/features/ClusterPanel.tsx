"use client"

import React, { useEffect, useState } from "react"
import { BookOpen, Code, Lightbulb, GraduationCap } from "lucide-react"
import { useRouter } from "next/navigation"

interface Cluster {
  id: number
  title: string
  description: string
  count: number
  resourceIds: string[]
  icon: string
  color: string
}

export default function ClusterPanel() {
  const [clusters, setClusters] = useState<Cluster[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchClusters = async () => {
      try {
        const response = await fetch('/api/clusters')
        if (!response.ok) {
          throw new Error('Failed to fetch clusters')
        }
        const data = await response.json()
        setClusters(data.clusters)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchClusters()
  }, [])

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'BookOpen': return <BookOpen size={20} />
      case 'Code': return <Code size={20} />
      case 'Lightbulb': return <Lightbulb size={20} />
      case 'GraduationCap': return <GraduationCap size={20} />
      default: return <BookOpen size={20} />
    }
  }

  const handleClusterClick = (cluster: Cluster) => {
    // Navigate to search page with cluster filter
    router.push(`/search?cluster=${cluster.id}`)
  }

  if (isLoading) {
    return (
      <div className="card p-4">
        <h2 className="text-lg font-medium mb-4">Suggested Clusters</h2>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin text-2xl">⟳</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card p-4">
        <h2 className="text-lg font-medium mb-4">Suggested Clusters</h2>
        <div className="p-4 bg-destructive/10 text-destructive rounded-md">
          {error}
        </div>
      </div>
    )
  }

  if (clusters.length === 0) {
    return (
      <div className="card p-4">
        <h2 className="text-lg font-medium mb-4">Suggested Clusters</h2>
        <p className="text-muted-foreground text-center py-8">
          Add more resources to see suggested clusters
        </p>
      </div>
    )
  }

  return (
    <div className="card p-4">
      <h2 className="text-lg font-medium mb-4">Suggested Clusters</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {clusters.map((cluster) => (
          <button
            key={cluster.id}
            onClick={() => handleClusterClick(cluster)}
            className="cluster-card p-4 rounded-lg border border-border hover:border-primary/50 transition-colors text-left"
            style={{ backgroundColor: `${cluster.color}10` }}
          >
            <div className="flex items-start gap-3">
              <div 
                className="p-2 rounded-md flex-shrink-0"
                style={{ backgroundColor: `${cluster.color}20` }}
              >
                {getIcon(cluster.icon)}
              </div>
              <div>
                <h3 className="font-medium mb-1">{cluster.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {cluster.description}
                </p>
                <p className="text-xs text-muted-foreground">
                  {cluster.count} {cluster.count === 1 ? 'resource' : 'resources'}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
