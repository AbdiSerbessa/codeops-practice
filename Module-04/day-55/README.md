# Day 55 — The Dishes Resource (NestJS + Clean Architecture)

A standalone NestJS REST API module for managing dishes across restaurants, built with strict TypeScript, custom Dependency Injection (`DISH_REPOSITORY` / `RESTAURANT_REPOSITORY`), DTO validation, and a framework-agnostic service layer.

## Features & Architecture

- **Pure TypeScript Service Layer (`DishesService`):** Zero imports from `@nestjs/common`. Wired via a factory provider (`useFactory`) in `DishesModule`.
- **Custom Repository Tokens:**
  - `DISH_REPOSITORY` (`InMemoryDishRepository`) seeded with 8 Ethiopian dishes across 4 restaurants.
  - `RESTAURANT_REPOSITORY` (`InMemoryRestaurantRepository`) exported from `RestaurantsModule` to verify `restaurantId` foreign keys.
- **DTO Validation:** Enforced globally via `ValidationPipe` (`whitelist: true`, `transform: true`) and `CreateDishDto` (`name` required non-empty string, `priceSantim` integer $\ge 1$, `restaurantId` integer $\ge 1$).
- **Status Code Design (Missing Restaurant Rejection):**
  - `POST /api/dishes` with a non-existent `restaurantId` throws a domain `RestaurantNotFoundError` in `DishesService` and maps to **`422 Unprocessable Entity`** in `DishesController` (the JSON syntax and field types are valid, so `400` is inappropriate, and the `/api/dishes` route exists, so `404` is misleading; `422` accurately signals a semantic/referential integrity error).

## Setup & Running

```bash
# 1. Install dependencies
npm install

# 2. Run in development watch mode
npm run start:dev

# 3. Build for production (strict TypeScript check)
npm run build