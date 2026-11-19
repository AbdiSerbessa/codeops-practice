# API Standard (v1)

## 1. Naming
- All resource paths use **lowercase plural nouns** (`restaurants`, `orders`) and kebab-case for multi-word segments.
- Sub-resources use hierarchical paths (`GET /api/v1/restaurants/:id/orders`) with parent existence checked before returning collection results.
- Filtering by state (such as `PENDING`) is expressed via query parameters (`?status=PENDING`) rather than separate action-style endpoints.

## 2. Versioning
- **URI Versioning** is enabled globally with prefix `api` and `defaultVersion: '1'`.
- All active endpoints are served under `/api/v1/...`.
- Unversioned requests (such as `/api/restaurants`) are not matched and return `404 Not Found`.

## 3. Methods
- `GET` — Read collections (`Page<T>`) or single resources by ID; never mutates state.
- `POST` — Creates a resource on a collection endpoint, returns `201 Created`, and sets the `Location` header to `/api/v1/<resource>/<id>`.
- `PATCH` — Performs a partial update on a specific resource sub-path such as `/api/v1/orders/:id/status`.
- `DELETE` — Removes a resource by ID and returns `204 No Content` with an empty body; calling `DELETE` twice on the same ID remains idempotent and still returns `204`.

## 4. Response Shapes
- **Single-item endpoints** (`GET /api/v1/orders/:id`, `GET /api/v1/restaurants/:id`, `POST ...`, `PATCH ...`) return the resource JSON object directly.
- **Collection endpoints** (`GET /api/v1/orders`, `GET /api/v1/restaurants`, `GET /api/v1/restaurants/:id/orders`) return a `Page<T>` object:
  ```json
  {
    "items": [],
    "total": 0,
    "limit": 10,
    "offset": 0
  }