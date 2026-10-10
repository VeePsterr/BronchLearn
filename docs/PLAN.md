# BronchRounds: Milestone 1 plan

_Renamed from the working title "BronchLearn" on 2026-10-10. Change it in `config/site.ts`._

## 1. Product plan (brief)

BronchRounds is a static, anonymous, education-only website that teaches normal tracheobronchial
anatomy, bronchoscopic orientation, segmental nomenclature and IASLC lymph-node stations, then
reinforces them with a 2-D navigation simulator and quizzes.

Guiding decisions:

| Decision | Choice | Why |
| --- | --- | --- |
| Framework | Next.js 16 (App Router), React 19, TypeScript 5.9 strict | Current stable; TS 7 (native) is too new for the Next toolchain |
| Styling | Tailwind CSS 4, Radix primitives (Tabs, Switch, ToggleGroup) | Accessible behaviour without a heavy kit |
| Content | Typed TS data files validated with Zod at test time and at module load | Clinicians edit `/content`, never React |
| Long lessons | MDX via `@next/mdx` | Prose with embedded citations |
| State | `localStorage` only, versioned key, no identity | Spec forbids accounts, DB, analytics |
| Tests | Vitest + Testing Library; Playwright + axe-core | Spec |
| Rendering | All pages statically prerendered | No server, cheap hosting, no data collection |

Out of scope for the MVP: authentication, database, CMS, analytics, 3-D models, video, any
needle-path or puncture-site content.

## 2. Source-access audit (2026-10-10)

Network access from the build environment is restricted. Pages were requested through an
automated fetch tool that converts pages to text and summarises them; it is not a human reading
the source. Every "accessed" result below therefore still needs a human spot-check.

| Source | Result | What was obtained |
| --- | --- | --- |
| ATS video "Introduction to Bronchoscopy – Lecture" (YouTube) | **Not accessible** (fetch error) | Nothing. Not watched; no captions read. Only the title supplied by the project owner is used. |
| CTSNet video "Mastering Bronchoscopy for Thoracic Surgery: Chapter 1" (YouTube) | **Not accessible** (fetch error) | Nothing. Not watched; no captions read. |
| FIPAT Terminologia Anatomica 2nd ed., Part 3 (PDF) | Accessed (text) | English/Latin terms and B-codes for main, lobar and segmental bronchi (TA2 IDs 3237–3264). Endnotes 474–479 were not in the extracted text. |
| IMAIOS e-Anatomy bronchoscopy page | Accessed (text) | Segmental bronchus terms with B-codes; agrees with FIPAT. Lists B7 and B8 separately on the left and does not mention B7+8. |
| IASLC lymph-node map (Rusch et al., J Thorac Oncol 2009) | Accessed (text, figures not available) | Station boundary wording for stations 1–14. Zone diagram (Figure 3) not readable; only the "AP zone = 5 and 6" statement was in the text. |
| ERS/ESGE/ESTS endosonography guideline (Eur Respir J 68(2), 2026) | **Not accessible** (server error) | Title confirmed only from a search-results listing. No content read. |
| EBUS-TBNA guideline, PMC10401980 | **Not accessible** (browser-check page) | Nothing. Title, authors and content unknown. |
| CHEST guideline on acquisition and handling of EBUS-TBNA samples (2024) | **Not accessible** (fetch error) | Title confirmed from search-results listing only. |

Consequences:

* Bronchial terminology can be marked `source-verified` (FIPAT and IMAIOS agree).
* Station boundaries can be marked `source-verified` against the IASLC map text.
* Station **modality access** (EBUS-TBNA vs EUS-B-FNA) could not be checked against any
  endosonography guideline, so it stays `draft-unverified` and is shown with a draft badge.
* N-category rules (TNM N descriptors) were not retrieved from a staging source and stay
  `draft-unverified`.
* No procedural content (approach, ultrasound landmarks, sampling) is written at all.

## 3. Medical-content risk list

| # | Risk | Mitigation in the build |
| --- | --- | --- |
| R1 | Learner treats the site as clinical decision support | Persistent notice on every page; full disclaimer on About; no patient inputs |
| R2 | Unverified access data presented as fact | `draft-unverified` badge + explanation on every draft field; draft quiz items off by default |
| R3 | Sampling/puncture/needle information | `SensitiveText` type; renderer refuses anything not `clinician-reviewed` with named reviewer; no such text authored |
| R4 | N category shown without tumour context | Staging UI and quiz require a tumour side first; validation test fails if an N question lacks context |
| R5 | LB7+8 or LB1+2 patterns marked as wrong | Quiz answers allow accepted equivalents; simulator accepts combined-pattern routes |
| R6 | Schematic drawings read as true anatomy / true bronchoscopic orientation | Every figure labelled "schematic, not to scale"; simulator openings explicitly not in true positions; R/L text labels |
| R7 | Spatial proximity misread as procedural access | Access is a separate data field with its own sources; UI never derives it from the map |
| R8 | Clinical grouping terms (upper division, lingular bronchus, main carina) not in the retrieved FIPAT extract | Marked `draft-unverified` with a note |
| R9 | Copyrighted diagrams/video frames reused | Only original SVG; attribution audit in Milestone 6 |
| R10 | Automated (AI) source checks mistaken for human review | `reviewerRole` states "AI-assisted source check"; nothing is `clinician-reviewed` |

## 4. Information architecture

```
/                       Learning dashboard (start tiles, local progress, notice)
/lessons/airway-orientation  MDX lesson: trachea → carina → R/L → lobes → segments
/atlas                  Airway atlas (SVG tree, search, filters, labels, variants, info card)
/navigate               2-D bronchoscopy navigation simulator (Explore / Label / Quiz)
/stations               IASLC station atlas (schematic, filters, station cards)
/staging                Tumour-context nodal learning mode (N1/N2/N3 reasoning)
/quiz                   Quiz centre (8 question types, local scoring)
/glossary               Searchable glossary
/about                  Sources, disclaimer, review history, methodology, copyright, feedback
```

## 5. Data schemas (summary; code in `lib/contentSchemas`)

* `ReviewMeta`: `sourceRefs[]` (≥1, must exist in registry), `reviewStatus`
  (`draft-unverified | source-verified | clinician-reviewed`), `lastReviewedDate`,
  `reviewerName` and/or `reviewerRole`, `uncertaintyNotes`.
* `SensitiveText`: `{ text, reviewStatus, reviewerName, reviewedDate }`. Rendered only when
  `clinician-reviewed` with a named reviewer and date.
* `Source`: id, citation, url, kind, authoritative flag, access status, access notes.
* `AirwayStructure`: id, code, name, kind, side, lobe, region, parentId, aliases, variants,
  anatomyClass (`standard | common | variant`), pattern, + `ReviewMeta`.
* `LymphNodeStation`: all fields required by the brief, with `accessibleBy` carrying its own
  `ReviewMeta`, and approach/landmarks/sampling as `SensitiveText`.
* `NodalRule`: station → (tumour side → N category) with `ReviewMeta`.
* `QuizQuestion`: type, prompt, options, accepted answers, explanation, entity refs,
  `tumourContext` (required for N questions), `ReviewMeta`.
* `GlossaryTerm`, `Lesson` front-matter: term/definition + `ReviewMeta`.

## 6. File tree

```
app/                 routes (page.tsx per area), layout, globals.css
components/layout    header, footer, educational notice
components/ui        badges, cards, review-status, source list
components/anatomy   AirwayTree (SVG), AirwayInfoCard, Breadcrumb
components/sim       NavigationSimulator, BronchoscopicView, MiniMap
components/ebus      StationMap (SVG), StationCard, StagingExercise
components/quiz      QuizRunner, QuestionCard
config/site.ts       site name, version, feedback URL
content/sources      source registry
content/airways      airway terminology dataset
content/stations     IASLC station dataset, zones
content/staging      N-category rules
content/quiz         hand-written questions
content/glossary     glossary
content/lessons      MDX lessons
lib/contentSchemas   Zod schemas
lib/content          validated loaders, display gates
lib/navigation       tree helpers (children, breadcrumbs, search)
lib/progress         localStorage progress store
lib/quiz             question generation and grading
tests/               unit, component, content-validation tests
e2e/                 Playwright smoke + axe accessibility tests
docs/                plan, milestone reports, audits, review checklist
```
