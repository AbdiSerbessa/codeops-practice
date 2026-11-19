# Day 60 

## Acceptance Criteria Checklist
1. **Every line is one JSON object:** Structured logging via `nestjs-pino` (`pino-http`) outputs one JSON object per line.
2. **All lines from one request share a `requestId`:** `RequestIdMiddleware` sets `x-request-id` on request/response and stores it in `AsyncLocalStorage`, read by `OrdersService` without method arguments.
3. **`check-logs.sh` finds no secret or phone number:** Redacts `authorization`, `x-api-key`, and phone fields (`[REDACTED]`).
4. **`/docs` lists endpoints with summaries & failure codes:** Swagger UI is mounted at `/docs` with tags, `api-key` scheme, summaries, and failure responses.
5. **Try it out places a real order:** `POST /api/v1/orders` accepts a valid body and creates an order.
6. **`openapi.json` is committed:** Generated on startup via `setupSwagger(app)` and committed to the repository.