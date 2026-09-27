# Technical SEO baseline

## Expected public inventory

- 19 indexable HTML routes.
- robots.txt, sitemap.xml, feed.xml.
- llms.txt, llms-full.txt, /.well-known/ai.txt.
- /ai/summary.json, /ai/faq.json, /ai/service.json.

## Checks

- One canonical per HTML page.
- One visible H1 per page.
- Index/follow defaults; no accidental noindex.
- Unique page title and meta description.
- Open Graph and Twitter image metadata.
- Valid JSON-LD matching visible content.
- All sitemap routes return 200.
- Internal links use crawlable anchors.
- Images include useful alt text when informative.
- www canonicalizes to the apex domain at the hosting layer.

## Known operational state

- The site is attached to ChatGPT Sites; DNS and Search Console ownership remain untouched.
- The contact endpoint saves valid inquiries to D1. Email forwarding requires authenticated sender environment variables; direct email and Cal.com remain available.
- Search Console ownership is verified but query history is not yet sufficient for performance-led page changes.
