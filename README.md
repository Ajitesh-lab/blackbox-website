# Black Box website

Next.js (App Router) + TypeScript + Tailwind. Static pages; `/for/<company>` is generated from `lib/companies.ts`.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
```

Env (all optional): `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`, `RESEND_API_KEY`, `BRIEF_FROM_EMAIL`.

Claims guardrails: no customers, logos, certifications or unbuilt features on any page. See `lib/faq.ts` for the approved wording.
