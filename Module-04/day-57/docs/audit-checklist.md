# Route Audit Checklist (9 Rules vs. 9 Routes)

| # | Route / Endpoint | Rule Checked | Status | Audit & Rename Rationale (One Sentence) |
| :--- | :--- | :--- | :--- | :--- |
| 1 | `GET /api/v1/restaurants` | Plural noun resource naming | Pass | Uses plural noun `restaurants` under versioned `/api/v1` with no action verbs. |
| 2 | `GET /api/v1/restaurants/:id` | Resource identifier & URI versioning | Pass | Identifies a single restaurant by numeric `:id` under `/api/v1`. |
| 3 | `POST /api/v1/restaurants` | Create via `POST` on collection URI | Pass | Creates a restaurant on the collection resource and returns `201` with `Location`. |
| 4 | `DELETE /api/v1/restaurants/:id` | Idempotent `DELETE` on item URI | Pass | Deletes a restaurant by `:id` and returns `204` consistently across repeated calls. |
| 5 | `GET /api/v1/orders` | Query-driven filtering instead of RPC paths | Renamed | Replaced ad-hoc `/orders/pending` action path with `GET /api/v1/orders?status=PENDING` so filtering uses query parameters consistently. |
| 6 | `GET /api/v1/orders/:id` | Consistent resource lookup by ID | Pass | Retrieves a single order by numeric `:id` under the versioned `/api/v1/orders` resource. |
| 7 | `GET /api/v1/restaurants/:id/orders` | Nested sub-resource hierarchy | Renamed | Normalized nested order lookup under `/api/v1/restaurants/:id/orders` with parent restaurant validation. |
| 8 | `POST /api/v1/orders` | Create order on collection URI | Pass | Creates a new order on `/api/v1/orders` and returns `201` with a `Location` header. |
| 9 | `PATCH /api/v1/orders/:id/status` & `DELETE /api/v1/orders/:id` | Partial state update & idempotent delete | Renamed | Scoped status transitions to `PATCH /api/v1/orders/:id/status` and made `DELETE /api/v1/orders/:id` return `204` idempotently on repeat calls. |