# Indexation and Search Console baseline — after the v3 redesign

Recorded 2026-09-30. The redesign was merged to `main` as `a7a39df` ([PR #3](https://github.com/mabdullahbuilt-dev/abdullahbuilt-portfolio/pull/3)). Vercel production deployment `dpl_7gSKBrQMUi1bJsjM9Gec7WHtSwqN` is READY and aliased to `abdullahbuilt.top` and `www.abdullahbuilt.top`.

Sources: the Search Console URL Inspection API and Search Analytics, both read through OpenSEO. Both are read-only and use no credits.

## Property state

| Item | State | Evidence |
|---|---|---|
| URL-prefix property `https://abdullahbuilt.top/` | Active, readable | API reads succeed |
| Domain property `sc-domain:abdullahbuilt.top` | **Not verified** — DNS was not changed (needs owner approval) | Owner report |
| Sitemap `https://abdullahbuilt.top/sitemap.xml` | Submitted 2026-09-30: 27 URLs, 0 errors or warnings at submission. Live file verified on production, with lastmod 2026-09-30 for the 26 redesigned pages | Owner report + production fetch |
| Branded keywords, content groups, topic clusters, 27-URL tracker | Configured by the owner in the Search Console tooling. Not recreated. They are UI settings, so this session could not re-verify them through the API | Owner report |

## Indexation matrix — 27 routes (URL Inspection, 2026-09-30)

These results reflect Google's last crawl (as of 2026-09-24), which predates the redesign. They measure discovery, not the new pages.

| Route | Coverage | Verdict | Last crawl | Google canonical = declared |
|---|---|---|---|---|
| `/` | Submitted and indexed | PASS | 2026-09-24 | yes |
| `/services/` | Discovered – currently not indexed | NEUTRAL | — | — |
| `/services/custom-software-development/` | Submitted and indexed | PASS | 2026-09-24 | yes |
| `/services/saas-development/` | Discovered – currently not indexed | NEUTRAL | — | — |
| `/services/web-application-development/` | Discovered – currently not indexed | NEUTRAL | — | — |
| `/services/api-integration-development/` | Submitted and indexed | PASS | 2026-09-24 | yes |
| `/services/business-automation/` | Discovered – currently not indexed | NEUTRAL | — | — |
| `/services/mvp-product-development/` | Submitted and indexed | PASS | 2026-09-24 | yes |
| `/services/ai-application-development/` | Discovered – currently not indexed | NEUTRAL | — | — |
| `/services/product-rescue/` | URL is unknown to Google | NEUTRAL | — | — |
| `/work/` | Submitted and indexed | PASS | 2026-09-24 | yes |
| `/work/resolve/` | Discovered – currently not indexed | NEUTRAL | — | — |
| `/work/meridian/` | Discovered – currently not indexed | NEUTRAL | — | — |
| `/work/repodiet/` | URL is unknown to Google | NEUTRAL | — | — |
| `/work/agora-forge/` | Discovered – currently not indexed | NEUTRAL | — | — |
| `/guides/` | Discovered – currently not indexed | NEUTRAL | — | — |
| `/guides/hire-saas-developer/` | Discovered – currently not indexed | NEUTRAL | — | — |
| `/guides/hire-web-app-developer/` | Discovered – currently not indexed | NEUTRAL | — | — |
| `/guides/startup-mvp-development/` | URL is unknown to Google | NEUTRAL | — | — |
| `/guides/custom-software-vs-saas/` | URL is unknown to Google | NEUTRAL | — | — |
| `/guides/saas-mvp-development-cost/` | Discovered – currently not indexed | NEUTRAL | — | — |
| `/guides/api-integration-planning/` | Discovered – currently not indexed | NEUTRAL | — | — |
| `/guides/rescue-ai-built-web-app/` | Discovered – currently not indexed | NEUTRAL | — | — |
| `/guides/ai-feature-vs-automation/` | Discovered – currently not indexed | NEUTRAL | — | — |
| `/guides/reliable-webhook-integration/` | Discovered – currently not indexed | NEUTRAL | — | — |
| `/about/` | Discovered – currently not indexed | NEUTRAL | — | — |
| `/contact/` | URL is unknown to Google | NEUTRAL | — | — |

**Totals:**
- Indexed/PASS: 5
- Discovered – not indexed: 17
- Unknown to Google: 5
- Crawled – not indexed: 0
- Canonical issues: 0
- Blocked: 0

"Discovered – currently not indexed" on a new, low-authority domain usually means Google has not yet spent crawl budget on the page. It is not a technical block: none of these URLs is blocked by robots or noindex, and every one is in the sitemap. The lever is authority and internal and external links, not more indexing requests.

## Re-inspection after the SEO deploy (2026-09-30, production `dd82963`)

The five URLs that were "unknown to Google" are now **Discovered – currently not indexed**: `/services/product-rescue/`, `/work/repodiet/`, `/guides/startup-mvp-development/`, `/guides/custom-software-vs-saas/`, `/contact/`. Google has now discovered them from the sitemap and internal links; referring URLs include `/services/custom-software-development/`, `/guides/hire-saas-developer/` and `sitemap.xml`. None is indexed yet.

**Updated totals:**
- Indexed: 5
- Discovered – not indexed: 22
- Unknown: 0

## Performance baseline (Search Analytics)

| Window | Clicks | Impressions | CTR | Avg position |
|---|---|---|---|---|
| 2026-06-27 → 2026-09-27 (3 months) | 2 | 11 | 18.2% | ~5 |

| Page (3 months) | Clicks | Impressions | Position |
|---|---|---|---|
| `/` | 2 | 11 | 5.2 |
| `/services/mvp-product-development/` | 0 | 4 | 2.3 |
| `/work/` | 0 | 4 | 3.5 |
| `/services/api-integration-development/` | 0 | 1 | 5 |
| `/services/custom-software-development/` | 0 | 1 | 4 |

- **Visible queries (3 months):** one row, "aviator" (1 impression, position 40), which is irrelevant.
- **Branded rows:** no rows match "abdullahbuilt", "abdullah built", or "abdullah build". Search Console anonymizes low-volume queries, so this does **not** prove zero branded searches. It is consistent with weak branded presence.
- **Countries:** tiny sample (Pakistan, India, USA). No conclusions.

This sample is far too small for any ranking conclusion. Re-snapshot on the dates in the 30/60/90 plan (`a-to-z-audit.md`).

## Manual Search Console actions (owner, in the Search Console UI)

1. **Sitemaps:** confirm "Last read" is after 2026-09-30, i.e. that the redesign's lastmod values have been fetched.
2. **Request indexing** once each for the hubs and money pages, in this order: `/services/`, `/services/saas-development/`, `/services/ai-application-development/`, `/services/product-rescue/`, `/guides/`, `/about/`. Do not request indexing for all 27 pages; spamming requests does not help.
3. **Indexing tracker:** update the 27 rows from this matrix.
