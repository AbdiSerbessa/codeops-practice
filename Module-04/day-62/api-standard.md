# API Authorization & Error Standard (Day 62)

## `404 Not Found` vs. `403 Forbidden` on Order Resources

- **`404 Not Found` (Stranger / Hidden / Missing Order):** Accessing `/orders/:id` for a non-existent order or an order the caller has no read/view relationship with (such as another customer's order or an unassigned courier's order) returns `404`. Hiding existence prevents order ID enumeration across users.
- **`403 Forbidden` (Disallowed Action on an Accessible Order):** When the caller is permitted to view the order (for example, the owning customer or assigned courier) but is not allowed to perform the requested action or transition (such as a customer attempting `PATCH /orders/:id/status` or trying to cancel an already `delivered` order), the API returns `403`.

## Collection Scoping (`GET /orders`)

- `GET /orders` always scopes the returned collection by `req.user`:
  - `staff` / `admin`: returns all orders.
  - `courier`: returns orders assigned to `req.user.id`.
  - `customer`: returns only orders where `order.customerId === req.user.id`.