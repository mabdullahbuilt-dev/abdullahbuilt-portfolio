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
| Role | **Full-stack engineer** (OWNER-CONFIRMED) — on RESOLVE, MERIDIAN, RepoDiet, and Agora Forge | Person `jobTitle` "Full-Stack Engineer"; case-study hero fact, byline, and role section; `ai/summary.json` projects |
| Location | Faisalabad, Pakistan; remote worldwide | About, llms-full.txt (no fake offices) |
| Contact | mabdullah.built@gmail.com | Person, ContactPoint |
| `sameAs` | LinkedIn https://www.linkedin.com/in/muhammad-abdullah-builder, GitHub https://github.com/velz-cmd, Facebook https://www.facebook.com/mabdullah.built/ (all OWNER-CONFIRMED) | Person JSON-LD, About profile list, footers, llms-full.txt, ai.txt, ai/summary.json |
| Project live URLs | RESOLVE https://www.useresolve.stream · MERIDIAN https://meridianarc.stream · RepoDiet https://repodiet.uk · Agora Forge https://circle-arc-net.vercel.app/ (all OWNER-CONFIRMED; the old `resolve-task`, `resolve-self`, `trader-arc`, `skillswap-skillswap7` Vercel URLs were removed everywhere, including the résumé PDF link targets) | case studies, proof cards, homepage rows and preview dialog, SoftwareApplication `url`, AI files; CI asserts them |

**Not claimed anywhere:** offices, company size, credentials, awards, reviews, clients, or education.

"Hackathon winner" was removed from the homepage, About, and llms-full.txt on 2026-09-30: no public evidence of a win was found (web search shows MERIDIAN as a lablab.ai hackathon **submission**, not a winner). It must not be used off-site.

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
| agentPass (RepoDiet) | Source linked from the case study (`smokychain22/agentPass`) | Role OWNER-CONFIRMED: Full-stack engineer (stated on the case study) | DONE |
| Circle-Arc-Net (Agora Forge) | Owned by `Ibrahimmovic` | Role OWNER-CONFIRMED: Full-stack engineer (stated on the case study) | DONE |
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
- A hackathon win is **not** a usable hook: it could not be verified, and the claim was removed.
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

## 10. Project-site attribution (cross-linking)

The owner controls the product sites https://www.useresolve.stream, https://meridianarc.stream and https://repodiet.uk, but their source repositories are **not** in this session's GitHub scope. The sites are also unreachable from this sandbox (egress block), so their current footers could not be inspected.

**Recommended (not implemented; BLOCKED BY EXTERNAL ACCESS):** a single footer credit on each product site:

> Engineering by Muhammad Abdullah — [AbdullahBuilt](https://abdullahbuilt.top/)

Rules for the credit:
- The anchor is the brand, not an exact-match keyword.
- One link in the footer or About area, not a sitewide keyword link.
- Keep the credit only on sites the owner controls. None for Agora Forge (repo owned by `Ibrahimmovic`).
- This is not a reciprocal-link scheme: each case study already links to its product because it is the real product.
