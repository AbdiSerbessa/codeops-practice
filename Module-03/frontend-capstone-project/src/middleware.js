import { NextResponse } from 'next/server';

const SESSION_COOKIE_NAME = 'addis_eats_session';
const USER_COOKIE_NAME = 'addis_eats_user';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value || '';
  const userCookie = request.cookies.get(USER_COOKIE_NAME)?.value || '';

  const combinedAuth = (sessionCookie + ' ' + userCookie).toLowerCase();
  const isAuthenticated = Boolean(sessionCookie || userCookie);

  // Define authorized admin/staff criteria
  const isAuthorizedStaff =
    combinedAuth.includes('abdiserbessa19@gmail.com') ||
    combinedAuth.includes('staff');

  // 1. Strict RBAC for /dashboard and /track: Admin & Staff only
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/track')) {
    if (!isAuthorizedStaff) {
      const redirectUrl = new URL(isAuthenticated ? '/menu' : '/auth/login', request.url);
      redirectUrl.searchParams.set('error', 'unauthorized');
      if (!isAuthenticated) redirectUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // 2. Auth check for /checkout and /orders (Any authenticated user)
  if (pathname.startsWith('/checkout') || pathname.startsWith('/orders')) {
    if (!isAuthenticated) {
      const signInUrl = new URL('/auth/login', request.url);
      signInUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/checkout/:path*',
    '/orders/:path*',
    '/dashboard/:path*',
    '/track/:path*', // <--  restricted to admin and staff only
  ],
};