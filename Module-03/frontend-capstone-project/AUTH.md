# Addis Eats — Authentication & Security Architecture (`AUTH.md`)

This document outlines the security model, session management, and route protection mechanisms implemented in the Addis Eats platform.

---

## 1. Authentication Strategy
Addis Eats uses a **cookie-based session architecture** to securely verify user identities and maintain login states across client and server interactions.

- **Credentials Verification:** Users log in using their email and password. The authentication API validates credentials against stored user accounts (handling both pre-seeded records and dynamically registered sessions).
- **Session Cookie (`addis_eats_session`):** Upon successful authentication, a secure session cookie is written to the client browser, storing minimal user identifiers (such as email and role).

---

## 2. Route Middleware Protection (`middleware.js`)
Next.js Edge Middleware intercepts incoming requests before they reach the page render lifecycle, enforcing strict perimeter security.

- **Protected Path Matchers:** The middleware automatically scans requests targeting sensitive user routes:
  - `/checkout/:path*`
  - `/orders/:path*`
- **Redirection Logic:** If an unauthenticated request lacks a valid `addis_eats_session` cookie, the middleware intercepts the request and redirects the user to the sign-in portal (`/auth/login`), preserving their original intended destination via the `next` query parameter.

```javascript
export const config = {
  matcher: [
    '/checkout/:path*',
    '/orders/:path*',
  ],
};