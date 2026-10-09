# Addis Eats - Server and Client Boundary Placement

## Overview
Addis Eats strictly maintains clean boundaries between the server and the browser, ensuring that client-side components only handle UI interactions and state, while business logic, database queries, and mutations remain strictly on the server.

## 1. Server Boundary (Server Components & Modules)
* **Files**: `src/lib/db.js`, `src/app/actions.js`, `src/app/menu/page.js`, and API route handlers.
* **Boundary Defense**: 
  * **Database Protection**: `db.js` holds the in-memory array data (`mockDishes`, `mockOrders`) and ORM query interfaces. Keeping this file strictly on the server prevents direct client-side modification of mock records.
  * **Secure Actions**: Form submissions trigger Server Actions (`placeOrder`), ensuring that validation rules and order insertions execute on the server environment.

## 2. Client Boundary (Client Components)
* **Files**: `src/app/checkout/CheckoutContent.jsx`, `src/app/providers.js`, and filter/interactive components.
* **Boundary Defense**:
  * **Selective Hydration**: The `'use client'` directive is used exclusively where browser interactivity or hooks are strictly required (e.g., `useSearchParams`, `useActionState`, and React context providers).
  * **Serialization Safety**: By separating `CheckoutContent` from the static server page wrapper, we prevent prerendering serialization errors and guarantee that client hooks execute safely inside browser hydration boundaries.