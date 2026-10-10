# Copyright and attribution audit (2026-10-10)

| Asset | Origin | Licence / basis | Attribution |
|---|---|---|---|
| Airway tree SVG (`components/anatomy/AirwayTree.tsx`, `airwayLayout.ts`) | Original, coordinates hand-set for this project | Project's own | — |
| Simulated learning view (`components/sim/BronchoscopicView.tsx`) | Original procedural SVG rendering generated in code (seeded noise texture, lighting filters, gradients). No photograph, video frame, poster image or published drawing was copied, traced or used as a texture | Project's own | — |
| Olympus "Videobronchoscopy" poster (PDF supplied by the project owner) | Viewed only to inform the approximate arrangement of openings (which side, roughly where). No image, drawing, colour scheme or text reproduced; the PDF is not in the repository | Facts only | Cited in source registry |
| Jaypee, _Bronchoscopy in ICU_, Ch. 1 | Chapter text read via an automated tool for carina names; no text beyond short factual definitions, and no figures, reproduced | Facts only, cited | Source registry |
| Station map (`components/ebus/StationMap.tsx`, `stationLayout.ts`) | Original schematic; not traced from IASLC Figure 1 or any other figure | Project's own | — |
| Logo and hero illustration | Original | Project's own | — |
| Anatomical terminology | Terminologia Anatomica (FIPAT) | Terminology; cited | FIPAT TA2 in source registry |
| Station boundary wording | IASLC map (Rusch et al., 2009) | Short quotations for education, cited | Source registry + each card |
| ATS and CTSNet videos | Not accessed; nothing used | — | Listed as teaching inspiration only |
| IMAIOS | Label list used only to cross-check terms; no images or text reused | — | Cited |
| Fonts | System font stack only; no web fonts bundled | — | — |
| Icons | Unicode characters only | — | — |
| npm dependencies | next, react, react-dom, zod, @next/mdx, @mdx-js/*, @radix-ui/*, tailwindcss, remark-gfm | MIT (checked in node_modules) | package-lock.json |

Checks performed: `public/illustrations` is empty; no image files exist in the repository other than
documentation screenshots of this site under `docs/`; no external URLs are loaded at runtime (grep of
`app/` and `components/` found only source-registry links and the feedback URL).
