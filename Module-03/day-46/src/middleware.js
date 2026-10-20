
import { NextResponse } from 'next/server';

const SESSION_COOKIE_NAME = 'addis_eats_session';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);

  // Check if session cookie exists and has a value
  const isAuthenticated = Boolean(sessionCookie && sessionCookie.value);

  if (!isAuthenticated) {
    // Construct the sign-in URL with the intended destination carried in the 'next' parameter
    const signInUrl = new URL('/auth/login', request.url);
    signInUrl.searchParams.set('next', pathname);

    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

// Config matcher: Scopes middleware strictly to /checkout and /orders routes
export const config = {
  matcher: [
    '/checkout/:path*',
    '/orders/:path*',
  ],
};