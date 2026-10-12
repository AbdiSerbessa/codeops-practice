# Addis Eats - Data Fetching & SWR Strategy

This document outlines all SWR data queries used across the Addis Eats application, justifying their SWR key structure, refresh rules, and cache settings.

---

## 1. Live Order Tracking (`/orders/[id]`)

* **Query Key**: `/api/orders/${orderId}`
* **SWR Hook Call**:
  ```javascript
  useSWR(`/api/orders/${orderId}`, fetcher, {
    fallbackData: initialData,
    refreshInterval: 5000,
  })