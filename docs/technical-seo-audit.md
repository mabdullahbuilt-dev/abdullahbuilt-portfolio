# Technical SEO audit

Date: 2026-09-27

## Passed in the production build and supervised preview

- Build and TypeScript compilation complete successfully.
- ESLint returns zero errors; remaining warnings concern raw images and the existing stylesheet/font delivery pattern.
- All 23 sitemap routes render one meaningful H1, one self-referencing canonical, indexable robots behavior, unique titles, JSON-LD, and no horizontal overflow at the tested desktop viewport.
- Hub and detail pages use crawlable anchor links, visible breadcrumbs, descriptive link text, alt text, image dimensions, and responsive layout rules.
- Homepage hidden FAQ markup was removed; service FAQ schema now mirrors visible, service-specific questions.
- Secondary routes declare page-specific schema instead of inheriting the homepage WebPage entity.
- Sitemap contains only canonical production URLs and uses the current content modification date.
- `www` remains a hosting-level redirect to the apex host; DNS and domain ownership were not changed.

## Performance safeguards

- Case-study hub images and author images load lazily and reserve dimensions.
- The homepage keychain, badge, typography, animation, and project preview interactions are preserved.
- Motion respects the existing reduced-motion behavior.
- No additional analytics or third-party tracking product was installed.

## Tool limitation

The environment does not contain Lighthouse or the requested GEO CLI, so no synthetic score is reported. Browser checks, build output, DOM validation, route crawling, schema inspection, and discovery-file verification were used instead. No score was fabricated.
