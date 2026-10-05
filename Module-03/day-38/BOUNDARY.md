# Component Boundaries - Addis Eats

- **`app/menu/page.js`**: Server Component - Directly fetches and renders dishes from the file system, eliminating client-side bundle weight.
- **`app/menu/CategoryBar.jsx`**: Client Component (`use client`) - Isolated to handle interactive filter buttons and user state changes.
- **`app/providers.jsx`**: Client Component (`use client`) - Encapsulates context providers safely away from server layout logic.