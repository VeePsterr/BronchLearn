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
