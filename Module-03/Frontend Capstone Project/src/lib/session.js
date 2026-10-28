import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = 'addis_eats_session';

/**
 * Creates and sets a secure session cookie.
 * @param {Object} sessionData - e.g. { userId: '123', email: 'user@example.com', role: 'user' }
 */
export async function createSession(sessionData) {
  const cookieStore = await cookies();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const sessionValue = JSON.stringify({
    ...sessionData,
    expiresAt: expiresAt.toISOString(),
  });

  cookieStore.set({
    name: SESSION_COOKIE_NAME,
    value: sessionValue,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 1 week duration
  });
}

/**
 * Retrieves and parses the session payload on any server context (Pages, Server Actions, API routes).
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
 * Deletes the session cookie (logs out).
 */
export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}