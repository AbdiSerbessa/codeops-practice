# Performance Optimization Report (`PERF.md`)

**Project:** Addis Eats  
**Module:** Full-Stack Software Development — Day 43 Performance & Optimization  

---

## 1. Summary of Performance Metrics (Before vs. After)

| Metric | Before Optimization | After Optimization | Change / Improvement |
| :--- | :--- | :--- | :--- |
| **Performance Score** | **41** | **91** | **+50 points** (In the Green) |
| **First Contentful Paint (FCP)** | 2.1 s | **0.9 s** | Reduced by 1.2 s |
| **Largest Contentful Paint (LCP)** | 6.3 s | **3.2 s** | Reduced by 3.1 s |
| **Total Blocking Time (TBT)** | 6,340 ms | **160 ms** | Reduced by 6,180 ms |
| **Cumulative Layout Shift (CLS)** | 0 | **0** | Perfect score maintained |
| **Speed Index** | 5.2 s | **0.9 s** | Reduced by 4.3 s |

---

## 2. Root Cause Analysis & Optimization Breakdown

### 1. Image Optimization (`next/image`)
* **Changes Made:** 
  * Replaced standard HTML `<img>` tags in `DishCard.jsx` with Next.js `<Image>` components.
  * Configured explicit image dimensions (`width` and `height`) and an accurate `sizes` attribute.
  * Added `priority={index === 0}` strictly to the largest above-the-fold dish image.
* **Impact:** Drastically reduced LCP and bandwidth consumption by delivering responsive, modern image formats (WebP/AVIF) sized specifically for the user's viewport.

### 2. Self-Hosted Fonts (`next/font/google`)
* **Changes Made:** 
  * Removed external Google Fonts `<link>` stylesheets.
  * Integrated `Inter` from `next/font/google` in `src/app/layout.js` with `display: 'swap'` and applied `inter.className` to the root `<html>` element.
* **Impact:** Next.js self-hosts font files at build time, eliminating external render-blocking network requests to `fonts.googleapis.com` and guaranteeing zero layout shifts (**CLS = 0**).

### 3. Lazy Script Loading (`next/script`)
* **Changes Made:** 
  * Imported `Script` from `next/script` in `src/app/layout.js`.
  * Positioned third-party script support with `strategy="lazyOnload"`.
* **Impact:** Deferring non-critical external scripts to browser idle time frees up the main execution thread, keeping initial render fast and responsive.

### 4. Clean Environment Setup & Production Build
* **Changes Made:** 
  * Created a committed `.env.example` file with placeholder values.
  * Verified that `.env*.local` is ignored in `.gitignore` to protect credentials.
  * Executed testing against an optimized production build (`npm run build` && `npm run start`).
* **Impact:** Testing on a production build removed Development Hot Module Replacement (HMR) overhead and unminified dev bundles, dropping Total Blocking Time from 6,340 ms down to a clean **160 ms**.