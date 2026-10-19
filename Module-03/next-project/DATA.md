# Data Fetching & SWR Strategy - Addis Eats

| Query / Feature | Type | Cache Key | Refresh Rule / Revalidation | Reasoning |
| :--- | :--- | :--- | :--- | :--- |
| **Menu Catalog** | Server / Client Hybrid | `['menu-items', category]` | Revalidate on tag / Stale-While-Revalidate (SWR) | Ensures instant load via server components while allowing client category filtering without full page reloads. |
| **Single Dish Detail** | Server | `['dish', id]` | Static generation with incremental ISR / fetch caching | Optimizes SEO and performance for individual food items. |
| **Active Order Status** | Client (SWR Polling) | `['order-status', orderId]` | Polled every `3000ms` (`refreshInterval: 3000`) | Gives real-time kitchen tracking for delivery orders without WebSocket complexity. |
| **Live Search Query** | Client | `['search-menu', debouncedQuery]` | Debounced (`300ms` delay) on keystroke | Prevents excessive API/database queries while the user types dish names. |