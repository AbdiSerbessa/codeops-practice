# Day 61: Replace the API Key (JWT Auth & Refresh Rotation)

NestJS authentication service replacing static API key scaffolding with `argon2` password and refresh-token hashing, `HS256` JWT access and refresh tokens, token rotation, a global `JwtAuthGuard` with a `@Public()` decorator, structured `pino` redaction, and Swagger Bearer authentication.

## What Was Built

- **User Domain & Seeding (`src/users/`)**: `User` model with `email`, `argon2` `passwordHash`, `roles`, and `refreshHash` behind a repository interface, seeded with three initial users (including a `staff` account).
- **Authentication & Token Rotation (`src/auth/`)**:
  - `POST /auth/register` — returns `201` with safe user fields (never returning password or refresh hashes) and `409` on duplicate email.
  - `POST /auth/login` — uses a single generic failure response for invalid credentials and returns an access token plus a refresh token.
  - `POST /auth/refresh` — verifies the stored refresh hash and rotates both access and refresh tokens[cite: 13].
  - `GET /auth/me` — returns the authenticated `req.user` payload[cite: 13].
- **Guards & Strategy (`src/auth/`)**: `JwtStrategy` pinned to `HS256` and a globally registered `JwtAuthGuard` supporting `@Public()` routes[cite: 13].
- **Public vs. Protected Endpoints**: `GET /restaurants` is public (`@Public()`) and works without a token; `/orders` endpoints are protected by the global `JwtAuthGuard`[cite: 13].
- **API Key Removal, Redaction & Swagger**: Removed `ApiKeyGuard` and API key scaffolding, configured log redaction so no hashes or secrets appear in logs, and swapped `addApiKey` for `addBearerAuth` in Swagger (`/docs`)[cite: 13].

## Environment Setup

1. Copy `.env.example` to `.env` (`.env` is git-ignored and never committed)[cite: 13]:
   ```bash
   cp .env.example .env

   # Install dependencies & build
npm install
npm run build

# Start in development mode
npm run start:dev