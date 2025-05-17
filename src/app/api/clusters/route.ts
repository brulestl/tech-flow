import 'openai/shims/node'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

// Simple K-means implementation
function kMeans(embeddings: number[][], k: number, maxIterations = 100) {
  // Initialize centroids randomly
  let centroids = embeddings.slice(0, k)
  let clusters: number[][] = Array(k).fill([]).map(() => [])
  let oldClusters: number[][] = []

  for (let iteration = 0; iteration < maxIterations; iteration++) {
    // Assign points to nearest centroid
    clusters = Array(k).fill([]).map(() => [])
    for (let i = 0; i < embeddings.length; i++) {
      let minDist = Infinity
      let cluster = 0
      for (let j = 0; j < k; j++) {
        const dist = cosineDistance(embeddings[i], centroids[j])
        if (dist < minDist) {
          minDist = dist
          cluster = j
        }
      }
      clusters[cluster].push(i)
    }

    // Check if clusters have stabilized
    if (JSON.stringify(clusters) === JSON.stringify(oldClusters)) {
      break
    }
    oldClusters = JSON.parse(JSON.stringify(clusters))

    // Update centroids
    for (let i = 0; i < k; i++) {
      if (clusters[i].length > 0) {
        centroids[i] = averageEmbedding(clusters[i].map(idx => embeddings[idx]))
      }
    }
  }

  return clusters
}

function cosineDistance(a: number[], b: number[]) {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0)
  const normA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0))
  const normB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0))
  return 1 - (dotProduct / (normA * normB))
}

function averageEmbedding(embeddings: number[][]) {
  const dim = embeddings[0].length
  return Array(dim).fill(0).map((_, i) => 
    embeddings.reduce((sum, emb) => sum + emb[i], 0) / embeddings.length
  )
}

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Get the current user
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch resources with their embeddings
    const { data: resources, error: resourcesError } = await supabase
      .from('resources')
      .select(`
        id,
        title,
        description,
        embedding,
        resource_tags (
          tags (
            name
          )
        )
      `)
      .eq('user_id', session.user.id)

    if (resourcesError) {
      console.error('Error fetching resources:', resourcesError)
      return NextResponse.json({ error: 'Failed to fetch resources' }, { status: 500 })
    }

    if (!resources || resources.length === 0) {
      return NextResponse.json({ clusters: [] })
    }

    // Extract embeddings and prepare data for clustering
    const embeddings = resources.map(r => r.embedding)
    const k = Math.min(4, resources.length) // Use at most 4 clusters
    const clusters = kMeans(embeddings, k)

    // Process each cluster
    const processedClusters = await Promise.all(clusters.map(async (clusterIndices, index) => {
      const clusterResources = clusterIndices.map(idx => resources[idx])
      
      // Get common tags in this cluster
      const tagCounts = new Map<string, number>()
      clusterResources.forEach(resource => {
        resource.resource_tags?.forEach((rt: any) => {
          const tagName = rt.tags.name
          tagCounts.set(tagName, (tagCounts.get(tagName) || 0) + 1)
        })
      })

      // Sort tags by frequency
      const commonTags = Array.from(tagCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([tag]) => tag)

      // Generate cluster title and description using OpenAI
      const titles = clusterResources.map(r => r.title).join(', ')
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that generates concise titles and descriptions for clusters of resources. Keep titles under 5 words and descriptions under 15 words."
          },
          {
            role: "user",
            content: `Generate a title and description for a cluster containing these resources: ${titles}. Common tags: ${commonTags.join(', ')}. Format as JSON: {"title": "title", "description": "description"}`
          }
        ],
        response_format: { type: "json_object" }
      })

      const clusterInfo = JSON.parse(response.choices[0].message.content)

      return {
        id: index,
        title: clusterInfo.title,
        description: clusterInfo.description,
        count: clusterResources.length,
        resourceIds: clusterResources.map(r => r.id),
        icon: getClusterIcon(index),
        color: getClusterColor(index)
      }
    }))

    return NextResponse.json({ clusters: processedClusters })
  } catch (error) {
    console.error('Error computing clusters:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function getClusterIcon(index: number) {
  const icons = ['BookOpen', 'Code', 'Lightbulb', 'GraduationCap']
  return icons[index % icons.length]
}

function getClusterColor(index: number) {
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6']
  return colors[index % colors.length]
} 