import type { BronchoscopicViewLayout, ReviewMeta } from "@/lib/contentSchemas";

/**
 * Approximate on-screen arrangement of openings for the simulated bronchoscopic view.
 *
 * Convention (as requested by the project owner and consistent with the clinical images on the
 * user-supplied Olympus poster): the image is shown as a bronchoscopist standing at the head of a
 * supine patient sees it, so at the main carina the LEFT main bronchus is on the LEFT of the
 * screen and the RIGHT main bronchus is on the RIGHT.
 *
 * DRAFT-UNVERIFIED: no registered authoritative source states this convention or these
 * positions. They were estimated from the poster's clinical images (positions only; nothing
 * copied or traced) and must be checked by a bronchoscopist. Real images vary with scope
 * rotation, operator position (for example a face-to-face approach) and patient anatomy.
 * Airways without an entry fall back to evenly spaced openings, labelled as such.
 */

const meta = (extra = ""): ReviewMeta => ({
  sourceRefs: ["olympus-videobronchoscopy-poster"],
  reviewStatus: "draft-unverified",
  lastReviewedDate: "2026-10-10",
  reviewerRole: "Not yet reviewed",
  uncertaintyNotes: `Approximate positions estimated from a user-supplied manufacturer poster; not from an authoritative source. Depend on scope rotation and operator position.${extra ? " " + extra : ""}`,
});

export const VIEW_CONVENTION = {
  summary: "Bronchoscopist's view from the head of the patient: the patient's left is on the left of the screen, the patient's right on the right.",
  meta: meta(),
};

export const BRONCHOSCOPIC_VIEWS: BronchoscopicViewLayout[] = [
  { airwayId: "trachea", openings: [{ childId: "carina", x: 0, y: 0.04, r: 0.36 }], carinaId: null, meta: meta() },
  {
    airwayId: "carina",
    openings: [
      { childId: "lmb", x: -0.4, y: -0.04, r: 0.33 },
      { childId: "rmb", x: 0.4, y: 0.1, r: 0.35 },
    ],
    carinaId: "main-carina",
    meta: meta(),
  },
  {
    airwayId: "rmb",
    openings: [
      { childId: "rul", x: 0.46, y: -0.44, r: 0.2 },
      { childId: "bi", x: -0.06, y: 0.2, r: 0.42 },
    ],
    carinaId: "RC1",
    meta: meta(),
  },
  {
    airwayId: "rul",
    openings: [
      { childId: "RB1", x: 0.14, y: -0.5, r: 0.2 },
      { childId: "RB3", x: -0.46, y: 0.04, r: 0.22 },
      { childId: "RB2", x: 0.44, y: 0.26, r: 0.2 },
    ],
    carinaId: null,
    meta: meta(),
  },
  {
    airwayId: "bi",
    openings: [
      { childId: "rml", x: -0.46, y: 0.3, r: 0.24 },
      { childId: "rll", x: 0.16, y: -0.06, r: 0.38 },
    ],
    carinaId: "RC2",
    meta: meta(),
  },
  {
    airwayId: "rll",
    openings: [
      { childId: "RB6", x: 0.46, y: -0.5, r: 0.17 },
      { childId: "RB7", x: -0.52, y: 0.04, r: 0.16 },
      { childId: "RB8", x: -0.06, y: -0.26, r: 0.18 },
      { childId: "RB9", x: 0.32, y: 0.16, r: 0.17 },
      { childId: "RB10", x: 0.04, y: 0.48, r: 0.18 },
    ],
    carinaId: null,
    meta: meta("The basal bronchi are shown together with RB6 because this site does not model a basal trunk."),
  },
  {
    airwayId: "lmb",
    openings: [
      { childId: "lul", x: 0.34, y: -0.4, r: 0.26 },
      { childId: "lll", x: -0.06, y: 0.24, r: 0.38 },
    ],
    carinaId: "LC1",
    meta: meta(),
  },
  {
    airwayId: "lul",
    openings: [
      { childId: "lul-upper-division", x: -0.06, y: -0.44, r: 0.26 },
      { childId: "lingular", x: 0.44, y: 0.16, r: 0.24 },
    ],
    carinaId: "LC2",
    meta: meta(),
  },
  {
    airwayId: "lul-upper-division",
    openings: [
      { childId: "LB1+2", x: -0.3, y: -0.26, r: 0.24 },
      { childId: "LB3", x: 0.32, y: 0.26, r: 0.24 },
    ],
    carinaId: null,
    meta: meta(),
  },
  {
    airwayId: "lll",
    openings: [
      { childId: "LB6", x: 0.44, y: 0.42, r: 0.2 },
      { childId: "LB7", x: -0.56, y: -0.18, r: 0.14 },
      { childId: "LB8", x: -0.24, y: -0.5, r: 0.16 },
      { childId: "LB7+8", x: -0.38, y: -0.42, r: 0.18 },
      { childId: "LB9", x: -0.16, y: -0.08, r: 0.16 },
      { childId: "LB10", x: -0.06, y: 0.3, r: 0.17 },
    ],
    carinaId: null,
    meta: meta("The basal bronchi are shown together with LB6 because this site does not model a basal trunk."),
  },
];

export function getViewLayout(airwayId: string): BronchoscopicViewLayout | undefined {
  return BRONCHOSCOPIC_VIEWS.find((v) => v.airwayId === airwayId);
}
