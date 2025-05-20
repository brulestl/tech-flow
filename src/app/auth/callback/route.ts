import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/dashboard';

  if (code) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // Exchange the code for a session
    const { data: { session }, error: sessionError } = await supabase.auth.exchangeCodeForSession(code);
    
    if (sessionError) {
      console.error('Error exchanging code for session:', sessionError);
      return NextResponse.redirect(new URL('/login', requestUrl.origin));
    }

    // Get the provider token from the session
    const providerToken = session?.provider_token;
    const provider = session?.provider_refresh_token ? 'twitter' : 'github';

    if (providerToken) {
      // Update the user_connections table
      const { error: updateError } = await supabase
        .from('user_connections')
        .upsert({
          user_id: session.user.id,
          [`${provider}_username`]: providerToken,
          updated_at: new Date().toISOString()
        });

      if (updateError) {
        console.error('Error updating user connections:', updateError);
      }
    }

    // The session cookie is automatically set by Supabase
    // No need to manually set it
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL(next, requestUrl.origin));
} 