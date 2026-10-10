import type { ReviewMeta, Zone } from "@/lib/contentSchemas";

const DATE = "2026-10-10";
const figureOnly: ReviewMeta = {
  sourceRefs: ["iaslc-map-2009"],
  reviewStatus: "draft-unverified",
  lastReviewedDate: DATE,
  reviewerRole: "Not yet reviewed",
  uncertaintyNotes:
    "Zone groupings are shown in Figure 3 of the IASLC map paper, which could not be read. The source text describes zones as proposed for survival analyses.",
};

export const ZONES: Zone[] = [
  { id: "supraclavicular", name: "Supraclavicular zone", stations: ["1R", "1L"], meta: figureOnly },
  { id: "upper", name: "Upper zone", stations: ["2R", "2L", "3a", "3p", "4R", "4L"], meta: figureOnly },
  {
    id: "aortopulmonary",
    name: "Aortopulmonary (AP) zone",
    stations: ["5", "6"],
    meta: {
      sourceRefs: ["iaslc-map-2009"],
      reviewStatus: "source-verified",
      lastReviewedDate: DATE,
      reviewerRole: "AI-assisted source check against IASLC map text (not a human reviewer)",
      uncertaintyNotes: "The source text equates the AP zone with levels 5 and 6.",
    },
  },
  { id: "subcarinal", name: "Subcarinal zone", stations: ["7"], meta: figureOnly },
  { id: "lower", name: "Lower zone", stations: ["8", "9"], meta: figureOnly },
  { id: "hilar-interlobar", name: "Hilar/interlobar zone", stations: ["10R", "10L", "11R", "11L"], meta: figureOnly },
  { id: "peripheral", name: "Peripheral zone", stations: ["12", "13", "14"], meta: figureOnly },
];

export function getZone(id: string): Zone | undefined {
  return ZONES.find((z) => z.id === id);
}
