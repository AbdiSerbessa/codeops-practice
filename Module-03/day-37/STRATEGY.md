# Routing Strategies for Addis Eats

- **`/` (Home)**: Static – Rendered at build time for optimal performance.
- **`/menu`**: Incremental Static Regeneration (ISR) with `revalidate = 60` – Refreshes periodically while serving cached static output.
- **`/menu/[id]`**: Static via `generateStaticParams` – Pre-renders known dish pages at build time.
- **`/checkout`**: Dynamic (`force-dynamic`) – Requires runtime execution for user-specific cart and checkout processing.