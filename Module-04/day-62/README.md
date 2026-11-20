# Module 4 — Day 62: Six Rules, Enforced

NestJS authorization service enforcing role-based access control (RBAC), resource-level policy evaluation (`OrderPolicy`), collection scoping on `GET /orders`, `404` vs. `403` error semantics, and Vitest policy unit tests.

## What Was Built

- **Roles & Optional `restaurantId` (`src/users/`)**: Added `roles` and optional `restaurantId` to `User`, seeded users across roles (`customer1`, `customer2`, `courier`, `staff`, `admin`), and included `roles` (and `restaurantId`) in JWT payloads.
- **Role-Based Guard (`@Roles` & `RolesGuard`)**: Enforces route-level role rules globally right after `JwtAuthGuard`[cite: 8, 9].
- **Order Policy (`src/orders/order.policy.ts`)**: Evaluates `read`, `cancel`, and `updateStatus` with a `staff` bypass at the top and an `assertNever` exhaustiveness check so adding a new action breaks compilation until handled[cite: 8, 9].
- **Policy Guard & Decorator (`@CheckPolicy()` & `OrderPolicyGuard`)**: Loads the order once, stashes it on `req.order`, returns `404` for strangers/unreadable orders, and returns `403` for disallowed actions on accessible orders[cite: 8, 9].
- **Collection Scoping (`GET /orders`)**: Filters `GET /orders` by `req.user` (full list for `staff`/`admin`, assigned orders for `courier`, own orders for `customer`)[cite: 8, 9].
- **Policy Specs & Error Standard**: Six Vitest policy specs in `src/orders/order.policy.spec.ts` (with majority asserting refusal) and the `404` vs. `403` rationale documented in `api-standard.md`[cite: 8, 9].

## Running & Testing

```bash
# Build
npm run build

# Run unit/policy tests
npx vitest run

# Start development server
npm run start:dev