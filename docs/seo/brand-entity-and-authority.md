# Brand, entity, and off-site authority — AbdullahBuilt

Recorded 2026-09-30.

**Status labels:**
- **DONE**: implemented and verified.
- **PARTIAL**: some of the work is done.
- **PLANNED**: a written plan only.
- **BLOCKED**: needs owner access or a decision.

Nothing here claims rankings, backlinks, or coverage that does not exist.

## 1. Entity facts (single source of truth)

| Fact | Value | Where it appears |
|---|---|---|
| Brand | **AbdullahBuilt** (alternate name "Abdullah Built") | WebSite and ProfessionalService JSON-LD, `og:site_name`, all page titles (SEO branch), llms.txt, ai.txt, ai/*.json |
| Person | **Muhammad Abdullah** | Person JSON-LD, About, bylines, footer |
| Canonical site | `https://abdullahbuilt.top/` | canonicals, sitemap, JSON-LD `@id`s |
| Relationship | Person → `brand` and `worksFor` → AbdullahBuilt; AbdullahBuilt → `founder` and `provider` → Person | layout JSON-LD (SEO branch) |
| Role | Independent product engineer and full-stack engineer | Person `jobTitle` |
| Location | Faisalabad, Pakistan; remote worldwide | About, llms-full.txt (no fake offices) |
| Contact | mabdullah.built@gmail.com | Person, ContactPoint |
| `sameAs` | LinkedIn `/in/muhammad-abdullah-builder/`, GitHub `velz-cmd`, a Facebook profile | Person JSON-LD. **The Facebook URL could not be verified from this environment; confirm it is yours and public.** |

**Not claimed anywhere:** offices, company size, credentials, awards, reviews, clients, or education.

"Hackathon winner" appears in the About copy, which predates this work. **`[OWNER INPUT NEEDED]` Name the hackathon and link the public result.** Until then, do not repeat the claim off-site.

## 2. Brand SERP — current evidence (free web search, 2026-09-30)

| Query | What appears | Reading |
|---|---|---|
| `"AbdullahBuilt"` | This GitHub repository and its PRs; unrelated Wikipedia "Abdullah" pages; "Abdullah Builders & Developers" (a Pakistani real-estate company on LinkedIn) | The site itself is not yet a result. The repo is the strongest indexed brand asset. |
| `abdullahbuilt.top` | The GitHub repo and PRs; "Abdullah Top (@abdullahtop)" on X | Entity conflict with an unrelated X account. |
| `"Abdullah Built" software developer` | Other developers named Abdullah (abdullahbutt.dev and others) | Common name; disambiguation needs consistent profiles. |

**Brand SERP plan.** This is a goal, not a guarantee; no knowledge panel is promised.
1. **DONE (SEO branch):** brand-first homepage title and description; "| AbdullahBuilt" on every title; Person↔brand JSON-LD links; brand in all AI discovery files.
2. **BLOCKED (owner):** add `https://abdullahbuilt.top` as the **website** on GitHub (velz-cmd), LinkedIn (Contact info → Website), and Facebook. Use the same name everywhere: "Muhammad Abdullah · AbdullahBuilt".
3. **BLOCKED (owner):** set the repository **homepage** field of `mabdullahbuilt-dev/abdullahbuilt-portfolio` to `https://abdullahbuilt.top`. It is currently the top brand result. This session's GitHub tools cannot edit repository settings.
4. **PLANNED:** after the steps above, re-run the three brand queries at +30 and +60 days (tracked in `search-change-log.md`).

## 3. GitHub authority audit

| Item | Found | Action | Status |
|---|---|---|---|
| Profile name / bio (velz-cmd) | "Abdullah", bio "Product Builder" | Set name to "Muhammad Abdullah", bio to "Independent product engineer · AbdullahBuilt · abdullahbuilt.top" | BLOCKED (owner) |
| Profile website | **Not set** | Add `https://abdullahbuilt.top` | BLOCKED (owner) |
| Repos Meridian, Things-to-do (RESOLVE) | No descriptions, no homepage | Description + homepage (live demo) + README link to the case study (`/work/meridian/`, `/work/resolve/`) | BLOCKED (owner; outside this session's repo scope) |
| agentPass (RepoDiet) | A fork; upstream is `pirthvi-r12/agentPass` | Confirm your role. If you contributed, say so accurately in the README and case study. | `[OWNER INPUT NEEDED]` |
| Circle-Arc-Net (Agora Forge) | Owned by `Ibrahimmovic` | Same: confirm your role | `[OWNER INPUT NEEDED]` |
| Case study → source repo | Present on all four case studies | — | DONE |
| Stars/forks | — | No manipulation | policy |

## 4. Verified backlink baseline

GSC's Links report is UI-only and was not readable through the API: **BLOCKED** (check it in Search Console → Links). No paid backlink tools were used (Ahrefs, Semrush, OpenSEO, DataForSEO).

| Source URL | Source domain | Target | Anchor | Follow | Type | Live? | Relevance | Verified |
|---|---|---|---|---|---|---|---|---|
| github.com/mabdullahbuilt-dev/abdullahbuilt-portfolio (and PRs) | github.com | abdullahbuilt.top (mentioned in repo content) | brand / URL | Unknown (GitHub usually nofollows user content) | OWNED | Indexed (appears in web search) | High (brand) | 2026-09-30 |
| linkedin.com/in/muhammad-abdullah-builder | linkedin.com | unknown | — | — | OWNED | Not verifiable here (egress) | High | — |
| github.com/velz-cmd | github.com | **none** (no website set) | — | — | OWNED | **No link present** | High | 2026-09-30 |

**Backlinks actually created in this session: 0.** A prospect list is not a backlink, and this session has no logged-in access to external profiles.

**Legitimate queue, in priority order:**
1. GitHub profile and repo homepage links (owner, 10 minutes).
2. LinkedIn website field plus a Featured link to the webhook guide.
3. Publish the webhook guide's code as a gist or small repo that links back to the full guide.
4. Share the webhook guide and the SaaS developer scorecard in relevant developer communities: a genuine post, not a drop-and-leave link.
5. Selective directories only where the profile is real and relevant, such as a Vercel showcase if eligible.

**Never:** paid link packages, PBNs, comment spam, fake identities, or exact-match anchor manipulation.

## 5. Brand mentions

| Mention | Linked? | Status |
|---|---|---|
| GitHub repo and PRs naming AbdullahBuilt | Yes (owned) | Fine |
| RepoDiet described on the upstream repo `pirthvi-r12/agentPass` | No mention of Muhammad Abdullah found | Not an unlinked mention of you. Confirm your role before any outreach. |
| "Abdullah Builders & Developers", "Abdullah Top" on X | Unrelated entities | Entity conflict: disambiguate through consistent profiles, don't fight it |

No unlinked mentions of AbdullahBuilt were found, so there is **nothing to reclaim yet**.

## 6. Digital PR and press

**News hook assessment:**
- A site relaunch alone is **not news**.
- A named hackathon win with a public result **could be** news: `[OWNER INPUT NEEDED]`.
- An open-source release of the webhook reference code **could be** a developer-community launch rather than press.

**Decision:** no press release now. Syndicated releases would be a link scheme without a real hook.

Prepared assets (drafts; **not sent**):
- **Founder bio (40 words):** "Muhammad Abdullah is an independent product engineer and full-stack developer (AbdullahBuilt). He builds SaaS products, web applications, API integrations, automation, and AI workflows for clients worldwide, working from Faisalabad, Pakistan. Portfolio: abdullahbuilt.top."
- **Short pitch (developer publication):** "A practical, code-first reference for reliable webhooks: signature verification, idempotency with a Postgres unique key, reordering, bounded retries, dead-letter and replay, with a lifecycle diagram and an implementation checklist. Happy to adapt it as a guest tutorial."
- **Screenshots:** the clean viewport crops in `/public/assets/*-viewport.webp`, with no browser chrome or usernames.
- **Media targets:** submit only where the guide format fits, e.g. community tutorials (dev.to/Hashnode cross-post with a canonical link to the site) and newsletters that accept reader submissions. Nothing was submitted from this session.

## 7. Video SEO

**No public videos exist**, so no `VideoObject` markup was added: **DONE (correctly absent)**.

Roadmap (PLANNED). No ranking claims.

| # | Title | Primary query | Intent | Site page | Service | Guide | CTA |
|---|---|---|---|---|---|---|---|
| 1 | Reliable webhooks in 12 minutes: verify, dedupe, retry, replay | webhook idempotency retries | Learn | `/guides/reliable-webhook-integration/` | API integration | webhook | Start an API integration inquiry |
| 2 | API integration architecture that survives bad days | API integration architecture | Learn | `/services/api-integration-development/` | API integration | API planning | same |
| 3 | SaaS MVP architecture: accounts, tenants, billing, ops | SaaS MVP architecture | Learn | `/services/saas-development/` | SaaS | SaaS MVP cost | Discuss a SaaS build |
| 4 | AI agent vs deterministic automation | AI agent vs automation | Decide | `/guides/ai-feature-vs-automation/` | AI | same | Discuss an AI application |
| 5 | Rescuing an AI-built (vibe-coded) web app | fix AI-built app | Solve | `/guides/rescue-ai-built-web-app/` | Product rescue | same | Discuss a product rescue |
| 6–9 | Walkthroughs: RESOLVE, RepoDiet, MERIDIAN, Agora Forge | project names | Proof | matching `/work/*` page | per case study | per case study | Contact |

**Each video needs:**
- A hook: a failure the viewer recognizes, in the first 10 seconds.
- A thumbnail: the page's diagram.
- Chapters: follow the guide's TOC.
- Captions and transcript: the transcript is posted on the matching page.
- An embed on that page, and **only then** `VideoObject` markup.

## 8. International SEO

The site already states remote, worldwide, English-language delivery truthfully.

**Not created:** no US or UK offices, addresses, phone numbers, Google Business Profile, or city and geo doorway pages. `hreflang` is en / x-default only, which is correct for a single-language site: **DONE**.

## 9. EMD / domain strategy

**No exact-match or keyword domains are recommended.** They would split authority, dilute the entity, and risk doorway patterns.

A defensive registration of the `.com` for the brand is optional and only after an availability check. No domain was registered; that needs owner approval.
