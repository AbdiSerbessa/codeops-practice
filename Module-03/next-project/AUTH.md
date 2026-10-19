# Authentication & Three-Layer Protection - Addis Eats

## Protected Routes
* `/checkout` - Requires an active authenticated session.
* `/orders/[id]` - Requires order ownership verification.
* `/kitchen` - Restricted to administrative / kitchen staff roles.

---

## The Three-Layer Protection Model

1. **Layer 1: Edge / Middleware Protection (`middleware.js`)**
   * **What it does:** Intercepts incoming requests at the edge before rendering.
   * **What it proves:** Prevents unauthorized URL navigation instantly by checking authentication cookies/tokens, redirecting guests to `/auth/login`.

2. **Layer 2: Server Actions & API Route Verification (`src/app/api/...` or Server Actions)**
   * **What it does:** Re-validates user session tokens and user ID payload signatures on every backend mutation or data fetch.
   * **What it proves:** Secures server-side business logic against direct API tool calls (e.g., Postman) even if the frontend client routing is bypassed.

3. **Layer 3: Client-Side Context & Route Guards (`Providers.jsx` / Guard Components)**
   * **What it does:** Conditionally renders UI elements (like checkout buttons or user profile links) based on active auth context state.
   * **What it proves:** Enhances user experience by hiding protected views and managing client-side reactive state safely.

---
