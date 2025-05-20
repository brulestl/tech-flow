import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { log } from '@/lib/logger';

// List of public routes that don't require authentication
const publicRoutes = [
  '/',
  '/login',
  '/signup',
  '/api/auth',
  '/auth/callback',
  '/_next',
  '/favicon.ico',
  '/api/social'
];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Refresh session if expired
  const {
    data: { session },
  } = await supabase.auth.getSession();

  log('Session:', session);

  // Check if the route is public
  const isPublicRoute = publicRoutes.some(route => 
    req.nextUrl.pathname === route || 
    req.nextUrl.pathname.startsWith(`${route}/`)
  );

  log('Is Public Route:', isPublicRoute);

  // If the route is not public and there's no session, redirect to login
  if (!isPublicRoute && !session) {
    const redirectUrl = new URL('/login', req.url);
    redirectUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname);
    log('Redirecting to login:', redirectUrl.toString());
    return NextResponse.redirect(redirectUrl);
  }

  // If user is logged in and tries to access login/signup, redirect to dashboard
  if (session && (req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/signup')) {
    log('Redirecting to dashboard from login/signup');
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // If user is logged in and tries to access home, redirect to dashboard
  if (session && req.nextUrl.pathname === '/') {
    log('Redirecting to dashboard from home');
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return res;
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}; 