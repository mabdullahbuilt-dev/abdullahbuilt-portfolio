# ABDULLAHBUILT — PORTFOLIO COMPLETE / READY FOR COMPANY WEBSITE

Recorded 2026-09-30.

**Labels:**
- **DONE**: implemented, deployed to production and verified.
- **ONGOING**: waiting on Google, time, or third parties. Nothing is left to implement.
- **NOT APPLICABLE**: a deliberate, evidence-based decision.
- **BLOCKED BY EXTERNAL ACCESS**: needs an account or system this session cannot reach.

## Production
| Item | Value |
|---|---|
| Production `main` | `4fd38fe` (merge of [PR #5](https://github.com/mabdullahbuilt-dev/abdullahbuilt-portfolio/pull/5)); earlier merges: [PR #3](https://github.com/mabdullahbuilt-dev/abdullahbuilt-portfolio/pull/3) (redesign) and [PR #4](https://github.com/mabdullahbuilt-dev/abdullahbuilt-portfolio/pull/4) (SEO) |
| Deployment | Vercel `dpl_8hRE8frB5rs3cWt8eQWAStrvu17C`, target production, READY |
| Real domain | The deployment's aliases include `abdullahbuilt.top`, and `www.abdullahbuilt.top` redirects to the apex (Vercel alias API). This sandbox cannot reach the apex host, so content was verified on the same deployment's public alias. |
| CI | `verify` passed on the PR #5 head (`2a0b448`) |

## Status by category

| Category | Status | Evidence |
|---|---|---|
| 27/27 routes | DONE | All return 200, apex canonical, `index, follow`, one H1, valid JSON-LD; `og:url` is on the apex and there are no stale project URLs (production fetch after `4fd38fe`) |
| Machine routes | DONE | `sitemap.xml` (27 URLs, lastmod 2026-09-30), `robots.txt`, `feed.xml` (9/9 guides), `llms.txt`, `llms-full.txt`, `.well-known/ai.txt`, `ai/summary.json`, `ai/service.json`, `ai/faq.json`, `main.js`. `*.vercel.app` copies return `X-Robots-Tag: noindex` |
| Sitemap | DONE / ONGOING | Live and correct, and submitted by the owner on 2026-09-30. Google's last crawl was 2026-09-24, so no refetch yet |
| Indexation | ONGOING | 5 indexed, 14 discovered, 8 unknown, 0 errors. No technical blocks. Details in `indexation-and-gsc-baseline.md` |
| Technical SEO | DONE | HTTPS + HSTS; apex canonical host; `www` → apex; trailing slashes consistent; no noindex leak; vercel.app noindex; SSR content; Lighthouse SEO 100 on the pages tested |
| On-page SEO | DONE | Unique titles ending "\| AbdullahBuilt"; one H1 per page; descriptions, OG and Twitter tags; breadcrumbs; contextual CTAs |
| Structured data | DONE | Person / ProfessionalService / WebSite graph; Service, Article, CollectionPage, AboutPage, ContactPage, FAQPage and BreadcrumbList; SoftwareApplication `url` = real product domains. Parsed on every route in CI |
| Entity / brand SEO | DONE (on site) / ONGOING (off site) | Muhammad Abdullah → Full-Stack Engineer → AbdullahBuilt → abdullahbuilt.top → LinkedIn, GitHub, Facebook `sameAs` → 4 projects with the role stated. Brand SERP change is ongoing |
| Project-domain work | DONE | useresolve.stream, meridianarc.stream, repodiet.uk and the owner-approved circle-arc-net.vercel.app are in every UI, schema, AI and résumé location; CI guards against the old deployments |
| Keyword strategy | DONE | Intent map for 27 pages (`keyword-page-map.md`); no invented volumes |
| Internal linking | DONE | 0 orphans, max depth 2 (`internal-link-graph.md`) |
| Content SEO | DONE | Page-specific content; provider-neutral AI page; failure modes written as engineering patterns; the unverified hackathon claim was removed |
| Programmatic SEO | NOT APPLICABLE (current stage) | Only 5 pages are indexed; the pilot conditions are in `a-to-z-audit.md` |
| Verified backlinks | DONE (baseline) | Owned GitHub mentions only. The GSC Links report is UI-only |
| Backlinks actually created | NOT APPLICABLE → ONGOING | 0 live links created. There is no authorized external access, and nothing was fabricated |
| GitHub / profile work | DONE (repo) / BLOCKED BY EXTERNAL ACCESS (profiles) | The README now carries the entity facts, profiles and project links. Profile website fields and the repo homepage field need a GitHub or LinkedIn login |
| Project-site attribution | BLOCKED BY EXTERNAL ACCESS | The product repos are outside this session and the sites are egress-blocked. The recommended footer credit is documented |
| Digital PR | NOT APPLICABLE (now) | There is no verified news hook, and the hackathon claim is removed. The webhook guide is the distribution asset |
| Video SEO | NOT APPLICABLE until a video exists | No VideoObject markup; the 9-video plan is in `brand-entity-and-authority.md` |
| Image SEO | DONE | WebP images with fixed dimensions; sanitized screenshots; eager LCP; lazy loading below the fold; alt text; OG image |
| GEO / AEO | DONE | AI discovery files carry the brand, profiles and projects; AI crawlers allowed; no claims of AI visibility |
| Search Console | DONE (configured) / ONGOING (data) | 27 URLs inspected after deploy. Branded tracking, content groups and clusters were set up by the owner in the UI, and the API cannot re-verify them |
| Algorithm monitoring | DONE | `search-change-log.md` with the official sources and a no-panic rule |
| CI / regression | DONE | `seo-regression.yml` runs lint, build, HTTP/SEO tests (sitemap parity, JSON-LD, titles, entity, project URLs, host noindex, feed), browser tests (mobile overflow, interactions) and `seo-regression.mjs` |
| EMD / domain | NOT APPLICABLE (decision) | No keyword domains. Buying the defensive `.com` is optional and needs owner approval |

## Tests (final)
- lint: 0 errors
- tsc: clean
- build: OK
- Playwright: 400/400 (desktop + mobile)
- `seo:audit`: passed, 27 URLs
- link graph: 0 orphans
- CI `verify`: passed

## Ongoing (not implementation failures)
- **Google crawling and indexing.** Next checkpoint: 2026-10-14.
- **Search impressions.** Snapshots at +14, +30, +60 and +90 days.
- **Owner UI or login actions** (optional; nothing else is waiting on these):
  - Request indexing once for `/services/`, `/services/saas-development/`, `/services/ai-application-development/`, `/services/product-rescue/`, `/guides/` and `/about/`.
  - Set the GitHub and LinkedIn website fields to https://abdullahbuilt.top/.
  - Set the repo homepage field.
  - Add a footer credit on the three product sites.
- **Recording video #1.**
- **Community distribution of the webhook guide.**
