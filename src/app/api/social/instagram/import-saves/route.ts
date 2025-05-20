import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { IgApiClient } from 'instagram-private-api';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { userId, accessToken } = await request.json();

    if (!userId || !accessToken) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Initialize Instagram client
    const ig = new IgApiClient();
    ig.state.generateDevice(process.env.IG_USERNAME!);
    await ig.account.login(process.env.IG_USERNAME!, process.env.IG_PASSWORD!);

    // Fetch saved posts
    const savedFeed = ig.feed.saved();
    const savedPosts = await savedFeed.items();

    // Transform posts into Resource objects
    const resources = savedPosts.map(post => ({
      title: post.caption?.text?.substring(0, 100) + (post.caption?.text?.length > 100 ? '...' : '') || 'Instagram Post',
      url: `https://instagram.com/p/${post.code}/`,
      thumbnail: post.image_versions2?.candidates?.[0]?.url || null,
      dateSaved: new Date(post.taken_at * 1000).toISOString(),
      source: 'instagram',
      sourceId: post.id,
      metadata: {
        author: post.user.username,
        likes: post.like_count || 0,
        comments: post.comment_count || 0,
        mediaType: post.media_type,
      },
    }));

    // Get existing resources to deduplicate
    const { data: existingResources } = await supabase
      .from('resources')
      .select('sourceId')
      .eq('userId', userId)
      .eq('source', 'instagram');

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
    console.error('Error importing Instagram saves:', error);
    return NextResponse.json(
      { error: 'Failed to import saved posts' },
      { status: 500 }
    );
  }
} 