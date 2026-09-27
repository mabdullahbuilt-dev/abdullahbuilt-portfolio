# AbdullahBuilt SEO implementation report

Generated: 2026-09-27

## Implemented in the migration branch

- Preserved the approved interactive keychain homepage source exactly.
- Kept all 27 canonical routes as 200-status, indexable pages with unique titles, descriptions, one H1, canonical URLs, Open Graph metadata, JSON-LD, contextual internal links, and visible CTAs.
- Reconciled the migration sitemap to all 27 valuable routes; redirects, the private inbox route, test paths, and previews are excluded.
- Kept Vercel previews protected with noindex response and metadata directives.
- Kept robots, sitemap, RSS, llms.txt, llms-full.txt, AI discovery files, and entity schema in source control.
- Expanded automated regression coverage for exact sitemap membership, duplicate titles/descriptions, canonicals, schema JSON, Open Graph, image alt attributes, inbound links, dead internal destinations, and discovery files.

## GSC baseline

The verified property is https://abdullahbuilt.top/. URL Inspection found 5 indexed routes, 10 discovered but not indexed routes, and 12 routes unknown to Google. The old submitted sitemap reports 19 URLs while the migration branch contains all 27. The new sitemap must not be submitted until this branch is approved and promoted to production, because Google cannot fetch preview-only source as the canonical production sitemap.

## Research

OpenSEO researched the highest-priority commercial seed separately in the US, UK, and Canada. Ubersuggest was used once for the same US seed as a controlled cross-check. Values are preserved by source because CPC differs between providers. Ahrefs evidence is UNKNOWN: both connected accounts returned Insufficient plan even for free subscription/project reads.

## Verification boundary

The optimized production build, all 28 HTTP/SEO tests, and the 27-route server-rendered regression pass locally. Browser automation requires a Chromium binary or the Vercel preview. Production sitemap resubmission, indexing requests, preview screenshots, and final performance evidence remain intentionally gated behind branch push, Vercel preview creation, and approval; DNS and the live deployment were not changed.
