import type { QuizQuestion, ReviewMeta } from "@/lib/contentSchemas";
import { getNodalRule } from "@/content/staging/nodalRules";
import { getStation } from "@/content/stations/stations";

/**
 * Hand-written quiz questions. Airway terminology questions are generated from the airway
 * dataset in lib/quiz/generate.ts so they can never drift from it.
 *
 * Do NOT add "choose the safest puncture site" or any sampling-technique questions until those
 * cases are written and clinician-reviewed.
 */

const DATE = "2026-10-10";
const stationMeta: ReviewMeta = {
  sourceRefs: ["iaslc-map-2009"],
  reviewStatus: "source-verified",
  lastReviewedDate: DATE,
  reviewerRole: "AI-assisted source check against IASLC map text (not a human reviewer)",
  uncertaintyNotes: "Based on IASLC boundary wording; individual anatomy varies.",
};
const terminologyMeta: ReviewMeta = {
  sourceRefs: ["fipat-ta2", "imaios-bronchoscopy"],
  reviewStatus: "source-verified",
  lastReviewedDate: DATE,
  reviewerRole: "AI-assisted source check against FIPAT TA2 text (not a human reviewer)",
  uncertaintyNotes: "Nomenclature differs between sources; variants are not errors.",
};

const opt = (...ids: string[]) => ids.map((id) => ({ id, label: `Station ${id}` }));

function landmark(id: string, prompt: string, answer: string, options: string[], explanation: string): QuizQuestion {
  return {
    id,
    type: "station-from-landmarks",
    prompt,
    options: opt(...options),
    acceptedOptionIds: [answer],
    explanation,
    airwayRefs: [],
    stationRefs: options,
    meta: stationMeta,
  };
}

const ACCESS_OPTIONS = [
  { id: "ebus", label: "EBUS-TBNA only" },
  { id: "eusb", label: "EUS-B-FNA only" },
  { id: "both", label: "Both EBUS-TBNA and EUS-B-FNA" },
  { id: "neither", label: "Neither (not conventionally reached)" },
];

function access(code: string): QuizQuestion {
  const s = getStation(code)!;
  const e = s.accessibleBy.ebusTbna === "conventional";
  const u = s.accessibleBy.eusBFna === "conventional";
  const answer = e && u ? "both" : e ? "ebus" : u ? "eusb" : "neither";
  return {
    id: `access-${code.toLowerCase()}`,
    type: "modality-access",
    prompt: `According to this site's draft access table, which modality is listed as conventionally reaching station ${code} (${s.stationName})?`,
    options: ACCESS_OPTIONS,
    acceptedOptionIds: [answer],
    explanation: `The draft table lists EBUS-TBNA as "${s.accessibleBy.ebusTbna}" and EUS-B-FNA as "${s.accessibleBy.eusBFna}" for station ${code}. These values are unverified placeholders, and access never decides where a particular patient should be sampled.`,
    airwayRefs: [],
    stationRefs: [code],
    meta: s.accessibleBy.meta,
  };
}

function nCat(code: string, side: "right" | "left"): QuizQuestion {
  const rule = getNodalRule(code)!;
  return {
    id: `n-category-${code.toLowerCase()}-${side}`,
    type: "n-category",
    prompt: `Hypothetical ${side}-lung primary tumour. If station ${code} were involved, which N category would that represent?`,
    options: [
      { id: "N1", label: "N1" },
      { id: "N2", label: "N2" },
      { id: "N3", label: "N3" },
    ],
    acceptedOptionIds: [rule.byTumourSide[side]],
    explanation: rule.reasoning[side],
    airwayRefs: [],
    stationRefs: [code],
    tumourContext: { side, description: `Hypothetical primary tumour in the ${side} lung` },
    meta: rule.meta,
  };
}

export const HANDWRITTEN_QUESTIONS: QuizQuestion[] = [
  landmark(
    "landmark-subcarinal",
    "Which station has the carina as its upper border, and the upper border of the left lower lobe bronchus / lower border of the bronchus intermedius as its lower border?",
    "7",
    ["7", "8", "10R", "4R"],
    "Station 7 (subcarinal): upper border the carina; lower border the upper border of the lower lobe bronchus on the left and the lower border of the bronchus intermedius on the right.",
  ),
  landmark(
    "landmark-4r",
    "Right paratracheal and pretracheal nodes extending to the left lateral border of the trachea, from the caudal margin of the innominate vein down to the lower border of the azygos vein. Which station?",
    "4R",
    ["2R", "4R", "4L", "10R"],
    "These are the IASLC boundaries of station 4R. Note that pretracheal nodes up to the left lateral tracheal border are right-sided.",
  ),
  landmark(
    "landmark-4l",
    "Nodes to the left of the left lateral border of the trachea, medial to the ligamentum arteriosum, between the upper margin of the aortic arch and the upper rim of the left main pulmonary artery. Which station?",
    "4L",
    ["2L", "4L", "5", "10L"],
    "Station 4L lies medial to the ligamentum arteriosum; station 5 lies lateral to it.",
  ),
  landmark(
    "landmark-5",
    "Subaortic nodes lateral to the ligamentum arteriosum, between the lower border of the aortic arch and the upper rim of the left main pulmonary artery. Which station?",
    "5",
    ["4L", "5", "6", "10L"],
    "Station 5 (subaortic) is lateral to the ligamentum arteriosum.",
  ),
  landmark(
    "landmark-9",
    "Nodes within the pulmonary ligament, from the inferior pulmonary vein down to the diaphragm. Which station?",
    "9",
    ["7", "8", "9", "11L"],
    "Station 9 (pulmonary ligament): upper border the inferior pulmonary vein, lower border the diaphragm.",
  ),
  landmark(
    "landmark-10r",
    "On the right, nodes immediately adjacent to the mainstem bronchus and hilar vessels, from the lower rim of the azygos vein to the interlobar region. Which station?",
    "10R",
    ["4R", "7", "10R", "11R"],
    "Station 10R begins at the lower rim of the azygos vein, where station 4R ends.",
  ),
  landmark(
    "landmark-3a",
    "On the right, nodes whose posterior border is the anterior border of the superior vena cava and whose anterior border is the posterior aspect of the sternum. Which station?",
    "3a",
    ["2R", "3a", "3p", "4R"],
    "Station 3a (prevascular) lies anterior to the superior vena cava on the right.",
  ),
  access("7"),
  access("9"),
  access("6"),
  access("11R"),
  nCat("4L", "right"),
  nCat("4L", "left"),
  nCat("10R", "right"),
  nCat("7", "left"),
  nCat("4R", "left"),
  nCat("1R", "left"),
  {
    id: "variant-lb7plus8-labeling",
    type: "variant-recognition",
    prompt: "A learner labels a single combined medial-and-anterior basal bronchus of the left lower lobe as LB7+8. How should this be judged?",
    options: [
      { id: "accept", label: "Acceptable: LB7+8 (anteromedial basal) is a recognized alternative pattern" },
      { id: "reject-separate", label: "Wrong: the left lower lobe must always have separate LB7 and LB8" },
      { id: "reject-right", label: "Wrong: B7+8 only exists in the right lung" },
    ],
    acceptedOptionIds: ["accept"],
    explanation:
      "FIPAT TA2 lists the anteromedial basal segmental bronchus of the left lung (B7+8) as an alternative (in parentheses) to separate B7 and B8. Separate and combined patterns are both taught here; neither is a learner error.",
    airwayRefs: ["LB7+8", "LB7", "LB8"],
    stationRefs: [],
    meta: terminologyMeta,
  },
  {
    id: "variant-lb1plus2",
    type: "variant-recognition",
    prompt: "Which left-lung code does FIPAT TA2 use for the combined apical and posterior segmental bronchus?",
    options: [
      { id: "LB1+2", label: "LB1+2" },
      { id: "LB3", label: "LB3" },
      { id: "LB4", label: "LB4" },
      { id: "LB6", label: "LB6" },
    ],
    acceptedOptionIds: ["LB1+2"],
    explanation: "TA2 lists a single apicoposterior segmental bronchus of the left lung (B1+2) rather than separate left B1 and B2.",
    airwayRefs: ["LB1+2", "LB3", "LB4", "LB6"],
    stationRefs: [],
    meta: terminologyMeta,
  },
  {
    id: "variant-lll-basal-count",
    type: "variant-recognition",
    prompt: "In the separately-described pattern, which set lists the basal segmental bronchi of the left lower lobe?",
    options: [
      { id: "separate", label: "LB7, LB8, LB9, LB10" },
      { id: "combined", label: "LB7+8, LB9, LB10" },
      { id: "wrong", label: "LB6, LB7, LB8" },
    ],
    acceptedOptionIds: ["separate"],
    explanation:
      "When LB7 and LB8 are separately present/described, the basal bronchi are LB7, LB8, LB9 and LB10. In the combined pattern the set is LB7+8, LB9 and LB10; that pattern is a variant, not an error.",
    airwayRefs: ["LB7", "LB8", "LB9", "LB10", "LB7+8"],
    stationRefs: [],
    meta: terminologyMeta,
  },
];
