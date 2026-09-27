# AbdullahBuilt SEO implementation report

Generated: 2026-09-27

## Implemented in the migration branch

- Preserved the approved interactive keychain homepage structure and interactions.
- Kept all 27 canonical routes as 200-status, indexable pages with unique titles, descriptions, one H1, canonical URLs, Open Graph metadata, JSON-LD, contextual internal links, and visible CTAs.
- Reconciled the migration sitemap to all 27 valuable routes; redirects, the private inbox route, test paths, and previews are excluded.
- Kept Vercel previews protected with noindex response and metadata directives.
- Added service workflow diagrams, guide decision matrices, related proof modules, contextual service handoffs, and analytics event hooks.
- Re-encoded the largest rendered assets as equivalent WebP files; the approved homepage portrait fell from about 2 MB to 76 KB without changing layout.
- Expanded regression coverage for sitemap membership, duplicate metadata, canonicals, schema, Open Graph, alt text, inbound links, dead destinations, contextual CTAs, and discovery files.

## GSC baseline

The verified property is https://abdullahbuilt.top/. URL Inspection found 5 indexed routes, 4 discovered but not indexed routes, and 18 routes unknown to Google. GSC's sitemap list still displays its older 19-submitted count, while the live sitemap fetch and migration branch contain all 27. No indexing request or sitemap resubmission is made against a preview; refresh the production property only after an approved cutover.

## Research

OpenSEO researched SaaS, AI application, AI agent, web application, API integration, business automation, MVP, product-rescue, and hiring/planning clusters separately in the US, UK, and Canada. Ubersuggest was used once for the highest-priority web-application query as a controlled cross-check. Values are preserved by source and unavailable metrics are marked UNKNOWN. Ahrefs evidence remains UNKNOWN because both connected accounts returned Insufficient plan.

## Verification boundary

The optimized production build, 36 HTTP/SEO assertions, and the 27-route server-rendered regression pass locally. Local browser launch is blocked because the Playwright CDN returns a zero-byte/truncated Chromium archive; rendered preview verification is performed with the authenticated cloud browser instead. Production sitemap resubmission and indexing requests remain intentionally gated behind an approved production cutover; DNS and the live deployment were not changed.
