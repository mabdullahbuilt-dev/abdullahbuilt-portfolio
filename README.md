# AbdullahBuilt portfolio

Production source for [abdullahbuilt.top](https://abdullahbuilt.top/), the portfolio and service website of Muhammad Abdullah.

The site is a Next.js App Router application containing the approved interactive keychain homepage, service pages, technical guides, software case studies, About and Contact pages, and the supporting SEO/GEO infrastructure.

## Development

```bash
corepack pnpm install --frozen-lockfile
corepack pnpm dev
```

## Quality checks

```bash
corepack pnpm lint
corepack pnpm build
corepack pnpm seo:audit -- --base-url http://127.0.0.1:3000
```

The SEO regression check crawls every canonical URL in `public/sitemap.xml` and validates titles, descriptions, canonicals, H1s, JSON-LD, robots policy, and discovery resources.

## Deployment model

- `main` is the production branch.
- Migration and SEO work is reviewed first on `codex/migration-seo`.
- Vercel preview deployments receive `noindex`, `nofollow`, and `noarchive` directives.
- Canonical URLs remain on `https://abdullahbuilt.top/`.
- The live custom domain must not be moved until preview QA passes.

## Contact delivery

When `RESEND_API_KEY` and `CONTACT_FROM_EMAIL` are available, inquiries are sent through Resend. Without those variables, the form opens a prepared Gmail message containing the visitor's submitted project context.
