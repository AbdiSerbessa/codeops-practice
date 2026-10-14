
import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = 'addis_eats_session';

/**
 * Creates and sets a secure session cookie.
 * @param {Object} sessionData - e.g. { userId: '123', email: 'user@example.com', role: 'user' }
 */
export async function createSession(sessionData) {
  const cookieStore = await cookies();
  const sessionValue = JSON.stringify({
    ...sessionData,
    createdAt: Date.now(),
  });

  cookieStore.set(SESSION_COOKIE_NAME, sessionValue, {
    httpOnly: true, // Prevents client-side JS access (XSS protection)
    secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
    sameSite: 'lax', // Protects against CSRF attacks
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 1 week duration
  });
}

/**
 * Retrieves and parses the session payload on any server surface (Pages, Server Actions, API routes).
 * @returns {Object|null} Session data or null if invalid/missing
 */
export async function getSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }

  try {
    return JSON.parse(sessionCookie.value);
  } catch (error) {
    console.error('Failed to parse session cookie:', error);
    return null;
  }
}

/**
 * Destroys the current session cookie (Sign-out).
 */
export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}