import type { NodalRule, NCategory, ReviewMeta } from "@/lib/contentSchemas";

/**
 * N-category teaching rules for a HYPOTHETICAL primary tumour side.
 * DRAFT-UNVERIFIED: the TNM N descriptors were not retrieved during the source audit.
 * There is deliberately no side-independent category; the UI always asks for a tumour side first.
 */

const meta: ReviewMeta = {
  sourceRefs: ["tnm-n-descriptors", "iaslc-map-2009"],
  reviewStatus: "draft-unverified",
  lastReviewedDate: "2026-10-10",
  reviewerRole: "Not yet reviewed",
  uncertaintyNotes:
    "Drafted from the general structure of the TNM N descriptors (ipsilateral hilar/intrapulmonary = N1; ipsilateral mediastinal or subcarinal = N2; contralateral mediastinal/hilar or any scalene/supraclavicular = N3). The TNM edition must be confirmed; the 9th edition subdivides N2 (N2a/N2b), which this MVP does not teach. Education only; not for staging real patients.",
};

const SUPRACLAV = "Station 1 nodes are low cervical/supraclavicular/sternal notch nodes, which are N3 whichever side the tumour is on.";
const SUBCARINAL = "Station 7 (subcarinal) is a single midline group; subcarinal involvement is N2 for a tumour on either side.";

function sided(code: string, ipsi: NCategory, kind: "mediastinal" | "hilar"): NodalRule {
  const side = code.endsWith("R") ? "right" : "left";
  const other = side === "right" ? "left" : "right";
  const ipsiText =
    kind === "mediastinal"
      ? `${code} is an ipsilateral mediastinal station for a ${side}-sided tumour, so involvement is N2.`
      : `${code} is an ipsilateral hilar/interlobar station for a ${side}-sided tumour, so involvement is N1.`;
  const pretracheal =
    code === "2R" || code === "4R"
      ? " Remember that the right/left border for stations 2 and 4 is the left lateral border of the trachea, so midline pretracheal nodes are right-sided."
      : "";
  const contraText = `${code} is a contralateral ${kind} station for a ${other}-sided tumour, so involvement is N3.${pretracheal}`;
  return {
    stationCode: code,
    byTumourSide: side === "right" ? { right: ipsi, left: "N3" } : { right: "N3", left: ipsi },
    reasoning: side === "right" ? { right: ipsiText, left: contraText } : { right: contraText, left: ipsiText },
    meta,
  };
}

export const NODAL_RULES: NodalRule[] = [
  { stationCode: "1R", byTumourSide: { right: "N3", left: "N3" }, reasoning: { right: SUPRACLAV, left: SUPRACLAV }, meta },
  { stationCode: "1L", byTumourSide: { right: "N3", left: "N3" }, reasoning: { right: SUPRACLAV, left: SUPRACLAV }, meta },
  sided("2R", "N2", "mediastinal"),
  sided("2L", "N2", "mediastinal"),
  sided("4R", "N2", "mediastinal"),
  sided("4L", "N2", "mediastinal"),
  { stationCode: "7", byTumourSide: { right: "N2", left: "N2" }, reasoning: { right: SUBCARINAL, left: SUBCARINAL }, meta },
  sided("10R", "N1", "hilar"),
  sided("10L", "N1", "hilar"),
  sided("11R", "N1", "hilar"),
  sided("11L", "N1", "hilar"),
];

export function getNodalRule(code: string): NodalRule | undefined {
  return NODAL_RULES.find((r) => r.stationCode === code);
}
