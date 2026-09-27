# AbdullahBuilt SEO implementation report

Generated: 2026-09-27

## Implemented in the migration branch

- Preserved the approved interactive keychain homepage structure and interactions.
- Kept all 27 canonical routes as 200-status, indexable pages with unique titles, descriptions, one H1, canonical URLs, Open Graph metadata, JSON-LD, contextual internal links, and visible CTAs.
- Reconciled the migration sitemap to all 27 valuable routes; redirects, the private inbox route, test paths, and previews are excluded.
- Kept Vercel previews protected with noindex response and metadata directives.
- Added service workflow diagrams, guide decision matrices, related proof modules, contextual service handoffs, and analytics event hooks.
- Re-encoded the largest rendered assets as equivalent WebP files; the approved homepage portrait fell from about 2 MB to 76 KB without changing layout.
- Removed the render-blocking third-party font request, deferred the below-the-fold Cal.com embed until it approaches the viewport, fixed the homepage subpixel horizontal overflow, and supplied real fallback destinations for dynamic project-dialog links.
- Added desktop and mobile full-page evidence for the homepage, services hub, service detail, guides hub, guide article, case study, and contextual contact flow.
- Expanded regression coverage for sitemap membership, duplicate metadata, canonicals, schema, Open Graph, alt text, inbound links, dead destinations, contextual CTAs, and discovery files.

## GSC baseline

The verified property is https://abdullahbuilt.top/. URL Inspection found 5 indexed routes, 4 discovered but not indexed routes, and 18 routes unknown to Google. GSC's sitemap list still displays its older 19-submitted count, while the live sitemap fetch and migration branch contain all 27. No indexing request or sitemap resubmission is made against a preview; refresh the production property only after an approved cutover.

## Research

OpenSEO researched SaaS, AI application, AI agent, web application, API integration, business automation, MVP, product-rescue, and hiring/planning clusters separately in the US, UK, and Canada. Ubersuggest was used once for the highest-priority web-application query as a controlled cross-check. Values are preserved by source and unavailable metrics are marked UNKNOWN. Ahrefs evidence remains UNKNOWN because both connected accounts returned Insufficient plan.

## Verification boundary

The optimized production build, 27-route server-rendered SEO regression, 72 HTTP checks, and 76 rendered Playwright checks pass. Lighthouse 13.5.0 measured four representative page types at 97–99 Performance and 100 SEO, Accessibility, and Best Practices; detailed metrics and raw reports are in `docs/performance-report.md` and `docs/qa/`. Production sitemap resubmission and indexing requests remain intentionally gated behind an approved production cutover; DNS and the live deployment were not changed.
