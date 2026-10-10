# BronchRounds

An education-only website for learning tracheobronchial anatomy, bronchoscopic orientation, segmental
nomenclature (RB1–RB10, LB1+2–LB10) and IASLC thoracic lymph-node stations, with a 2-D navigation
simulator, a tumour-context nodal-staging exercise and a quiz centre.

> **For education only. Not for patient-specific decision-making or unsupervised procedural use.**

"BronchRounds" is the site name. Change it in `config/site.ts` (`name`), which is the only place it is set.

## Requirements

- Node.js 20.9 or later (developed on Node 22) and npm 10
- For end-to-end tests: Playwright's Chromium (`npx playwright install chromium`)

## Commands

```bash
npm install                 # install dependencies
npm run dev                 # development server at http://localhost:3000
npm run typecheck           # TypeScript strict-mode check
npm test                    # Vitest: unit, component and content-validation tests
npm run validate:content    # content-validation tests only
npm run content:report      # list every medical content item and its review status
npm run build               # production build (static prerender)
npm start                   # serve the production build at http://localhost:3000
npm run test:e2e            # Playwright smoke + axe accessibility tests (builds must exist: run npm run build first)
npm run check               # typecheck + tests + build
```

If Chromium is pre-installed elsewhere, point Playwright at it:
`PLAYWRIGHT_CHROMIUM_PATH=/path/to/chrome npm run test:e2e`.

## Project structure

```
app/                  Routes: / (dashboard), /atlas, /navigate, /stations, /staging, /quiz,
                      /glossary, /about, /lessons/airway-orientation (MDX)
components/           UI only (anatomy, sim, ebus, quiz, glossary, home, layout, ui)
config/site.ts        Site name, content version, notice text, feedback URL
content/              ALL medical content — edit here, not in components
  sources/            Central source registry (every citation is an id from here)
  airways/            Airway terminology dataset
  stations/           IASLC stations and zones
  staging/            N-category teaching rules (draft)
  quiz/               Hand-written questions (airway questions are generated from the dataset)
  glossary/           Glossary terms
  review/             Content-review history
lib/contentSchemas/   Zod schemas every content object must satisfy
lib/content/          Display gates (draft labelling, sensitive-text hiding)
lib/navigation/       Airway tree helpers and the simulator state machine
lib/progress/         Anonymous localStorage progress
lib/quiz/             Question generation, grading and filtering
tests/                Vitest tests (content validation, components, logic)
e2e/                  Playwright smoke and accessibility tests
docs/                 Plan, milestone reports, audits, review guide, deployment
```

## Medical content and review

Every medical content object carries `sourceRefs`, `reviewStatus` (`draft-unverified`,
`source-verified`, `clinician-reviewed`), `lastReviewedDate`, `reviewerName`/`reviewerRole` and
uncertainty notes. Draft content is always badged. Procedural details (approach, ultrasound
landmarks, sampling notes) are stored as `SensitiveText` and never rendered unless clinician-reviewed
with a named reviewer.

In version 0.1.0-draft nothing is clinician-reviewed, and "source-verified" means an AI-assisted
comparison with source text, not a human review. Several sources could not be accessed during the
build (see `docs/PLAN.md` §2), so modality access and N-category rules remain draft.

See `docs/CONTENT_REVIEW.md` for how to review content, the list of content requiring specialist
review, and the checklist below.

## Medical-review checklist for deployment

- [ ] Run `npm run content:report`; every remaining `draft-unverified` item is acceptable to show with its badge, or removed.
- [ ] A named, appropriately qualified clinician has reviewed station boundaries, modality access and N-category rules (`docs/CONTENT_REVIEW.md` items 1–3) and their names are recorded in the data.
- [ ] All guideline sources in `content/sources/registry.ts` have complete citations and were read by the reviewer.
- [ ] No procedural text is published unless clinician-reviewed (tests enforce the metadata; confirm the intent).
- [ ] No quiz question asks for the safest puncture site, needle entry or clock-face position.
- [ ] The disclaimer on /about has been approved by the responsible institution.
- [ ] `feedbackUrl` in `config/site.ts` points to a monitored channel.
- [ ] `contentVersion`, `contentDate` and `content/review/history.ts` are updated.
- [ ] `npm run check` and `npm run test:e2e` pass.

## Privacy

No accounts, analytics, cookies, database or server storage. Progress (visited items, quiz counts)
is stored in the browser's localStorage under `bronchrounds.progress.v1` and contains no identity or
patient data.

## Deployment

See `docs/DEPLOYMENT.md`.

## Copyright

All illustrations are original SVG drawn for this project. No video footage, screenshots, narration,
transcripts or published diagrams are used. See `docs/COPYRIGHT_AUDIT.md`.
