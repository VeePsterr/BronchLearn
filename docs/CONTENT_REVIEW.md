# Content review guide, specialist review list and deployment checklist

## What "source-verified" means in version 0.1.0-draft

Every item marked `source-verified` was compared with source **text** retrieved through an
automated, AI-assisted fetch tool on 2026-10-10 (see the source-access audit in `PLAN.md` §2).
That tool converts pages to text and summarises them, so it can paraphrase or mis-assign table
columns. **No item has been reviewed by a human.** `reviewerRole` on each item says this.

## How to review and promote content

1. Run `npm run content:report` to list every item and its status.
2. Open the data file (`content/airways/airways.ts`, `content/stations/stations.ts`,
   `content/stations/zones.ts`, `content/staging/nodalRules.ts`, `content/glossary/glossary.ts`,
   `content/quiz/questions.ts`).
3. Check the wording against the cited source. Fix it if needed.
4. Update the item's `meta`: `reviewStatus`, `lastReviewedDate`, `reviewerName`, `reviewerRole`,
   `uncertaintyNotes`, and `sourceRefs` (add new sources to `content/sources/registry.ts` first).
5. To publish procedural text (approach, ultrasound landmarks, sampling notes), fill the
   `SensitiveText` field **and** set `reviewStatus: "clinician-reviewed"`, `reviewerName`,
   `reviewerRole`, `reviewedDate` and `sourceRefs`. The schema rejects anything less, and the UI
   will not render it otherwise.
6. Add a row to `content/review/history.ts`, bump `contentVersion`/`contentDate` in
   `config/site.ts`, and run `npm run check`.

## Content requiring specialist review

Priority order. "Bronchoscopist" means an appropriately qualified interventional pulmonologist
or thoracic surgeon with EBUS experience.

| # | Item | File | Current status | Who | What to check |
|---|------|------|----------------|-----|---------------|
| 1 | Station boundary wording, all 20 stations | content/stations/stations.ts | source-verified (AI) | Thoracic surgeon / bronchoscopist | Each phrase is from the **IASLC** column of Rusch 2009 Table 1, not Naruke or MD-ATS. Confirm station names. Confirm 5 and 6 laterality wording. Confirm 12–14 text (table was flattened). |
| 2 | Modality access (EBUS-TBNA / EUS-B-FNA), all 20 stations | stations.ts → `accessibleBy` | **draft-unverified** | Bronchoscopist | Verify each value against the ERS/ESGE/ESTS 2026 guideline and the PMC10401980 guideline; replace `unknown`; record `otherApproaches` if wanted. |
| 3 | N-category rules (11 stations) | content/staging/nodalRules.ts | **draft-unverified** | Thoracic oncologist / surgeon | Confirm TNM edition (8th vs 9th; N2a/N2b), replace placeholder source `tnm-n-descriptors` with a real citation, confirm 1R/1L = N3 and the 2R/4R pretracheal teaching note. |
| 4 | Zone groupings (except AP zone) | content/stations/zones.ts | **draft-unverified** | Any reviewer with the paper | Read Figure 3 of Rusch 2009. |
| 5 | Grouping terms "Upper division bronchus", "Lingular bronchus" | content/airways/airways.ts | **draft-unverified** | Anatomist / bronchoscopist | Find a supporting source or rename. |
| 6 | Airway terminology (30 items) | content/airways/airways.ts | source-verified (AI) | Anatomist / bronchoscopist | Spot-check names and TA2 IDs against the TA2 PDF; read TA2 endnotes 472, 474–479 (not retrieved) and add their content to `variantNotes`. |
| 7 | LB7+8 / LB1+2 variant explanations | airways.ts, content/quiz/questions.ts | source-verified (AI) | Bronchoscopist | Confirm teaching wording; decide whether to state frequency (currently none is claimed). |
| 8 | Glossary drafts (EBUS-TBNA, EUS-B-FNA, procedural access, N category, lingula) | content/glossary/glossary.ts | **draft-unverified** | Bronchoscopist | Definitions. |
| 9 | Lesson text | app/lessons/airway-orientation/page.mdx | source-verified (AI) | Educator / bronchoscopist | Teaching order and wording. |
| 10 | Procedural fields (approach, US landmarks, sampling notes) ×20 | stations.ts | empty, hidden | Bronchoscopist | Only if the team decides to teach them. Never describe any location as universally safe. |
| 11 | Simulator schematic | components/sim/BronchoscopicView.tsx | n/a (no positional claims) | Educator | Confirm the on-screen disclaimer is sufficient; any real orientation teaching needs new, reviewed content. |
| 12 | Station map marker positions | components/ebus/stationLayout.ts | n/a (labelled approximate) | Bronchoscopist | Confirm the schematic is not misleading. |

## Medical-review checklist before deployment

- [ ] `npm run content:report` reviewed; every remaining `draft-unverified` item is acceptable to show with its draft badge, or has been removed.
- [ ] Items 1–3 above reviewed by a named clinician; `reviewerName` filled in.
- [ ] Sources `ers-esge-ests-2026`, `ebus-tbna-guideline-pmc10401980`, `chest-ebus-samples-2024`, `tnm-n-descriptors` have complete citations.
- [ ] No `SensitiveText` field contains text unless clinician-reviewed (enforced by tests; confirm intent).
- [ ] No question asks for the safest puncture site, needle entry or clock-face position (enforced by tests).
- [ ] Disclaimer on /about reviewed by the responsible institution.
- [ ] `feedbackUrl` in `config/site.ts` points to a monitored channel.
- [ ] `contentVersion`, `contentDate` and `content/review/history.ts` updated.
- [ ] `npm run check` and `npm run test:e2e` pass.
