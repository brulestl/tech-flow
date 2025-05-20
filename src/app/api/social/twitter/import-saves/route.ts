import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { TwitterApi } from 'twitter-api-v2';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Initialize Twitter client with app credentials
const client = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY!,
  appSecret: process.env.TWITTER_API_SECRET!,
  accessToken: process.env.TWITTER_ACCESS_TOKEN!,
  accessSecret: process.env.TWITTER_ACCESS_SECRET!,
});

export async function POST(request: Request) {
  try {
    const { userId, accessToken } = await request.json();

    if (!userId || !accessToken) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Create a client with the user's access token
    const userClient = new TwitterApi(accessToken);

    // Fetch bookmarked tweets
    const bookmarks = await userClient.v2.bookmarks({
      expansions: ['attachments.media_keys', 'author_id'],
      'media.fields': ['url', 'preview_image_url'],
      'user.fields': ['username', 'name'],
    });

    // Transform tweets into Resource objects
    const resources = bookmarks.data.map(tweet => ({
      title: tweet.text.substring(0, 100) + (tweet.text.length > 100 ? '...' : ''),
      url: `https://twitter.com/${tweet.author_id}/status/${tweet.id}`,
      thumbnail: tweet.attachments?.media_keys?.[0]?.preview_image_url || null,
      dateSaved: new Date(tweet.created_at).toISOString(),
      source: 'twitter',
      sourceId: tweet.id,
      metadata: {
        author: tweet.author_id,
        likes: tweet.public_metrics?.like_count || 0,
        retweets: tweet.public_metrics?.retweet_count || 0,
      },
    }));

    // Get existing resources to deduplicate
    const { data: existingResources } = await supabase
      .from('resources')
      .select('sourceId')
      .eq('userId', userId)
      .eq('source', 'twitter');

    const existingIds = new Set(existingResources?.map(r => r.sourceId) || []);
    const newResources = resources.filter(r => !existingIds.has(r.sourceId));

    // Bulk insert new resources
    if (newResources.length > 0) {
      const { error } = await supabase
        .from('resources')
        .insert(
          newResources.map(r => ({
            ...r,
            userId,
          }))
        );

      if (error) throw error;
    }

    return NextResponse.json({
      imported: newResources.length,
      total: resources.length,
      skipped: resources.length - newResources.length,
    });
  } catch (error) {
    console.error('Error importing Twitter bookmarks:', error);
    return NextResponse.json(
      { error: 'Failed to import bookmarks' },
      { status: 500 }
    );
  }
} 