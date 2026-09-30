# A-to-Z SEO audit — AbdullahBuilt (post-redesign)

- **Recorded:** 2026-09-30
- **Main:** `a7a39df` (redesign live)
- **SEO branch:** `claude/seo-a-to-z`
- **Evidence:**
  - Production fetches of all 27 routes
  - GSC URL Inspection and Search Analytics (free, via OpenSEO)
  - Local production build with Playwright and Lighthouse 12 (free)
  - Free web search
- **No paid credits used.**

**Status labels:**
- IMPLEMENTED + VERIFIED
- IMPLEMENTED BUT NOT VERIFIED
- PARTIAL
- PLANNED ONLY
- NOT IMPLEMENTED
- NOT APPLICABLE
- BLOCKED

| # | Discipline | Status | Evidence | What was done in this program | Next |
|---|---|---|---|---|---|
| 1 | Technical SEO | IMPLEMENTED + VERIFIED | 27/27 routes 200 on production; `trailingSlash`; HSTS; Lighthouse SEO 100 on 4 representative pages | vercel.app aliases now send `X-Robots-Tag: noindex` (SEO branch, tested) | Verify the header on production after merge |
| 2 | Crawlability | IMPLEMENTED + VERIFIED | robots allows all, including AI crawlers; no orphans; max click depth 2 (`internal-link-graph.md`) | Link graph script added | — |
| 3 | Indexation | PARTIAL | 5 indexed / 17 discovered / 5 unknown (`indexation-and-gsc-baseline.md`) | Matrix refreshed | Owner: request indexing for 6 priority URLs; re-inspect +14 days |
| 4 | Sitemap | IMPLEMENTED + VERIFIED | 27 URLs; truthful lastmod; submitted 2026-09-30 (owner); CI test enforces route parity | Parity test added | Confirm "last read" date in GSC |
| 5 | Robots | IMPLEMENTED + VERIFIED | Production robots.txt fetched | — | — |
| 6 | Canonicals | IMPLEMENTED + VERIFIED | Apex canonical and matching `og:url` on all 27; Google canonical = declared on indexed pages | — | — |
| 7 | Metadata | IMPLEMENTED + VERIFIED | Unique titles and descriptions | Homepage title/description now brand-first; titles end "\| AbdullahBuilt" (the entity name) instead of "Abdullah Built"; CI test | Watch branded CTR |
| 8 | Structured data | IMPLEMENTED + VERIFIED | JSON-LD parses on every route (CI); Breadcrumb rich results PASS on indexed pages | Person → `brand` and `worksFor` → AbdullahBuilt; business `logo`/`image`; clean project images; vibe-coded FAQ added to FAQPage | Rich Results Test on 2 pages after merge (owner or Chrome) |
| 9 | Internal linking | IMPLEMENTED + VERIFIED | No orphans; automation had 0 related guides (fixed); case studies had 0 guide links (fixed) | Service ↔ guide ↔ case-study links strengthened | Vary rail anchors (P2) |
| 10 | Keyword research | PARTIAL | GSC has almost no query data; no paid volumes | 27-page map with evidence (`keyword-page-map.md`) | Re-run with GSC data at +60 days |
| 11 | SERP intent | PARTIAL | 4 live search-result samples (SaaS services = agencies; hire guide = guides + marketplaces; webhook = technical articles; rescue = "vibe code rescue") | Rescue terminology gap closed | Sample the remaining priority queries |
| 12 | Topical authority | PARTIAL | 7 clusters mapped below; 9 guides | — | Add pages only for distinct intent |
| 13 | Content quality | IMPLEMENTED + VERIFIED | Page-specific content; generic boilerplate removed in the redesign | — | Owner experience inputs |
| 14 | AI-content quality | IMPLEMENTED + VERIFIED | No mass generation; no invented clients, metrics, or prices; unverifiable specifics (provider names, anecdotes, awards) are omitted | — | — |
| 15 | Programmatic SEO | NOT IMPLEMENTED (by decision) | No structured data model with distinct, validated intents yet; see decision below | Opportunity study | Revisit when GSC shows long-tail demand |
| 16 | Image SEO | PARTIAL | WebP, fixed dimensions, lazy below the fold, descriptive alts; screenshots sanitized; OG image present | — | AVIF/responsive `srcset` for case-study images (P2) |
| 17 | Video SEO | NOT APPLICABLE (no videos) | No VideoObject (correct) | Roadmap in `brand-entity-and-authority.md` | Owner records video 1 |
| 18 | GitHub authority | BLOCKED | Profile has no website; repos lack descriptions/homepages; two case-study repos owned by others | Audit + exact actions | Owner edits (10 min) |
| 19 | Brand/entity SEO | PARTIAL | Brand search surfaces the GitHub repo, not the site; entity conflicts noted | On-site entity consistency done | Profile website links (owner) |
| 20 | GEO/AEO/AI search | IMPLEMENTED + VERIFIED | llms.txt, llms-full.txt, ai.txt, AI JSON endpoints live; AI crawlers allowed | Brand added to all discovery files | — (no AI-citation promises) |
| 21 | Backlinks | PARTIAL | Verified baseline: owned GitHub mentions only; GSC Links report UI-only | 0 backlinks created (no external access) | Priority queue in authority doc |
| 22 | Brand mentions | IMPLEMENTED + VERIFIED (audit) | No unlinked brand mentions exist to reclaim | — | Re-check +60 days |
| 23 | Digital PR | PLANNED ONLY | No real news hook yet | Pitch and bio drafts (not sent) | Unverified hackathon claim removed from the site (2026-09-30); no PR hook |
| 24 | Press releases | NOT APPLICABLE (now) | No hook; syndicated releases would be a link scheme | — | — |
| 25 | EMD/domain strategy | IMPLEMENTED + VERIFIED (decision) | No EMDs recommended | — | Optional defensive `.com` (owner) |
| 26 | Algorithm monitoring | IMPLEMENTED BUT NOT VERIFIED | Status Dashboard not reachable from this environment | `search-change-log.md` created | Owner fills in incident details |
| 27 | Content freshness | IMPLEMENTED + VERIFIED | dateModified and lastmod only change on substantive edits (2026-09-30 for the 26 pages) | — | — |
| 28 | Conversion SEO | IMPLEMENTED + VERIFIED | Contextual `?service=` preselect verified on production; booking and email links; proof near CTAs; mobile flow tested | — | Production email delivery unverified (no real sends) |
| 29 | Rank/query monitoring | PARTIAL | GSC reads via OpenSEO; brand keywords, groups, and clusters configured by owner (UI) | Snapshot table | +14 / +30 / +60 / +90 day snapshots |
| 30 | CI/regression automation | IMPLEMENTED BUT NOT VERIFIED | `.github/workflows/seo-regression.yml`: lint, build, HTTP/SEO contract, browser smoke, SEO audit | New tests for sitemap parity, JSON-LD, brand titles, host rule | First CI run on the SEO PR |

## Lighthouse (lab, local production build, mobile simulation)

| Page | Perf | A11y | Best practices | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| `/` | 97 | 100 | 100 | 100 | 2.6 s | 0.033 | 50 ms |
| `/services/ai-application-development/` | 82 | 100 | 100 | 100 | 4.5 s | 0 | 160 ms |
| `/work/resolve/` | 94 | 100 | 100 | 100 | 3.0 s | 0 | 50 ms |
| `/guides/reliable-webhook-integration/` | 94 | 97 | 96 | 100 | 2.9 s | 0.056 | 110 ms |

**Notes on these results:**
- **LCP:** the LCP element is the H1 text in every case. On the AI page, 90% of LCP is render delay under 4× CPU throttling: global CSS plus hydration of the larger diagram page. This is a **P2**, not a crawl issue. The next step is splitting the legacy homepage stylesheets off secondary pages.
- **Contrast on the webhook guide:** these flags come from the sequence diagram's pre-scroll fade state (opacity 0.15, since Lighthouse does not scroll). Read normally, the text is at full contrast.
- **Fixed on the SEO branch:** `code` below 12px, and the accessible name of screenshot links.
- **No field data (CrUX):** traffic is too low for it to exist.

## Content clusters

| Cluster | Hub | Money page | Guides | Proof | Missing intent | GSC signal |
|---|---|---|---|---|---|---|
| SaaS / MVP | /services/ | saas-development, mvp-product-development | startup-mvp-development, saas-mvp-development-cost, hire-saas-developer | MERIDIAN, RESOLVE | SaaS multi-tenancy architecture (only if demand appears) | MVP service: 4 impressions, pos 2.3 |
| Web apps / custom software | /services/ | web-application-development, custom-software-development | custom-software-vs-saas, hire-web-app-developer | MERIDIAN, Agora Forge, RESOLVE | — | custom: 1 impression |
| API / webhooks | /services/ | api-integration-development | api-integration-planning, reliable-webhook-integration | RESOLVE, Agora Forge | Provider-specific webhook references (pSEO candidate) | API: 1 impression |
| AI / automation | /services/ | ai-application-development, business-automation | ai-feature-vs-automation | RepoDiet, RESOLVE | — | none |
| Product rescue | /services/ | product-rescue | rescue-ai-built-web-app | RepoDiet, MERIDIAN | "vibe code rescue" wording (FAQ added) | none |
| Hiring / buyer education | /guides/ | (services) | hire-saas-developer, hire-web-app-developer | all | — | none |
| Work / proof | /work/ | contact | — | 4 case studies | Role OWNER-CONFIRMED: Full-stack engineer on all four | work: 4 impressions |

## Programmatic SEO decision

**Does real programmatic SEO exist?** No. The `[...slug]` route renders 26 hand-authored pages. It is not a data-driven page set.

**Opportunity study:** the only credible candidate is a set of **provider-specific webhook implementation references** (Stripe, GitHub, Shopify, Slack, Twilio, …). Each has distinct signature schemes, retry windows, and event models, and the existing webhook guide already has the code, SQL, and lifecycle patterns to generalize. The pilot would be 3–5 pages.

**Why it is not implemented now:**
- Every page must carry verified, provider-specific signing and retry facts from primary documentation, and that documentation is not reachable from this environment.
- The domain has 5 indexed pages. Adding templated pages before the core pages are indexed would dilute crawl budget.

**Launch gate:**
- The core pages are indexed.
- GSC shows impressions for webhook long-tail queries.
- Each page has a unique example, unique code, a references section, a canonical, a schema, and a sitemap entry.
- A duplicate-content check is below 30% shared text.

## 30 / 60 / 90-day monitoring plan

| When | Actions |
|---|---|
| +14 days (2026-10-14) | Re-inspect all 27 URLs; confirm sitemap "last read"; confirm vercel.app noindex on production; snapshot GSC |
| +30 days | Snapshot 28-day GSC (branded vs non-branded, services vs guides vs work); re-run the brand web searches; check GitHub/LinkedIn website links are live; log in `search-change-log.md` |
| +60 days | Keyword map refresh with real query rows; decide the pSEO pilot against its gate; first backlink review (GSC Links) |
| +90 days | Compare against the baseline; re-prioritize clusters by impressions; decide video #1 and digital PR if a hook exists |

Do not draw conclusions from daily movement or samples under about 100 impressions.
