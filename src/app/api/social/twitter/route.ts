import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { TwitterApi } from 'twitter-api-v2'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const tweetUrl = searchParams.get('url')

    if (!tweetUrl) {
      return NextResponse.json(
        { error: 'Tweet URL is required' },
        { status: 400 }
      )
    }

    // Extract tweet ID from URL
    const tweetId = tweetUrl.split('/').pop()?.split('?')[0]
    if (!tweetId) {
      return NextResponse.json(
        { error: 'Invalid tweet URL' },
        { status: 400 }
      )
    }

    // Get user's Twitter credentials from Supabase
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { data: credentials } = await supabase
      .from('social_credentials')
      .select('access_token, refresh_token')
      .eq('user_id', session.user.id)
      .eq('platform', 'twitter')
      .single()

    if (!credentials) {
      return NextResponse.json(
        { error: 'Twitter credentials not found' },
        { status: 401 }
      )
    }

    // Initialize Twitter client
    const client = new TwitterApi(credentials.access_token)

    // Fetch tweet data
    const tweet = await client.v2.singleTweet(tweetId, {
      expansions: ['author_id', 'attachments.media_keys'],
      'media.fields': ['url', 'preview_image_url', 'type'],
      'user.fields': ['name', 'username', 'profile_image_url']
    })

    if (!tweet.data) {
      return NextResponse.json(
        { error: 'Tweet not found' },
        { status: 404 }
      )
    }

    // Transform tweet data to Resource format
    const resource = {
      title: `Tweet by ${tweet.includes?.users?.[0]?.name || 'Unknown'}`,
      content: tweet.data.text,
      thumbnail_url: tweet.includes?.media?.[0]?.preview_image_url || tweet.includes?.media?.[0]?.url || null,
      created_at: tweet.data.created_at,
      source_url: tweetUrl,
      source_type: 'twitter',
      metadata: {
        author: {
          name: tweet.includes?.users?.[0]?.name,
          username: tweet.includes?.users?.[0]?.username,
          profile_image: tweet.includes?.users?.[0]?.profile_image_url
        },
        media: tweet.includes?.media?.map(media => ({
          type: media.type,
          url: media.url || media.preview_image_url
        }))
      }
    }

    return NextResponse.json(resource)
  } catch (error) {
    console.error('Error fetching tweet:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tweet data' },
      { status: 500 }
    )
  }
} 