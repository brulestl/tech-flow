"use client"

import React, { useEffect, useState } from "react"
import { BookOpen, Code, Lightbulb, GraduationCap } from "lucide-react"
import { useRouter } from "next/navigation"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { kmeans, type Cluster } from "@/lib/kmeans"

export default function ClusterPanel() {
  const supabase = useSupabaseClient()
  const [clusters, setClusters] = useState<Cluster[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchClusters = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError) throw userError
        if (!user) throw new Error('Please connect your social media account to start saving resources')

        const { data: embeddings, error: resourceError } = await supabase
          .from('resources')
          .select('embedding')
          .eq('user_id', user.id)

        if (resourceError) {
          if (resourceError.code === 'PGRST116') {
            setError('Please connect your social media account to start saving resources')
            return
          }
          throw resourceError
        }

        if (!embeddings || embeddings.length === 0) {
          setClusters([])
          return
        }

        // Convert embeddings to number[][]
        const embeddingArrays = embeddings
          .filter(e => e.embedding && Array.isArray(e.embedding))
          .map(e => e.embedding as number[])

        if (embeddingArrays.length === 0) {
          setClusters([])
          return
        }

        const clusters = kmeans(embeddingArrays, 4)
        setClusters(clusters)
      } catch (err) {
        console.error('Error fetching clusters:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchClusters()
  }, [supabase])

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
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">{error}</p>
          {error.includes('connect your social media account') && (
            <div className="mt-4">
              <p className="text-sm text-muted-foreground mb-2">
                To get started, please connect your social media account:
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => supabase.auth.signInWithOAuth({ provider: 'twitter' })}
                  className="btn btn-outline"
                >
                  Connect Twitter
                </button>
                <button
                  onClick={() => supabase.auth.signInWithOAuth({ provider: 'github' })}
                  className="btn btn-outline"
                >
                  Connect GitHub
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (clusters.length === 0) {
    return (
      <div className="card p-4">
        <h2 className="text-lg font-medium mb-4">Suggested Clusters</h2>
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            Add more resources to see suggested clusters
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Clusters are automatically generated based on your saved resources
          </p>
        </div>
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
