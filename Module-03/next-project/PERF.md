# Performance Budget & Optimization Pass - Addis Eats

| Metric | Budget Target | Measured (Before) | Measured (After Optimization) | Cause of Improvement / Optimization Technique |
| :--- | :--- | :--- | :--- | :--- |
| **Initial JS Bundle** | `< 180 KB` | 245 KB | 165 KB | Code splitting, removing unused icon libraries, and dynamic imports. |
| **Largest Contentful Paint (LCP)** | `< 2.5 s` | 3.2 s | 1.8 s | Optimized hero banner images, enabled server component streaming, and added `priority` tags. |
| **Cumulative Layout Shift (CLS)** | `< 0.1` | 0.18 | 0.02 | Explicit dimensions set on menu card images and fixed skeletons for async loading states. |
| **Interaction to Next Paint (INP)** | `< 200 ms` | 280 ms | 120 ms | Implemented debouncing on search inputs and optimized React state re-renders. |