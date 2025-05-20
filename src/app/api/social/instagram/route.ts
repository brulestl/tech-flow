import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { IgApiClient } from 'instagram-private-api'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const postUrl = searchParams.get('url')

    if (!postUrl) {
      return NextResponse.json(
        { error: 'Instagram post URL is required' },
        { status: 400 }
      )
    }

    // Extract post ID from URL
    const postId = postUrl.split('/p/')[1]?.split('/')[0]
    if (!postId) {
      return NextResponse.json(
        { error: 'Invalid Instagram post URL' },
        { status: 400 }
      )
    }

    // Get user's Instagram credentials from Supabase
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
      .eq('platform', 'instagram')
      .single()

    if (!credentials) {
      return NextResponse.json(
        { error: 'Instagram credentials not found' },
        { status: 401 }
      )
    }

    // Initialize Instagram client
    const ig = new IgApiClient()
    ig.state.generateDevice(credentials.access_token)
    await ig.account.login(credentials.access_token, credentials.refresh_token)

    // Fetch post data
    const post = await ig.media.info(postId)

    // Transform post data to Resource format
    const resource = {
      title: `Instagram post by ${post.user.username}`,
      content: post.caption?.text || '',
      thumbnail_url: post.image_versions2?.candidates?.[0]?.url || null,
      created_at: new Date(post.taken_at * 1000).toISOString(),
      source_url: postUrl,
      source_type: 'instagram',
      metadata: {
        author: {
          username: post.user.username,
          full_name: post.user.full_name,
          profile_image: post.user.profile_pic_url
        },
        media: post.carousel_media?.map(media => ({
          type: media.media_type,
          url: media.image_versions2?.candidates?.[0]?.url
        })) || [{
          type: post.media_type,
          url: post.image_versions2?.candidates?.[0]?.url
        }]
      }
    }

    return NextResponse.json(resource)
  } catch (error) {
    console.error('Error fetching Instagram post:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Instagram post data' },
      { status: 500 }
    )
  }
} 