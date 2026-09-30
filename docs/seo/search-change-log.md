# Search change log

Tracks official Google Search changes, AbdullahBuilt deploys, and what Search Console shows. Compare 7d, 28d, the previous 28d, and YoY once a year of data exists.

**Segments:** branded, non-branded, services, guides, work, country, device.

**Rule:** do not react to movement in tiny samples. At current volumes (about 11 impressions per quarter), no change is interpretable.

**Primary sources:**
- Google Search Status Dashboard: https://status.search.google.com/summary
- Search Central blog: https://developers.google.com/search/blog
- GSC (via OpenSEO read tools; free)

## Official updates

| Date | Official update | Source | Rollout window | Observed GSC change | Segment | Likely related? | Action | No-action reason |
|---|---|---|---|---|---|---|---|---|
| 2026-09-24 | A ranking incident beginning 2026-09-24 is listed on the Status Dashboard. **Name and scope unverified**: the dashboard is not reachable from this environment | status.search.google.com (seen via search results) | unverified | Impressions 0–4/day before and after | all | Unknown | Owner: open the dashboard and fill in the name and window | Sample too small to attribute anything |

## Site changes

| Date | Change | Commit / PR | Expected effect | Check on |
|---|---|---|---|---|
| 2026-09-30 | 26 secondary pages redesigned; screenshots sanitized; truthful dateModified and lastmod | `a7a39df`, [PR #3](https://github.com/mabdullahbuilt-dev/abdullahbuilt-portfolio/pull/3) | Recrawl of redesigned pages; no metadata changes | 2026-10-14 |
| 2026-09-30 | Brand-first homepage title; "\| AbdullahBuilt" title suffix; Person↔brand schema; vercel.app noindex; extra internal links; rescue FAQ | `dd82963`, [PR #4](https://github.com/mabdullahbuilt-dev/abdullahbuilt-portfolio/pull/4) | Brand-query association; fewer duplicate hosts | 2026-10-30 |

## Snapshots

| Date | Window | Clicks | Impressions | CTR | Avg pos. | Indexed (of 27) | Notes |
|---|---|---|---|---|---|---|---|
| 2026-09-30 | 2026-06-27 → 2026-09-27 | 2 | 11 | 18.2% | ~5 | 5 | Baseline (see `indexation-and-gsc-baseline.md`) |
| 2026-09-30 (post-deploy) | re-inspection | — | — | — | 5 | Previously unknown URLs now Discovered (22 discovered, 0 unknown) |
