# Abdullah Built search intelligence system

Updated: 2026-09-27

## Sources reviewed

- `Auriti-Labs/geo-optimizer-skill`: audit categories, AI crawler separation, discovery files, citability checks, negative signals, topic authority, coherence, RAG-readiness, decay, monitoring, and regression concepts.
- `every-app/open-seo`: intent mapping, keyword and competitor research workflows, audit issue taxonomy, backlinks, rank tracking, and human-in-the-loop prioritization.
- `AminForou/mcp-gsc`: Search Console ground truth, period comparisons, query/page relationships, positions 11–20 opportunities, cannibalization checks, URL inspection, and sitemap operations.

The repositories are methodology inputs, not ranking guarantees. No third-party score is treated as a Google or OpenAI ranking factor.

## Evidence classification

| Class | Used here | Boundary |
|---|---|---|
| Official technical requirements | Crawlable HTML, indexable pages, canonical URLs, sitemap, robots directives, visible structured-data parity, descriptive metadata, internal links, and OAI-SearchBot access | Valid implementation does not guarantee indexing, ranking, or citation |
| Evidence-supported methods | Direct answers, clear headings, first-hand proof, authoritative references, coherent topic clusters, explicit authorship, freshness, and recoverable technical examples | Applied only where useful to a visitor; no invented statistics or quotations |
| Tool heuristics | `llms.txt`, AI discovery JSON, RAG chunk checks, GEO scores, negative-signal thresholds, and AI-perception summaries | Diagnostic only; not presented as official Google ranking factors |

## Production implementation

- Preserved the approved homepage and all interactive portfolio behavior.
- Expanded the commercial architecture to eight services with a new product-rescue and stabilization path.
- Expanded the editorial architecture to nine guides with product-rescue, AI architecture, and webhook-reliability coverage.
- Linked every service to relevant proof, related services, and same-intent guides.
- Linked guides back to a commercial service, inspectable project evidence, and adjacent topic-cluster guides.
- Added official primary references to technical guides where provider behavior or security guidance matters.
- Kept Person, ProfessionalService, WebSite, WebPage, Service, Article, SoftwareApplication, FAQPage, ItemList, and BreadcrumbList entities aligned with visible content.
- Updated sitemap, RSS, robots, `llms.txt`, `llms-full.txt`, `.well-known/ai.txt`, and the three AI discovery JSON resources.
- Added `scripts/seo-regression.mjs` and `pnpm seo:audit` for release checks across status, title, description, canonical, one-H1, JSON-LD, noindex, bot policy, sitemap, and discovery resources.

## Search Console ground truth

Finalized range 2026-08-28 through 2026-09-24:

- Clicks: 0
- Impressions: 3
- CTR: 0%
- Average position: 14
- Only reported query: `aviator`, 1 impression at position 40
- Only reported page: homepage
- Cannibalization candidates: none
- Striking-distance queries: none

The data is too sparse to claim a keyword winner or ranking lift. The new pages are based on demonstrated services, inspectable work, and distinct buyer intent; they must be re-evaluated after Google has crawled them and sufficient impressions accumulate.

## Operating loop

1. Ship only indexable, canonical, useful pages with visible proof.
2. Run build, lint, the route crawl, structured-data parsing, and interaction QA.
3. Re-submit the sitemap and inspect priority URLs in Search Console.
4. Review finalized GSC data weekly: impressions, CTR, positions 4–10, positions 11–20, new/lost queries, page/query overlap, and index coverage.
5. Use SERP and competitor data only for queries that show real demand or clear strategic fit. Keep unavailable volume, difficulty, CPC, and backlink metrics marked unknown.
6. Improve the page already earning relevant impressions before creating another overlapping page.
7. Re-run the audit after every content or routing change and compare failures, not a vanity score.

## Genuine external blockers

- The connected GSC planner exposes finalized performance planning data but not URL Inspection or sitemap submission writes. Those actions remain in the Search Console interface or a separately authorized MCP-GSC connection.
- OpenSEO market metrics require a working provider integration such as DataForSEO; no volume, difficulty, CPC, ranking-domain, or backlink numbers were fabricated.
- Automatic transactional email delivery still requires configured mail-provider secrets; the contact form retains its database and prepared-email fallback.
