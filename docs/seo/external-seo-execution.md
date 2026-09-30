# External SEO execution — 2026-09-30

Production `main` is `8f8aef2`. This page records only what was actually executed or observed.

**Environment limits:**
- No browser-automation or logged-in browser session is connected to this Claude session.
- Search Console is reachable only through the read-only OpenSEO API: URL Inspection and Search Analytics.
- GitHub is reachable only through `mabdullahbuilt-dev` MCP tools, which cannot edit profile or repository settings.

## 1. Sitemap
- Live file verified: `https://abdullahbuilt.top/sitemap.xml` lists 27 URLs with lastmod 2026-09-30.
- The Search Console Sitemaps report (status, Last read, errors) is UI-only, so it was not read from here. **BLOCKED BY ACCESS.**
- The owner submitted the sitemap on 2026-09-30.
- URL Inspection shows the sitemap attached to every discovered URL.
- Google's last crawl of any URL is **2026-09-24**, which predates the final deploy.

## 2. Priority indexing requests
**Request Indexing is a Search Console UI action**, so no request was submitted from this session. The UI steps are at the end of this page.

The state of each priority URL at inspection time (16:30 UTC):

| URL | Coverage | Declared canonical (live) | Indexable (live) | Request submitted |
|---|---|---|---|---|
| /services/ | Discovered – not indexed | https://abdullahbuilt.top/services/ | yes (`index, follow`, 200) | no — BLOCKED BY ACCESS |
| /services/saas-development/ | Discovered – not indexed | self | yes | no — BLOCKED BY ACCESS |
| /services/ai-application-development/ | Discovered – not indexed | self | yes | no — BLOCKED BY ACCESS |
| /services/product-rescue/ | Discovered – not indexed | self | yes | no — BLOCKED BY ACCESS |
| /guides/ | Discovered – not indexed | self | yes | no — BLOCKED BY ACCESS |
| /about/ | Unknown to Google | self | yes | no — BLOCKED BY ACCESS |

"Declared canonical" and "indexable" come from the production fetch after `4fd38fe`: all 27 routes return 200, `index, follow` and an apex canonical.

## 3. Indexation matrix (URL Inspection API, 2026-09-30 ~16:30 UTC)

| URL | Status | Google canonical | Declared canonical | Last crawl | Indexing allowed | Request | Notes |
|---|---|---|---|---|---|---|---|
| / | INDEXED | self | self | 2026-09-24 | yes | — | Breadcrumb rich result PASS |
| /services/ | DISCOVERED | — | self | — | yes (live) | not submitted | priority |
| /services/custom-software-development/ | INDEXED | self | self | 2026-09-24 | yes | — | Breadcrumb PASS |
| /services/saas-development/ | DISCOVERED | — | self | — | yes | not submitted | priority |
| /services/web-application-development/ | DISCOVERED | — | self | — | yes | — | |
| /services/api-integration-development/ | INDEXED | self | self | 2026-09-24 | yes | — | Breadcrumb PASS |
| /services/business-automation/ | DISCOVERED | — | self | — | yes | — | |
| /services/mvp-product-development/ | INDEXED | self | self | 2026-09-24 | yes | — | Breadcrumb PASS |
| /services/ai-application-development/ | DISCOVERED | — | self | — | yes | not submitted | priority |
| /services/product-rescue/ | DISCOVERED | — | self | — | yes | not submitted | priority |
| /work/ | INDEXED | self | self | 2026-09-24 | yes | — | |
| /work/resolve/ | DISCOVERED | — | self | — | yes | — | |
| /work/meridian/ | UNKNOWN | — | self | — | yes | — | |
| /work/repodiet/ | DISCOVERED | — | self | — | yes | — | |
| /work/agora-forge/ | UNKNOWN | — | self | — | yes | — | |
| /guides/ | DISCOVERED | — | self | — | yes | not submitted | priority |
| /guides/hire-saas-developer/ | UNKNOWN | — | self | — | yes | — | |
| /guides/hire-web-app-developer/ | UNKNOWN | — | self | — | yes | — | |
| /guides/startup-mvp-development/ | DISCOVERED | — | self | — | yes | — | |
| /guides/custom-software-vs-saas/ | UNKNOWN | — | self | — | yes | — | |
| /guides/saas-mvp-development-cost/ | DISCOVERED | — | self | — | yes | — | |
| /guides/api-integration-planning/ | DISCOVERED | — | self | — | yes | — | |
| /guides/rescue-ai-built-web-app/ | DISCOVERED | — | self | — | yes | — | |
| /guides/ai-feature-vs-automation/ | DISCOVERED | — | self | — | yes | — | |
| /guides/reliable-webhook-integration/ | UNKNOWN | — | self | — | yes | — | |
| /about/ | UNKNOWN | — | self | — | yes | not submitted | priority |
| /contact/ | DISCOVERED | — | self | — | yes | — | |

**Totals:**
- Indexed: 5
- Discovered – currently not indexed: 15
- Crawled – currently not indexed: 0
- Unknown to Google: 7
- Canonical or duplicate issues: 0
- Blocked: 0

Between inspections earlier the same day, several URLs flipped between "Discovered" and "Unknown" with no crawl in between. The API's discovery data is inconsistent, and it is not a site problem.

## 4. Links report
- The Search Console Links report is UI-only. **BLOCKED BY ACCESS.**
- The verified backlink baseline has not changed from `brand-entity-and-authority.md` §4: owned GitHub repository mentions only.
- **External backlinks confirmed live: 0.**

## 5. Branded search baseline
Collected with this session's web-search tool, which queries a US search index. This is **not** a logged-in Google SERP, so treat the order as approximate.

| Query | abdullahbuilt.top shown? | What appears |
|---|---|---|
| AbdullahBuilt | No | #1 GitHub repo `mabdullahbuilt-dev/abdullahbuilt-portfolio`, #2 its PR #4, then Wikipedia "Abdullah" pages and "Abdullah Builders & Developers" (LinkedIn company) |
| "Abdullah Built" | No | Historical buildings built by people named Abdullah; the "Abdullah Group" builders' Facebook page |
| "Abdullah Build" | No | Other developers: `Abdullah-Builds`, `BuildWithAbdullah`, `buildwithabdoo` on LinkedIn; the portfolio repo about #6 |
| "AbdullahBuilt" software developer | No | #2 portfolio repo; other "Abdullah" developer portfolios. The search tool's summary **conflated** the brand with `AbdullahSoftDev`, a different developer in Gujranwala, which is an entity-confusion risk |
| "Muhammad Abdullah" "AbdullahBuilt" | No | #1 portfolio repo, then Wikipedia namesakes |
| site:abdullahbuilt.top | No results | This index has no pages from the domain yet (Google has 5 indexed) |

**Not seen in any query:** LinkedIn `muhammad-abdullah-builder`, Facebook `mabdullah.built`, GitHub `velz-cmd`.

## 6–9. Profiles and repository settings

| Item | Current state | Status |
|---|---|---|
| GitHub `velz-cmd` website field | Not visible to this session's tools; `velz-cmd` is a different account from the connected `mabdullahbuilt-dev` | BLOCKED BY ACCESS |
| Repo `mabdullahbuilt-dev/abdullahbuilt-portfolio` homepage | **`https://abdullahbuilt-portfolio.vercel.app`**, a Vercel alias that now serves noindex. It should be `https://abdullahbuilt.top/`. The GitHub MCP tools cannot edit repository settings | BLOCKED BY ACCESS |
| LinkedIn website field | No LinkedIn access | BLOCKED BY ACCESS |
| Facebook website field | No Facebook access | BLOCKED BY ACCESS |

## 10. Project-site attribution
- **Product sites** (useresolve.stream, meridianarc.stream, repodiet.uk, circle-arc-net.vercel.app): blocked by the sandbox's egress proxy, so they could not be inspected.
- **Access to the source repos was requested and denied:**
  - `velz-cmd/Meridian` and `velz-cmd/Things-to-do`: permission grant denied.
  - `smokychain22/agentPass`: the owner lacks push access.
  - `Ibrahimmovic/Circle-Arc-Net`: third-party owned, not attempted.
- No attribution link was added anywhere. **BLOCKED BY EXTERNAL ACCESS.**

## Owner UI steps
Each takes about a minute.
1. **Sitemap:** Search Console → Sitemaps → confirm `sitemap.xml` shows Success, 27 discovered URLs, and a Last read after 2026-09-30. Do not add a second sitemap.
2. **Request indexing:** Search Console → URL Inspection. For each of `/services/`, `/services/saas-development/`, `/services/ai-application-development/`, `/services/product-rescue/`, `/guides/`, `/about/`: Test live URL → Request indexing, once. If it says already requested, leave it.
3. **Repository homepage:** GitHub → `abdullahbuilt-portfolio` → About (gear icon) → Website: `https://abdullahbuilt.top/`.
4. **GitHub profile** `velz-cmd`: Edit profile → Website `https://abdullahbuilt.top/`; Name `Muhammad Abdullah`; Bio `Full-stack engineer · AbdullahBuilt`.
5. **LinkedIn:** Contact info → Website `https://abdullahbuilt.top/` (type: Portfolio).
6. **Facebook:** About → Contact and basic info → Websites → `https://abdullahbuilt.top/`.
7. **Product sites you control:** add one footer credit, "Engineering by Muhammad Abdullah — [AbdullahBuilt](https://abdullahbuilt.top/)".
