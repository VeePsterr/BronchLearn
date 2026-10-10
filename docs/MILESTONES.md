# Milestone reports

## Milestone 1 — plan, audit, schemas, scaffold
- Files: package.json, tsconfig.json (strict), next.config.ts, postcss.config.mjs, vitest.config.ts, playwright.config.ts, config/site.ts, lib/contentSchemas/*, app/layout.tsx, app/globals.css, components/layout/*, docs/PLAN.md
- Commands: `npm install …`, `npx tsc --noEmit`, `npx next build`
- Tests: typecheck and build passed; no tests yet
- Draft-unverified: n/a (no content yet)

## Milestone 2 — sources, airway terminology, SVG atlas
- Files: content/sources/registry.ts, content/airways/airways.ts, lib/navigation/tree.ts, lib/content/display.ts, lib/progress/store.ts, components/ui/*, components/anatomy/*, app/atlas/page.tsx, tests/content/airways.test.ts, tests/components/atlas.test.tsx
- Commands: `npx vitest run`, `npx next build`
- Tests: 22/22 passed; build passed
- Draft-unverified: "Upper division bronchus of left upper lobe", "Lingular bronchus" (clinical grouping terms not found in the FIPAT extract)
- Source-verified (AI-assisted, not human): the other 30 of 32 airway structures

## Milestone 3 — 2-D navigation simulator
- Files: lib/navigation/simulator.ts, components/sim/BronchoscopicView.tsx, components/sim/NavigationSimulator.tsx, app/navigate/page.tsx, tests/lib/simulator.test.ts, tests/components/simulator.test.tsx; colour-token rename in app/globals.css
- Commands: `npx vitest run`, `npx tsc --noEmit`, `npx next build`
- Tests: 37/37 passed; build passed
- Draft-unverified: no new medical content (the simulator uses only the airway dataset). The view deliberately encodes no anatomical position or orientation.

## Milestone 4 — IASLC/EBUS stations and tumour-context nodal mode
- Files: content/stations/stations.ts (20 stations), content/stations/zones.ts, content/staging/nodalRules.ts, components/ebus/{StationMap,stationLayout,StationCard,StationAtlas,StagingExercise}.tsx, app/stations/page.tsx, app/staging/page.tsx, tests/content/stations.test.ts, tests/components/stations.test.tsx
- Commands: `npx vitest run`, `npx tsc --noEmit`, `npx next build`
- Tests: 74/74 passed; build passed
- Source-verified (AI-assisted, not human): station names and boundary wording for all 20 stations (IASLC 2009 text); AP zone = stations 5 and 6
- Draft-unverified: modality access (EBUS-TBNA / EUS-B-FNA) for all 20 stations; zone groupings other than AP; all 11 N-category rules
- Hidden (no text authored): typical airway approach, ultrasound landmarks, sampling notes for every station
