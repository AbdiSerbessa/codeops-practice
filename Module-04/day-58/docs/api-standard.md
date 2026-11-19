# API Error & Validation Standard (v1 — Day 58)

## Error Response Shape (Five Fields)
Every error response returned by `AllExceptionsFilter` uses the exact same five-field JSON object and never includes a stack trace:

```json
{
  "code": "VALIDATION_ERROR",
  "message": "Readable explanation of what failed.",
  "path": "/api/v1/orders",
  "timestamp": "2026-11-19T13:33:00.000Z",
  "requestId": "req-123"
}