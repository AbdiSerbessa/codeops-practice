# Day 56 — The Orders Route Surface (NestJS)

NestJS REST API implementing the `Orders` and nested `Restaurants/:id/orders` routing surface with strict TypeScript (`strict: true`, zero `any`), DTO validation, static-before-dynamic route ordering, and `Page<T>` collection responses.

## Response-Shape Decision (`Page<T>`)

All list endpoints (`GET /api/orders`, `GET /api/orders/pending`, `GET /api/restaurants/:id/orders`) return `Page<T>` (`{ items, total, limit, offset }`) instead of a raw array so clients always receive both the current slice and the total matching count—making multi-page navigation and filter counts clear across 14 seeded orders (4 areas, 5 statuses).

## Endpoints & Rules

- `GET /api/orders` — Filters by optional `status` and `area`, supports `limit` (`@Max(50)` cap: `?limit=999` -> `400`, `?limit=5` -> 5 items), `offset`, and `sort` with defaults; returns `Page<Order>` (`200`).
- `GET /api/orders/pending` — Static route placed **above** `/:id` in `OrdersController` so it appears above `/:id` in the startup log and returns `Page<Order>` (`PENDING` only).
- `GET /api/restaurants/:id/orders` — Validates parent restaurant first; returns `404` when missing (e.g., `/api/restaurants/99/orders`), not `[]`, or `Page<Order>` (`200`).
- `PATCH /api/orders/:id/status` — Updates status using `UpdateStatusDto` validated against the `OrderStatus` union (`200`, `400`, or `404`).
- `DELETE /api/orders/:id` — Returns `204` with an **empty body** on delete, or `404` if not found.

## Run & Verify

```bash
npm install && npm run start:dev   # check startup log: /orders/pending above /:id
npm run build                      # strict TypeScript check