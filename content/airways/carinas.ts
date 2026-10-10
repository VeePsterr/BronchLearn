import type { Carina, ReviewMeta } from "@/lib/contentSchemas";

/**
 * Main and secondary carinas. Labels RC1, RC2, LC1, LC2 follow the chapter
 * "Bronchoscopic Anatomy of Tracheobronchial Tree" (Bronchoscopy in ICU, Jaypee), read via an
 * automated tool on 2026-10-10.
 */

const DATE = "2026-10-10";
const jaypee = (uncertaintyNotes: string): ReviewMeta => ({
  sourceRefs: ["jaypee-bronchoscopy-icu-ch1"],
  reviewStatus: "source-verified",
  lastReviewedDate: DATE,
  reviewerRole: "AI-assisted source check against chapter text (not a human reviewer)",
  uncertaintyNotes,
});
const jaypeeConflict: ReviewMeta = {
  sourceRefs: ["jaypee-bronchoscopy-icu-ch1"],
  reviewStatus: "draft-unverified",
  lastReviewedDate: DATE,
  reviewerRole: "Not yet reviewed",
  uncertaintyNotes:
    "The source is internally inconsistent: its text places LC1 between the upper division and the lingula, while its figure captions place LC1 between the left upper and lower lobe bronchi and LC2 between the upper division and the lingula. This site follows the figure captions until a clinician confirms.",
};

export const CARINAS: Carina[] = [
  {
    id: "main-carina",
    label: "Main carina",
    name: "Carina of trachea",
    aliases: ["Main carina", "Tracheal carina", "Carina tracheae"],
    atAirwayId: "carina",
    separates: ["rmb", "lmb"],
    description: "The ridge at the tracheal bifurcation separating the right and left main bronchi.",
    meta: {
      sourceRefs: ["fipat-ta2"],
      reviewStatus: "source-verified",
      lastReviewedDate: DATE,
      reviewerRole: "AI-assisted source check against FIPAT TA2 text (not a human reviewer)",
      uncertaintyNotes: "'Main carina' is a common clinical alias, not a TA2 term.",
    },
  },
  {
    id: "RC1",
    label: "RC1",
    name: "Right carina 1",
    aliases: ["RC-1", "Right upper lobe carina (informal)"],
    atAirwayId: "rmb",
    separates: ["rul", "bi"],
    description: "Secondary carina dividing the right upper lobe bronchus from the bronchus intermedius.",
    meta: jaypee("The informal alias 'right upper lobe carina' is not from the source."),
  },
  {
    id: "RC2",
    label: "RC2",
    name: "Right carina 2",
    aliases: ["RC-2"],
    atAirwayId: "bi",
    separates: ["rml", "rll"],
    description: "Secondary carina between the right middle lobe bronchus and the right lower lobe bronchus.",
    meta: jaypee(""),
  },
  {
    id: "LC1",
    label: "LC1",
    name: "Left carina 1",
    aliases: ["LC-1"],
    atAirwayId: "lmb",
    separates: ["lul", "lll"],
    description: "Secondary carina between the left upper lobe and left lower lobe bronchi (per the source's figure caption).",
    meta: jaypeeConflict,
  },
  {
    id: "LC2",
    label: "LC2",
    name: "Left carina 2",
    aliases: ["LC-2"],
    atAirwayId: "lul",
    separates: ["lul-upper-division", "lingular"],
    description: "Secondary carina dividing the left upper lobe bronchus into its upper division and the lingular bronchus (per the source's figure caption).",
    meta: jaypeeConflict,
  },
];

export function getCarinaAt(airwayId: string): Carina | undefined {
  return CARINAS.find((c) => c.atAirwayId === airwayId);
}
export function getCarina(id: string): Carina | undefined {
  return CARINAS.find((c) => c.id === id);
}
