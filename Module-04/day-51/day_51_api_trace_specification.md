# Day 51: In-Class Exercise — Trace and Document a Real API

**Project:** Addis Eats (Module 3 → Backend Transition)  
**Track:** Shared — All Tracks  

---

## 1. Real API Request Trace

Six distinct HTTP requests captured from the Addis Eats application via Browser DevTools (`Network` → `Fetch/XHR`):

| # | Method | Full Path | Status Code | Carried Request Body? |
| :--- | :--- | :--- | :--- | :--- |
| 1 | `GET` | `/api/menu` | `200 OK` | No |
| 2 | `POST` | `/api/auth/login` | `200 OK` | Yes (`{ "email": "...", "password": "..." }`) |
| 3 | `GET` | `/api/cart` | `200 OK` | No |
| 4 | `POST` | `/api/orders` | `201 Created` | Yes (`{ "items": [...], "deliveryAddress": "...", "paymentMethod": "..." }`) |
| 5 | `GET` | `/api/orders/ord_829/stream` | `200 OK` | No |
| 6 | `GET` | `/api/admin/metrics` | `403 Forbidden` | No |

---

## 2. Request & Response Headers Analysis

### A. Request 1: `POST /api/auth/login`

* **Request Headers:**
  1. `Content-Type: application/json` — Tells the server that the payload data in the request body is formatted as JSON.
  2. `User-Agent: Mozilla/5.0...` — Identifies the browser, operating system, and client environment making the request.
  3. `Accept: application/json` — Informs the server that the client expects a JSON-formatted response.

* **Response Headers:**
  1. `Set-Cookie: addis_eats_session=...; Path=/; HttpOnly` — Instructs the browser to securely store the session cookie for subsequent authenticated requests.
  2. `Content-Type: application/json; charset=utf-8` — Specifies that the response body is JSON encoded in UTF-8.
  3. `Cache-Control: no-store` — Prevents browsers and intermediate proxies from caching sensitive authentication responses.

---

### B. Request 2: `GET /api/menu`

* **Request Headers:**
  1. `Host: localhost:3000` — Specifies the domain name and port number of the target server.
  2. `Accept-Encoding: gzip, deflate, br` — Tells the server which compression algorithms the browser supports to reduce payload size.
  3. `Connection: keep-alive` — Keeps the underlying TCP network connection open for reuse across multiple HTTP requests.

* **Response Headers:**
  1. `Content-Type: application/json; charset=utf-8` — Indicates that the returned menu payload is formatted as JSON.
  2. `Cache-Control: public, max-age=60` — Instructs the browser or CDN that the menu data can be cached for up to 60 seconds.
  3. `ETag: W/"12345-abc"` — Provides a unique version identifier for the resource so the client can perform conditional cache validation.

---

## 3. Failing Request Analysis

* **Request Triggered:** `GET /api/admin/metrics` while authenticated as a standard customer (`abdis@gmail.com`).
* **Status Code Returned:** `403 Forbidden`
* **Was this status code the right choice?**  
  **Yes.** In HTTP semantics, `401 Unauthorized` should only be returned when a client has not provided valid authentication credentials at all (i.e., the user is logged out). Because the user *was* logged in and identified by the server, `403 Forbidden` is the exact right choice—it communicates that the server understands who the user is, but denies access due to insufficient role permissions (RBAC).

---

## 4. Planned Addis Eats Backend API Endpoints

| Method | Path | Purpose | Expected Success Status |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/menu` | Retrieve all available traditional Ethiopian dishes and category filters | `200 OK` |
| `POST` | `/api/auth/register` | Create a new customer account in the database | `201 Created` |
| `POST` | `/api/auth/login` | Authenticate user credentials and issue secure session cookies | `200 OK` |
| `POST` | `/api/orders` | Submit a new order with selected dishes and delivery coordinates | `201 Created` |
| `GET` | `/api/orders/:id/stream` | Establish a Server-Sent Events (SSE) stream for live courier tracking | `200 OK` |
| `PATCH` | `/api/admin/orders/:id` | Update an order's preparation or delivery status (Staff/Admin only) | `200 OK` |