import 'openai/shims/node'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 })
    }

    const supabase = createRouteHandlerClient({ cookies })

    // Get the current user
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Generate embedding for the query
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: query,
      encoding_format: "float"
    })

    const queryEmbedding = embeddingResponse.data[0].embedding

    // Perform vector similarity search
    const { data: resources, error: searchError } = await supabase
      .rpc('match_resources', {
        query_embedding: queryEmbedding,
        match_threshold: 0.7,
        match_count: 10,
        p_user_id: session.user.id
      })

    if (searchError) {
      console.error('Search error:', searchError)
      return NextResponse.json({ error: 'Failed to search resources' }, { status: 500 })
    }

    return NextResponse.json(resources)
  } catch (error) {
    console.error('Semantic search error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 