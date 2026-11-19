# Day 59 — Cross-Cutting Concerns (`common/`)

Six cross-cutting concerns implemented centrally in `src/common/` and applied globally without placing any cross-cutting logic inside route handlers.

## Acceptance Criteria

1. **Every response carries `x-request-id`**
   - Implemented in `src/common/request-id.middleware.ts` and applied to `*` in `AppModule`.
   - Honours an incoming `x-request-id` header or generates a UUID, attaching it to both the request (`req.requestId`) and response (`x-request-id`).
2. **A wrong key is `403`, a missing key is `401`**
   - Implemented in `src/common/api-key.guard.ts` and registered globally via `APP_GUARD`.
   - Reads the expected key from configuration (`process.env.API_KEY`) instead of hard-coding it.
3. **`@Roles("staff")` blocks a non-staff caller**
   - Implemented via `@Roles()` (`src/common/roles.decorator.ts`) and `RolesGuard` (`src/common/roles.guard.ts`) using `Reflector.getAllAndOverride`.
   - Registered globally through `APP_GUARD` in `AppModule`.
4. **One log line per request, with a duration**
   - Implemented in `src/common/logging.interceptor.ts` and registered globally via `APP_INTERCEPTOR`.
   - Logs `method`, `path`, `handler`, `outcome` (`success` or `failure`), `duration`, and `requestId` on every request.
5. **A six-second handler answers `408`**
   - Implemented in `src/common/timeout.interceptor.ts` (5000ms cutoff returning `RequestTimeoutException` / `408`) and registered globally via `APP_INTERCEPTOR`.
   - Verified with a deliberate 6000ms delay inside `OrdersService.slowReport()` (`GET /api/v1/orders/slow`).
6. **No handler contains any of the above**
   - All six mechanisms live inside `src/common/` and are wired through `AppModule` (`MiddlewareConsumer`, `APP_GUARD`, `APP_INTERCEPTOR`) or parameter pipes (`@Query('area', ParseAreaPipe)`), keeping controller handlers strictly focused on routing and service delegation.

## Verification

Run the server and execute all 12 requests in `requests-d59.http`:

```bash
npm run start:dev