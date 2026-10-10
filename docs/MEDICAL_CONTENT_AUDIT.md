# Medical-content audit (Milestone 6, 2026-10-10)

Generated from `npm run content:report` and a manual read of every content file and page.

## Inventory

| Content | Source-verified (AI-assisted) | Draft-unverified | Clinician-reviewed | Notes |
|---|---|---|---|---|
| Airway structures | 30 | 2 | 0 | Drafts: upper division and lingular grouping terms |
| Station anatomy | 20 | 0 | 0 | IASLC 2009 table text; column attribution needs human check |
| Station modality access | 0 | 20 | 0 | Guidelines not accessible |
| Station procedural fields | — | — | — | 60 fields empty and hidden |
| Zones | 1 (AP) | 6 | 0 | Figure 3 not readable |
| N-category rules | 0 | 11 | 0 | TNM text not retrieved |
| Glossary | 9 | 7 | 0 | Secondary carina and simulated-view entries are draft |
| Quiz questions | 62 | 15 | 0 | Drafts hidden by default |
| Carinas (added 0.2.0) | 3 (main, RC1, RC2) | 2 (LC1, LC2) | 0 | Jaypee chapter text vs figure captions disagree on LC1 |
| Screen-orientation convention | 0 | 1 | 0 | No authoritative source states it; owner instruction + manufacturer poster |
| Bronchoscopic view layouts | 0 | 10 | 0 | Approximate positions; RML and lingula not modelled |

## Rule-by-rule check against the brief's medical-accuracy rules

| Rule | Status | Evidence |
|---|---|---|
| 1. Nothing invented (anatomy, boundaries, positions, needle paths…) | Met, with caveats | Boundaries quoted from source text; access values drafted from general knowledge and labelled draft; no positions, clock faces, needle paths or sampling instructions exist anywhere. Schematic layouts are labelled "not to scale / not true position". Since 0.2.0 the simulated views show draft, approximate opening positions with a draft badge and a caption; no clock positions are given. |
| 2. Every content object has sourceRefs, reviewStatus, date, reviewer, uncertainty notes | Met | Zod schemas require them; tests in `tests/content/*` fail otherwise. |
| 3. Three review statuses | Met | `lib/contentSchemas/common.ts`. |
| 4. Procedural details hidden until reviewed | Met | `SensitiveText` + `isSensitiveDisplayable`; component test renders every station and asserts 3 hidden fields. |
| 5. No "safe to biopsy" | Met | Test greps content and quiz bank. Station card states that no location is universally safe. |
| 6. Precise wording | Met | "EBUS-TBNA sampling", "station identification", "simulated learning view", "typical airway approach" (locked). |
| 7. No universal N category | Met | `NodalRule` has no default; UI and quiz require tumour side; schema refinement rejects N questions without context. |
| 8. Separate standard / common / variant / institutional | Partly met | `anatomyClass` separates standard, common, variant. Institution-specific practice is not modelled because no such content exists yet. |
| 9. Persistent notice | Met | `EducationNotice` in root layout; e2e test checks every page. |
| 10. Disclaimer and review history on About | Met | /about. |

## Issues found during the audit and fixed

- An uncertainty note on the trachea made an unsourced claim about tracheal dimensions; replaced with a neutral statement.
- The station 3a "airway relationship" was an inference not in the source; set to null.
- Station 3a "common confusion" reworded to use only source landmarks.

## Residual risks

- Since 0.2.0 the simulated views look more realistic, so learners may read the draft opening positions as true anatomy. They carry a draft badge and caption until a bronchoscopist reviews items 11–11b in `CONTENT_REVIEW.md`.

- AI-assisted extraction may have mis-assigned IASLC vs MD-ATS wording (see review list item 1).
- Learners may treat draft access values as fact despite badges; consider hiding the modality filter until item 2 is reviewed.
- The mobile airway tree is small; text alternatives exist (search, child-branch buttons).
