# Deployment

BronchRounds is fully static (every route is prerendered). It needs no database, secrets or server state.

## Option A: Vercel or any Next.js host

1. Push the repository to GitHub.
2. Import it in the host. Build command `npm run build`, output handled by Next.js. Node 20.9 or later.
3. No environment variables are required.

## Option B: Node server

```bash
npm ci
npm run build
npm start            # serves on port 3000; set PORT to change
```

## Option C: Static export (any static host, e.g. GitHub Pages, S3)

Add `output: "export"` to `next.config.ts`, then:

```bash
npm ci
npm run build        # writes ./out
```

Upload `./out`. (If hosting under a sub-path, also set `basePath`.)

## Before every deployment

Complete the medical-review checklist in `docs/CONTENT_REVIEW.md`, then run:

```bash
npm run check        # typecheck + unit/content tests + production build
npm run test:e2e     # Playwright smoke + accessibility tests
```

Recommended headers (set in your host): `Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:`, `Referrer-Policy: no-referrer`, `X-Content-Type-Options: nosniff`.
