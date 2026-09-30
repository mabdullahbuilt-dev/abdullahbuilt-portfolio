# AbdullahBuilt portfolio

Production source for [abdullahbuilt.top](https://abdullahbuilt.top/), the portfolio and service website of Muhammad Abdullah.

**Muhammad Abdullah** is a full-stack engineer who works under the **AbdullahBuilt** brand. Profiles: [LinkedIn](https://www.linkedin.com/in/muhammad-abdullah-builder) · [GitHub](https://github.com/velz-cmd) · [Facebook](https://www.facebook.com/mabdullah.built/)

### Selected work (role: full-stack engineer; all builds are testnet-stage)

| Project | Live product | Case study |
|---|---|---|
| RESOLVE | https://www.useresolve.stream | https://abdullahbuilt.top/work/resolve/ |
| MERIDIAN (co-built) | https://meridianarc.stream | https://abdullahbuilt.top/work/meridian/ |
| RepoDiet | https://repodiet.uk | https://abdullahbuilt.top/work/repodiet/ |
| Agora Forge | https://circle-arc-net.vercel.app/ | https://abdullahbuilt.top/work/agora-forge/ |

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
corepack pnpm test:http
corepack pnpm test:e2e
```

The SEO regression check crawls every canonical URL in `public/sitemap.xml` and validates titles, descriptions, canonicals, H1s, JSON-LD, robots policy, and discovery resources.

## Deployment model

- `main` is the production branch.
- Changes go through a feature branch, a pull request, the `SEO regression` CI workflow, and a Vercel preview before merging to `main`.
- Vercel preview deployments and every `*.vercel.app` host receive `noindex` directives.
- Canonical URLs remain on `https://abdullahbuilt.top/`.

## Contact delivery

When `RESEND_API_KEY` and `CONTACT_FROM_EMAIL` are available, inquiries are sent through Resend. Without those variables, the form opens a prepared Gmail message containing the visitor's submitted project context.
