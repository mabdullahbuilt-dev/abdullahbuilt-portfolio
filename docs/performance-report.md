# Performance validation

Measured: 2026-09-27  
Tool: Lighthouse 13.5.0, mobile simulated throttling, optimized local production build

| Page type | Performance | LCP | CLS | TBT | TTFB | Transfer |
|---|---:|---:|---:|---:|---:|---:|
| Homepage | 97 | 2.51 s | 0.033 | 52 ms | 6 ms | 288 KB |
| SaaS service | 98 | 2.11 s | 0 | 94 ms | 76 ms | 171 KB |
| API guide | 99 | 1.98 s | 0 | 87 ms | 22 ms | 171 KB |
| Contextual contact | 98 | 1.67 s | 0 | 138 ms | 17 ms | 170 KB |

All four runs scored 100 for SEO, Accessibility, and Best Practices. The homepage remains the largest page because its approved interactive keychain portrait and project imagery are visible content, but the initial transfer is below 300 KB after WebP conversion and calendar deferral.

INP is a field metric and is not produced by a single Lighthouse lab navigation. TBT is recorded as the lab responsiveness proxy; no run exceeded 138 ms. Raw Lighthouse JSON is stored in `docs/qa/lighthouse-*.json`.
