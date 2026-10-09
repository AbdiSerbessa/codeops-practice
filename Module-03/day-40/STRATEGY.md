# Addis Eats - Rendering Strategy

## Overview
The Addis Eats application is built using the Next.js App Router, leveraging a hybrid rendering strategy that combines static prerendering, server-side data fetching, and selective client-side interactivity to optimize performance and user experience.

## 1. Menu Page (`/menu`)
* **Strategy**: Server-rendered data fetching with client-side filter interactivity.
* **Justification**: The menu page fetches traditional Ethiopian dish records directly from our mock ORM database (`db.dish.findMany()`) on the server. This ensures fast initial page loads and secure server-side execution. URL query parameters (`search` and `category`) are handled dynamically to filter the dish catalog seamlessly.

## 2. Checkout Page (`/checkout`)
* **Strategy**: Prerendered static shell with a `Suspense`-bounded Client Component.
* **Justification**: Because the checkout flow utilizes `useSearchParams()` to capture selected dish identifiers, direct static prerendering would normally trigger a bailout error. By decoupling the interactive form into `CheckoutContent.jsx` and wrapping it in a React `<Suspense>` boundary, Next.js can successfully prerender the static layout shell while deferring search-parameter evaluation to runtime.

## 3. Data Layer & Mutations
* **Strategy**: Server Actions (`actions.js`) backed by an in-memory database ORM (`db.js`).
* **Justification**: Order creation, validation, and status updates are processed securely via Server Actions. This prevents sensitive data operations from leaking into the client-side JavaScript bundle and ensures robust form state management using React `useActionState`.