import type { AirwayStructure, ReviewMeta } from "@/lib/contentSchemas";

/**
 * Tracheobronchial terminology dataset.
 *
 * Clinician editors: edit names, aliases, notes and review metadata here. Do not change `id`
 * values without updating quiz content (tests will tell you if something breaks).
 *
 * Terminology checked against FIPAT TA2 Part 3 (IDs in `ta2Id`) and cross-checked with IMAIOS.
 * "Source-verified" here means an automated, AI-assisted comparison with the source text on
 * 2026-10-10. It is NOT a human review; see docs/CONTENT_REVIEW.md.
 */

const REVIEW_DATE = "2026-10-10";
const AI_CHECK = "AI-assisted source check against FIPAT TA2 text (not a human reviewer)";

function verified(uncertaintyNotes = "Segmental branching patterns vary between individuals."): ReviewMeta {
  return {
    sourceRefs: ["fipat-ta2", "imaios-bronchoscopy"],
    reviewStatus: "source-verified",
    lastReviewedDate: REVIEW_DATE,
    reviewerRole: AI_CHECK,
    uncertaintyNotes,
  };
}

function draft(uncertaintyNotes: string): ReviewMeta {
  return {
    sourceRefs: ["fipat-ta2"],
    reviewStatus: "draft-unverified",
    lastReviewedDate: REVIEW_DATE,
    reviewerRole: "Not yet reviewed",
    uncertaintyNotes,
  };
}

type Input = Omit<AirwayStructure, "patterns" | "acceptedEquivalents" | "aliases" | "variantNotes"> &
  Partial<Pick<AirwayStructure, "patterns" | "acceptedEquivalents" | "aliases" | "variantNotes">>;

function a(input: Input): AirwayStructure {
  return { aliases: [], variantNotes: [], patterns: [], acceptedEquivalents: [], ...input };
}

export const AIRWAYS: AirwayStructure[] = [
  // ── Central airway ──────────────────────────────────────────────────────────
  a({
    id: "trachea",
    code: null,
    name: "Trachea",
    latinName: "Trachea",
    ta2Id: 3213,
    kind: "trachea",
    side: "midline",
    lobe: null,
    parentId: null,
    anatomyClass: "standard",
    shortDescription: "The start of every route on this site. The trachea divides at the tracheal bifurcation into the right and left main bronchi.",
    meta: verified("Airway dimensions vary between individuals; this schematic does not represent them."),
  }),
  a({
    id: "carina",
    code: null,
    name: "Carina of trachea",
    latinName: "Carina tracheae",
    ta2Id: 3225,
    kind: "carina",
    side: "midline",
    lobe: null,
    parentId: "trachea",
    aliases: ["Main carina", "Tracheal carina"],
    anatomyClass: "standard",
    shortDescription: "The ridge at the tracheal bifurcation (TA2 3224) that separates the openings of the right and left main bronchi. A key orientation landmark.",
    meta: verified("FIPAT endnote 472 on this entry was not available in the extracted text. 'Main carina' is a common clinical alias, not a TA2 term."),
  }),
  a({
    id: "rmb",
    code: null,
    name: "Right main bronchus",
    latinName: "Bronchus principalis dexter",
    ta2Id: 3237,
    kind: "main-bronchus",
    side: "right",
    lobe: null,
    parentId: "carina",
    aliases: ["Right mainstem bronchus", "RMB"],
    anatomyClass: "standard",
    shortDescription: "Leads from the carina to the right upper lobar bronchus and the intermediate bronchus.",
    meta: verified("Origin of the right upper lobar bronchus varies; a tracheal origin is a recognized variant not modeled in this MVP."),
  }),
  a({
    id: "lmb",
    code: null,
    name: "Left main bronchus",
    latinName: "Bronchus principalis sinister",
    ta2Id: 3252,
    kind: "main-bronchus",
    side: "left",
    lobe: null,
    parentId: "carina",
    aliases: ["Left mainstem bronchus", "LMB"],
    anatomyClass: "standard",
    shortDescription: "Leads from the carina to the left superior and left inferior lobar bronchi.",
    meta: verified(),
  }),

  // ── Right upper lobe ─────────────────────────────────────────────────────────
  a({
    id: "rul",
    code: null,
    name: "Right superior lobar bronchus",
    latinName: "Bronchus lobaris superior dexter",
    ta2Id: 3238,
    kind: "lobar-bronchus",
    side: "right",
    lobe: "RUL",
    parentId: "rmb",
    aliases: ["Right upper lobe bronchus", "RUL bronchus", "Eparterial bronchus"],
    anatomyClass: "standard",
    shortDescription: "Lobar bronchus of the right upper lobe; gives the apical (RB1), posterior (RB2) and anterior (RB3) segmental bronchi.",
    meta: verified("Segmental branching of the right upper lobe varies (for example, bifurcation instead of trifurcation)."),
  }),
  a({ id: "RB1", code: "RB1", name: "Apical segmental bronchus", latinName: "Bronchus I pulmonis dextri", ta2Id: 3239, kind: "segmental-bronchus", side: "right", lobe: "RUL", parentId: "rul", aliases: ["Apical segmental bronchus of right lung", "B1 (right)"], anatomyClass: "standard", shortDescription: "Segmental bronchus to the apical segment of the right upper lobe.", meta: verified("FIPAT endnote 474 on this entry was not available in the extracted text.") }),
  a({ id: "RB2", code: "RB2", name: "Posterior segmental bronchus", latinName: "Bronchus II pulmonis dextri", ta2Id: 3240, kind: "segmental-bronchus", side: "right", lobe: "RUL", parentId: "rul", aliases: ["Posterior segmental bronchus of right lung", "B2 (right)"], anatomyClass: "standard", shortDescription: "Segmental bronchus to the posterior segment of the right upper lobe.", meta: verified() }),
  a({ id: "RB3", code: "RB3", name: "Anterior segmental bronchus", latinName: "Bronchus III pulmonis dextri", ta2Id: 3241, kind: "segmental-bronchus", side: "right", lobe: "RUL", parentId: "rul", aliases: ["Anterior segmental bronchus of right lung", "B3 (right)"], anatomyClass: "standard", shortDescription: "Segmental bronchus to the anterior segment of the right upper lobe.", meta: verified() }),

  // ── Intermediate bronchus, middle and lower lobes ────────────────────────────
  a({
    id: "bi",
    code: null,
    name: "Intermediate bronchus",
    latinName: "Bronchus intermedius",
    ta2Id: 3242,
    kind: "intermediate-bronchus",
    side: "right",
    lobe: null,
    parentId: "rmb",
    aliases: ["Bronchus intermedius", "BI", "Hyparterial bronchus"],
    anatomyClass: "standard",
    shortDescription: "Continuation of the right main bronchus beyond the right upper lobar bronchus; leads to the middle and right inferior lobar bronchi.",
    variantNotes: ["'Bronchus intermedius' (the TA2 Latin term) is the name most often used clinically."],
    meta: verified("FIPAT endnote 475 on this entry was not available in the extracted text."),
  }),
  a({
    id: "rml",
    code: null,
    name: "Middle lobar bronchus",
    latinName: "Bronchus lobaris medius",
    ta2Id: 3243,
    kind: "lobar-bronchus",
    side: "right",
    lobe: "RML",
    parentId: "bi",
    aliases: ["Right middle lobar bronchus", "Right middle lobe bronchus", "RML bronchus"],
    anatomyClass: "standard",
    shortDescription: "Lobar bronchus of the right middle lobe; gives the lateral (RB4) and medial (RB5) segmental bronchi.",
    meta: verified(),
  }),
  a({ id: "RB4", code: "RB4", name: "Lateral segmental bronchus", latinName: "Bronchus IV pulmonis dextri", ta2Id: 3244, kind: "segmental-bronchus", side: "right", lobe: "RML", parentId: "rml", aliases: ["Lateral segmental bronchus of right lung", "B4 (right)"], anatomyClass: "standard", shortDescription: "Segmental bronchus to the lateral segment of the right middle lobe.", meta: verified() }),
  a({ id: "RB5", code: "RB5", name: "Medial segmental bronchus", latinName: "Bronchus V pulmonis dextri", ta2Id: 3245, kind: "segmental-bronchus", side: "right", lobe: "RML", parentId: "rml", aliases: ["Medial segmental bronchus of right lung", "B5 (right)"], anatomyClass: "standard", shortDescription: "Segmental bronchus to the medial segment of the right middle lobe.", meta: verified() }),
  a({
    id: "rll",
    code: null,
    name: "Right inferior lobar bronchus",
    latinName: "Bronchus lobaris inferior dexter",
    ta2Id: 3246,
    kind: "lobar-bronchus",
    side: "right",
    lobe: "RLL",
    parentId: "bi",
    aliases: ["Right lower lobe bronchus", "RLL bronchus"],
    anatomyClass: "standard",
    shortDescription: "Lobar bronchus of the right lower lobe; gives the superior segmental bronchus (RB6) and the four basal segmental bronchi (RB7–RB10).",
    meta: verified("This MVP shows RB6–RB10 as direct children of the lobar bronchus. Intermediate trunks (for example a 'basal trunk') are not modeled and their branching order is not taught."),
  }),
  a({ id: "RB6", code: "RB6", name: "Superior segmental bronchus", latinName: "Bronchus VI pulmonis dextri", ta2Id: 3247, kind: "segmental-bronchus", side: "right", lobe: "RLL", parentId: "rll", aliases: ["Superior segmental bronchus of right lung", "Bronchus segmentalis apicalis (TA2 alternative Latin name)", "B6 (right)"], anatomyClass: "standard", shortDescription: "Segmental bronchus to the superior segment of the right lower lobe.", variantNotes: ["TA2 also lists 'Bronchus segmentalis apicalis' as an alternative Latin name; FIPAT endnote 476 was not available."], meta: verified() }),
  a({ id: "RB7", code: "RB7", name: "Medial basal segmental bronchus", latinName: "Bronchus VII pulmonis dextri", ta2Id: 3248, kind: "segmental-bronchus", side: "right", lobe: "RLL", parentId: "rll", aliases: ["Medial basal segmental bronchus of right lung", "Cardiac bronchus (TA2 Latin synonym: bronchus cardiacus)", "B7 (right)"], anatomyClass: "standard", shortDescription: "Segmental bronchus to the medial basal segment of the right lower lobe.", variantNotes: ["Do not confuse the TA2 Latin synonym 'bronchus cardiacus' with an accessory cardiac bronchus, which is a separate congenital variant not covered here."], meta: verified("FIPAT endnote 477 on this entry was not available in the extracted text.") }),
  a({ id: "RB8", code: "RB8", name: "Anterior basal segmental bronchus", latinName: "Bronchus VIII pulmonis dextri", ta2Id: 3249, kind: "segmental-bronchus", side: "right", lobe: "RLL", parentId: "rll", aliases: ["Anterior basal segmental bronchus of right lung", "B8 (right)"], anatomyClass: "standard", shortDescription: "Segmental bronchus to the anterior basal segment of the right lower lobe.", meta: verified() }),
  a({ id: "RB9", code: "RB9", name: "Lateral basal segmental bronchus", latinName: "Bronchus IX pulmonis dextri", ta2Id: 3250, kind: "segmental-bronchus", side: "right", lobe: "RLL", parentId: "rll", aliases: ["Lateral basal segmental bronchus of right lung", "B9 (right)"], anatomyClass: "standard", shortDescription: "Segmental bronchus to the lateral basal segment of the right lower lobe.", meta: verified() }),
  a({ id: "RB10", code: "RB10", name: "Posterior basal segmental bronchus", latinName: "Bronchus X pulmonis dextri", ta2Id: 3251, kind: "segmental-bronchus", side: "right", lobe: "RLL", parentId: "rll", aliases: ["Posterior basal segmental bronchus of right lung", "B10 (right)"], anatomyClass: "standard", shortDescription: "Segmental bronchus to the posterior basal segment of the right lower lobe.", meta: verified() }),

  // ── Left upper lobe ──────────────────────────────────────────────────────────
  a({
    id: "lul",
    code: null,
    name: "Left superior lobar bronchus",
    latinName: "Bronchus lobaris superior sinister",
    ta2Id: 3253,
    kind: "lobar-bronchus",
    side: "left",
    lobe: "LUL",
    parentId: "lmb",
    aliases: ["Left upper lobe bronchus", "LUL bronchus"],
    anatomyClass: "standard",
    shortDescription: "Lobar bronchus of the left upper lobe. In this atlas its branches are grouped into an upper division (LB1+2, LB3) and the lingula (LB4, LB5).",
    meta: verified(),
  }),
  a({
    id: "lul-upper-division",
    code: null,
    name: "Upper division bronchus of left upper lobe",
    kind: "division-bronchus",
    side: "left",
    lobe: "LUL",
    region: "Upper division",
    parentId: "lul",
    aliases: ["Upper division bronchus", "Superior division bronchus", "Culminal bronchus"],
    anatomyClass: "common",
    shortDescription: "Clinical grouping term for the branch of the left superior lobar bronchus that gives LB1+2 and LB3.",
    meta: draft("Clinical grouping term. Not found as a named entry in the retrieved FIPAT TA2 text. Needs a supporting source or clinician review before it is marked verified."),
  }),
  a({
    id: "LB1+2",
    code: "LB1+2",
    name: "Apicoposterior segmental bronchus",
    latinName: "Bronchus I+II pulmonis sinistri",
    ta2Id: 3254,
    kind: "segmental-bronchus",
    side: "left",
    lobe: "LUL",
    region: "Upper division",
    parentId: "lul-upper-division",
    aliases: ["Apicoposterior segmental bronchus of left lung", "B1+2 (left)"],
    anatomyClass: "standard",
    variantNotes: [
      "FIPAT TA2 lists a single apicoposterior bronchus (B1+2) on the left, not separate left B1 and B2.",
      "Some descriptions name its apical and posterior branches separately; this atlas does not model them in the MVP.",
    ],
    shortDescription: "Segmental bronchus to the apicoposterior segment of the left upper lobe.",
    meta: verified(),
  }),
  a({ id: "LB3", code: "LB3", name: "Anterior segmental bronchus", latinName: "Bronchus III pulmonis sinistri", ta2Id: 3255, kind: "segmental-bronchus", side: "left", lobe: "LUL", region: "Upper division", parentId: "lul-upper-division", aliases: ["Anterior segmental bronchus of left lung", "B3 (left)"], anatomyClass: "standard", shortDescription: "Segmental bronchus to the anterior segment of the left upper lobe.", meta: verified() }),
  a({
    id: "lingular",
    code: null,
    name: "Lingular bronchus",
    kind: "division-bronchus",
    side: "left",
    lobe: "LUL",
    region: "Lingula",
    parentId: "lul",
    aliases: ["Lingular division bronchus", "Inferior division bronchus"],
    anatomyClass: "common",
    shortDescription: "Clinical grouping term for the branch of the left superior lobar bronchus that gives LB4 and LB5.",
    meta: draft("Clinical grouping term. 'Lingular bronchus' was not found as a named entry in the retrieved FIPAT TA2 text. Needs a supporting source or clinician review."),
  }),
  a({ id: "LB4", code: "LB4", name: "Superior lingular segmental bronchus", latinName: "Bronchus IV pulmonis sinistri", ta2Id: 3256, kind: "segmental-bronchus", side: "left", lobe: "LUL", region: "Lingula", parentId: "lingular", aliases: ["Superior lingular segmental bronchus of left lung", "B4 (left)"], anatomyClass: "standard", shortDescription: "Segmental bronchus to the superior lingular segment of the left upper lobe.", meta: verified() }),
  a({ id: "LB5", code: "LB5", name: "Inferior lingular segmental bronchus", latinName: "Bronchus V pulmonis sinistri", ta2Id: 3257, kind: "segmental-bronchus", side: "left", lobe: "LUL", region: "Lingula", parentId: "lingular", aliases: ["Inferior lingular segmental bronchus of left lung", "B5 (left)"], anatomyClass: "standard", shortDescription: "Segmental bronchus to the inferior lingular segment of the left upper lobe.", meta: verified() }),

  // ── Left lower lobe ──────────────────────────────────────────────────────────
  a({
    id: "lll",
    code: null,
    name: "Left inferior lobar bronchus",
    latinName: "Bronchus lobaris inferior sinister",
    ta2Id: 3258,
    kind: "lobar-bronchus",
    side: "left",
    lobe: "LLL",
    parentId: "lmb",
    aliases: ["Left lower lobe bronchus", "LLL bronchus"],
    anatomyClass: "standard",
    shortDescription: "Lobar bronchus of the left lower lobe; gives the superior segmental bronchus (LB6) and the basal segmental bronchi.",
    variantNotes: ["The medial basal and anterior basal bronchi may be described separately (LB7, LB8) or as a combined anteromedial basal bronchus (LB7+8). Use the variant toggle to compare."],
    meta: verified("This MVP shows LB6–LB10 as direct children of the lobar bronchus; intermediate trunks are not modeled."),
  }),
  a({ id: "LB6", code: "LB6", name: "Superior segmental bronchus", latinName: "Bronchus VI pulmonis sinistri", ta2Id: 3259, kind: "segmental-bronchus", side: "left", lobe: "LLL", parentId: "lll", aliases: ["Superior segmental bronchus of left lung", "B6 (left)"], anatomyClass: "standard", shortDescription: "Segmental bronchus to the superior segment of the left lower lobe.", meta: verified() }),
  a({
    id: "LB7",
    code: "LB7",
    name: "Medial basal segmental bronchus",
    latinName: "Bronchus VII pulmonis sinistri",
    ta2Id: 3260,
    kind: "segmental-bronchus",
    side: "left",
    lobe: "LLL",
    parentId: "lll",
    aliases: ["Medial basal segmental bronchus of left lung", "B7 (left)"],
    anatomyClass: "standard",
    patterns: ["LLL-separate-7-8"],
    acceptedEquivalents: ["LB7+8"],
    variantNotes: ["Shown when the medial basal bronchus is separately present/described. May instead be described together with LB8 as LB7+8."],
    shortDescription: "Segmental bronchus to the medial basal segment of the left lower lobe, when separately present/described.",
    meta: verified("FIPAT endnote 478 on this entry was not available in the extracted text."),
  }),
  a({
    id: "LB8",
    code: "LB8",
    name: "Anterior basal segmental bronchus",
    latinName: "Bronchus VIII pulmonis sinistri",
    ta2Id: 3262,
    kind: "segmental-bronchus",
    side: "left",
    lobe: "LLL",
    parentId: "lll",
    aliases: ["Anterior basal segmental bronchus of left lung", "B8 (left)"],
    anatomyClass: "standard",
    patterns: ["LLL-separate-7-8"],
    acceptedEquivalents: ["LB7+8"],
    variantNotes: ["Shown when the anterior basal bronchus is separately present/described. May instead be described together with LB7 as LB7+8."],
    shortDescription: "Segmental bronchus to the anterior basal segment of the left lower lobe, when separately present/described.",
    meta: verified(),
  }),
  a({
    id: "LB7+8",
    code: "LB7+8",
    name: "Anteromedial basal segmental bronchus",
    latinName: "Bronchus VII+VIII pulmonis sinistri",
    ta2Id: 3261,
    kind: "segmental-bronchus",
    side: "left",
    lobe: "LLL",
    parentId: "lll",
    aliases: ["Anteromedial basal segmental bronchus of left lung", "B7+8 (left)", "Anteromedial basal bronchus"],
    anatomyClass: "variant",
    patterns: ["LLL-combined-7+8"],
    acceptedEquivalents: ["LB7", "LB8"],
    variantNotes: [
      "FIPAT TA2 lists this term in parentheses as an alternative to separate LB7 and LB8. It is a nomenclature/anatomical variant, not an error.",
      "IMAIOS lists left B7 and B8 separately and does not mention B7+8.",
    ],
    shortDescription: "Combined medial and anterior basal bronchus of the left lower lobe, when represented as a single branch.",
    meta: verified("How often the combined pattern is used or found is not stated in the retrieved source text; this site does not claim a frequency. FIPAT endnote 479 was not available."),
  }),
  a({ id: "LB9", code: "LB9", name: "Lateral basal segmental bronchus", latinName: "Bronchus IX pulmonis sinistri", ta2Id: 3263, kind: "segmental-bronchus", side: "left", lobe: "LLL", parentId: "lll", aliases: ["Lateral basal segmental bronchus of left lung", "B9 (left)"], anatomyClass: "standard", shortDescription: "Segmental bronchus to the lateral basal segment of the left lower lobe.", meta: verified() }),
  a({ id: "LB10", code: "LB10", name: "Posterior basal segmental bronchus", latinName: "Bronchus X pulmonis sinistri", ta2Id: 3264, kind: "segmental-bronchus", side: "left", lobe: "LLL", parentId: "lll", aliases: ["Posterior basal segmental bronchus of left lung", "B10 (left)"], anatomyClass: "standard", shortDescription: "Segmental bronchus to the posterior basal segment of the left lower lobe.", meta: verified() }),
];

/** Branching patterns a learner can switch between in the atlas and simulator. */
export const BRANCHING_PATTERNS = {
  standard: { id: "standard", label: "Standard listing", activePatterns: ["LLL-separate-7-8"] },
  variants: { id: "variants", label: "Show variant patterns", activePatterns: ["LLL-combined-7+8"] },
} as const;
export type PatternMode = keyof typeof BRANCHING_PATTERNS;
