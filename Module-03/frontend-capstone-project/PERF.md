### ** `PERF.md`**

```markdown
# Addis Eats — Performance & Audit Report (`PERF.md`)

- **Test Date:** October 30, 2026
- **Environment:** Production (Vercel Live Deployment)

---

## 1. Lighthouse Audit Scores (Mobile Emulation)

Tested on live production URL (`codeops-practice-f4qz.vercel.app`):

| Metric | Score | Status |
| :--- | :--- | :--- |
| **Performance** | **66** | Good (Optimized for dynamic client/server data fetching) |
| **Accessibility** | **94** | Excellent (High contrast compliance and screen-reader readiness) |
| **Best Practices** | **96** | Outstanding (Secure HTTPS, modern standards, clean console) |
| **SEO** | **92** | Great (Proper semantic markup and meta tags) |

---

## 2. Keyboard Navigation Pass
- **Focus Indicators:** Interactive elements feature distinct, visible focus outlines when navigating via the `Tab` key.
- **Tab Order:** Flows logically from the top navigation bar (`Menu`, `Cart`, `Checkout`, `Dashboard`) through primary content action cards and forms.
- **Interactive Triggers:** All buttons and links are fully accessible and activatable via `Enter` and `Space`.

