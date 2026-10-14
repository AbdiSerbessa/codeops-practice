# Addis Eats - Authentication & Authorization Architecture (`AUTH.md`)

This document outlines the security layers implemented across the Addis Eats application to protect routes, enforce data ownership, and manage role-based access control.

---

## 1. Protected Routes & Matchers

| Route Pattern | Protection Layer | Purpose |
| :--- | :--- | :--- |
| `/checkout/:path*` | Edge Middleware & Server Session | Restricts checkout access to authenticated users only. |
| `/orders/:path*` | Edge Middleware & Data Ownership Check | Restricts order history and status tracking to authenticated owners or staff. |
| `/kitchen` | Server-Side Component Verification | Restricts kitchen operations exclusively to users with `role: 'staff'`. |

---

## 2. Security Layers & Verification Mechanism

### Layer 1: Edge Middleware (`src/middleware.js`)
* **What it checks**: Inspects the `addis_eats_session` HTTP-only cookie before the request reaches the page renderer.
* **Behavior**: Unauthenticated requests to `/checkout` or `/orders` are redirected immediately to `/auth/login?next=[pathname]`[cite: 13].

### Layer 2: Session Helper (`src/lib/session.js`)
* **Cookie Flags**: Configured with `httpOnly: true` (XSS defense), `secure` in production (HTTPS enforcement), and `sameSite: 'lax'` (CSRF protection)[cite: 13].
* **Unified API**: `getSession()` parses and verifies session payloads across Server Components, API route handlers, and Server Actions[cite: 13].

### Layer 3: Open Redirect Defense (`src/app/auth/login/page.jsx`)
* **Sanitization**: Intercepts the `next` search parameter during login and validates that it begins with a single slash (`/`) and does not start with `//` or external protocols, preventing external phishing/redirection attacks[cite: 13].

### Layer 4: Data Ownership & Scoping (`src/app/api/orders/[id]/route.js`)
* **Server-side validation**: Ensures that queries and API mutations check `order.userId === session.userId`. Users cannot read or modify another account's orders by manipulating IDs[cite: 13].

### Layer 5: Role-Based Access Control (`src/app/kitchen/page.jsx`)
* **Staff Verification**: Evaluates `session.role === 'staff'` server-side inside the `/kitchen` route, returning a `403 Forbidden` response for unauthorized accounts[cite: 13].