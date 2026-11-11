# Black Box website

Next.js (App Router) + TypeScript + Tailwind. Static pages; `/for/<company>` is generated from `lib/companies.ts`, guides from `lib/articles.ts`.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
```

Env (all optional): `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_CONTACT_EMAIL`, `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`, `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`, `NEXT_PUBLIC_BING_SITE_VERIFICATION`, `RESEND_API_KEY`, `BRIEF_FROM_EMAIL`, `BRIEF_NOTIFY_EMAIL`.

Claims guardrails: no customers, logos, certifications or unbuilt features on any page. See `lib/faq.ts` for the approved wording.

## Design

- Tokens are CSS variables in `app/globals.css`. Orange is reserved for evidence (hashes, the seal stripe, broken entries); buttons are neutral.
- The 3D is CSS transforms on real DOM, not canvas: `components/Cuboid.tsx` is the one primitive. `Recorder` (hero), `Story` (scroll-driven explainer), `ChainStack` (tamper test) and `Laptop` (replay) are built from it, so text on the models is server-rendered and there is no 3D library to download.
- All motion respects `prefers-reduced-motion`, and content is visible without JavaScript.
- Fonts (IBM Plex Sans and Mono, OFL) are self-hosted from `app/fonts` via `next/font/local`.

## SEO

- Per-page metadata and canonical URLs; JSON-LD for Organization, WebSite, SoftwareApplication, WebPage, TechArticle, FAQPage, BreadcrumbList, DefinedTermSet, Service and ItemList.
- `sitemap.xml`, `robots.txt`, `feed.xml`, `llms.txt` and `llms-full.txt` are generated from the same data as the pages.
- To add a guide, add an entry to `ARTICLES` in `lib/articles.ts`; the page, OG image, sitemap, feed, footer link and llms files follow.

Preview the production build: `npm run build && npm start`.
