import { UNAVAILABLE, type LymphNodeStation, type StationAccess } from "@/lib/contentSchemas";

/**
 * IASLC thoracic lymph-node stations.
 *
 * Boundary wording is taken from the IASLC lymph node map (Rusch et al., J Thorac Oncol 2009,
 * Table 1, IASLC definitions) via automated, AI-assisted text extraction on 2026-10-10.
 *
 * Modality access (`accessibleBy`) is DRAFT-UNVERIFIED: the endosonography guidelines in the
 * source registry could not be accessed. Values are placeholders for a reviewer to confirm.
 *
 * Procedural fields (typicalAirwayApproach, ultrasoundLandmarks, samplingNotes) are intentionally
 * empty and are only ever displayed once clinician-reviewed (see lib/content/display.ts).
 */

const DATE = "2026-10-10";
const AI_CHECK = "AI-assisted source check against IASLC map text (not a human reviewer)";
const BOUNDARY_NOTE =
  "Boundary text was extracted automatically from a table that also contains Naruke and MD-ATS columns. A human reviewer must confirm each phrase comes from the IASLC column. Boundaries are defined on imaging and at surgery; individual anatomy varies.";

function draftAccess(a: Omit<StationAccess, "meta" | "otherApproaches"> & { otherApproaches?: string[] }): StationAccess {
  return {
    otherApproaches: [],
    ...a,
    meta: {
      sourceRefs: ["ers-esge-ests-2026", "ebus-tbna-guideline-pmc10401980"],
      reviewStatus: "draft-unverified",
      lastReviewedDate: DATE,
      reviewerRole: "Not yet reviewed",
      uncertaintyNotes:
        "Drafted placeholder. Not verified: the cited endosonography guidelines could not be accessed by this project. Access also depends on node size, patient anatomy, equipment and operator experience.",
    },
  };
}

type StationInput = Omit<
  LymphNodeStation,
  "typicalAirwayApproach" | "ultrasoundLandmarks" | "samplingNotes" | "sourceRefs" | "reviewStatus" | "lastReviewedDate" | "reviewerRole" | "uncertaintyNotes" | "otherBoundaryNotes" | "medialBoundary" | "lateralBoundary"
> &
  Partial<Pick<LymphNodeStation, "otherBoundaryNotes" | "medialBoundary" | "lateralBoundary" | "uncertaintyNotes">>;

function st(s: StationInput): LymphNodeStation {
  return {
    medialBoundary: null,
    lateralBoundary: null,
    otherBoundaryNotes: null,
    typicalAirwayApproach: UNAVAILABLE,
    ultrasoundLandmarks: UNAVAILABLE,
    samplingNotes: UNAVAILABLE,
    sourceRefs: ["iaslc-map-2009"],
    reviewStatus: "source-verified",
    lastReviewedDate: DATE,
    reviewerRole: AI_CHECK,
    uncertaintyNotes: BOUNDARY_NOTE,
    ...s,
  };
}

export const STATIONS: LymphNodeStation[] = [
  st({
    stationCode: "1R",
    stationName: "Low cervical, supraclavicular and sternal notch nodes (right)",
    zone: "supraclavicular",
    laterality: "right",
    superiorBoundary: "Lower margin of cricoid cartilage.",
    inferiorBoundary: "Clavicles bilaterally and, in the midline, the upper border of the manubrium.",
    medialBoundary: "The midline of the trachea serves as the border between 1R and 1L.",
    relationshipToAirway: "Right of the tracheal midline.",
    relationshipToVessels: null,
    accessibleBy: draftAccess({ ebusTbna: "unknown", eusBFna: "unknown", notes: "Not yet sourced." }),
    commonConfusions: ["1R versus 1L is decided by the midline of the trachea, not by the left lateral tracheal border used for stations 2 and 4."],
  }),
  st({
    stationCode: "1L",
    stationName: "Low cervical, supraclavicular and sternal notch nodes (left)",
    zone: "supraclavicular",
    laterality: "left",
    superiorBoundary: "Lower margin of cricoid cartilage.",
    inferiorBoundary: "Clavicles bilaterally and, in the midline, the upper border of the manubrium.",
    medialBoundary: "The midline of the trachea serves as the border between 1R and 1L.",
    relationshipToAirway: "Left of the tracheal midline.",
    relationshipToVessels: null,
    accessibleBy: draftAccess({ ebusTbna: "unknown", eusBFna: "unknown", notes: "Not yet sourced." }),
    commonConfusions: ["1R versus 1L is decided by the midline of the trachea, not by the left lateral tracheal border used for stations 2 and 4."],
  }),
  st({
    stationCode: "2R",
    stationName: "Upper paratracheal nodes (right)",
    zone: "upper",
    laterality: "right",
    superiorBoundary: "Apex of the right lung and pleural space, and in the midline, the upper border of the manubrium.",
    inferiorBoundary: "Intersection of the caudal margin of the innominate vein with the trachea.",
    medialBoundary: "2R includes nodes extending to the left lateral border of the trachea.",
    relationshipToAirway: "Paratracheal; extends to the left lateral border of the trachea.",
    relationshipToVessels: "Lower border defined by the caudal margin of the innominate (left brachiocephalic) vein where it crosses the trachea.",
    accessibleBy: draftAccess({ ebusTbna: "conventional", eusBFna: "unknown", notes: "Draft placeholder pending guideline review." }),
    commonConfusions: [
      "The right/left border for stations 2 and 4 is the left lateral border of the trachea, so nodes anterior to the trachea in the midline are right-sided (2R or 4R).",
      "2R versus 4R: the dividing line is the caudal margin of the innominate vein where it crosses the trachea.",
    ],
  }),
  st({
    stationCode: "2L",
    stationName: "Upper paratracheal nodes (left)",
    zone: "upper",
    laterality: "left",
    superiorBoundary: "Apex of the left lung and pleural space, and in the midline, the upper border of the manubrium.",
    inferiorBoundary: "Superior border of the aortic arch.",
    medialBoundary: "Nodes to the left of the left lateral border of the trachea.",
    relationshipToAirway: "Left of the left lateral border of the trachea.",
    relationshipToVessels: "Lower border is the superior border of the aortic arch.",
    accessibleBy: draftAccess({ ebusTbna: "conventional", eusBFna: "conventional", notes: "Draft placeholder pending guideline review." }),
    commonConfusions: ["2L versus 4L: the dividing line is the superior border of the aortic arch."],
  }),
  st({
    stationCode: "3a",
    stationName: "Prevascular nodes",
    zone: "upper",
    laterality: "midline",
    superiorBoundary: "Apex of chest.",
    inferiorBoundary: "Level of carina.",
    otherBoundaryNotes:
      "Anterior border: posterior aspect of sternum. On the right, posterior border: anterior border of superior vena cava. On the left, posterior border: left carotid artery.",
    relationshipToAirway: null,
    relationshipToVessels: "Anterior to the superior vena cava (right) and the left carotid artery (left).",
    accessibleBy: draftAccess({ ebusTbna: "not-conventional", eusBFna: "not-conventional", notes: "Draft placeholder pending guideline review." }),
    commonConfusions: ["3a nodes lie anterior to the superior vena cava (right) or the left carotid artery (left); paratracheal stations 2 and 4 are defined relative to the trachea."],
  }),
  st({
    stationCode: "3p",
    stationName: "Retrotracheal nodes",
    zone: "upper",
    laterality: "midline",
    superiorBoundary: "Apex of chest.",
    inferiorBoundary: "Carina.",
    relationshipToAirway: "Posterior to the trachea.",
    relationshipToVessels: null,
    accessibleBy: draftAccess({ ebusTbna: "unknown", eusBFna: "variable", notes: "Draft placeholder pending guideline review." }),
    commonConfusions: ["3p is behind the trachea; paratracheal nodes (2, 4) are beside it."],
  }),
  st({
    stationCode: "4R",
    stationName: "Lower paratracheal nodes (right)",
    zone: "upper",
    laterality: "right",
    superiorBoundary: "Intersection of the caudal margin of the innominate vein with the trachea.",
    inferiorBoundary: "Lower border of the azygos vein.",
    medialBoundary: "Includes right paratracheal nodes and pretracheal nodes extending to the left lateral border of the trachea.",
    relationshipToAirway: "Right paratracheal and pretracheal, to the left lateral border of the trachea.",
    relationshipToVessels: "Upper border: caudal margin of the innominate vein. Lower border: lower border of the azygos vein.",
    accessibleBy: draftAccess({ ebusTbna: "conventional", eusBFna: "variable", notes: "Draft placeholder pending guideline review." }),
    commonConfusions: [
      "Pretracheal nodes up to the left lateral border of the trachea are 4R, not 4L.",
      "4R versus 10R: 4R ends at the lower border of the azygos vein; 10R begins at the lower rim of the azygos vein.",
    ],
  }),
  st({
    stationCode: "4L",
    stationName: "Lower paratracheal nodes (left)",
    zone: "upper",
    laterality: "left",
    superiorBoundary: "Upper margin of the aortic arch.",
    inferiorBoundary: "Upper rim of the left main pulmonary artery.",
    medialBoundary: "Nodes to the left of the left lateral border of the trachea.",
    lateralBoundary: "Medial to the ligamentum arteriosum.",
    relationshipToAirway: "Left of the left lateral border of the trachea.",
    relationshipToVessels: "Medial to the ligamentum arteriosum; between the aortic arch and the left main pulmonary artery.",
    accessibleBy: draftAccess({ ebusTbna: "conventional", eusBFna: "conventional", notes: "Draft placeholder pending guideline review." }),
    commonConfusions: ["4L versus 5: the ligamentum arteriosum separates 4L (medial) from 5 (lateral)."],
  }),
  st({
    stationCode: "5",
    stationName: "Subaortic (aortopulmonary window) nodes",
    zone: "aortopulmonary",
    laterality: "left",
    superiorBoundary: "The lower border of the aortic arch.",
    inferiorBoundary: "Upper rim of the left main pulmonary artery.",
    medialBoundary: "Lateral to the ligamentum arteriosum.",
    relationshipToAirway: null,
    relationshipToVessels: "Lateral to the ligamentum arteriosum, below the aortic arch and above the left main pulmonary artery.",
    accessibleBy: draftAccess({ ebusTbna: "not-conventional", eusBFna: "variable", notes: "Draft placeholder pending guideline review." }),
    commonConfusions: ["Station 5 is lateral to the ligamentum arteriosum; 4L is medial to it."],
    uncertaintyNotes: `${BOUNDARY_NOTE} Laterality 'left' reflects the position relative to the aortic arch; confirm with the source.`,
  }),
  st({
    stationCode: "6",
    stationName: "Para-aortic nodes (ascending aorta or phrenic)",
    zone: "aortopulmonary",
    laterality: "left",
    superiorBoundary: "A line tangential to the upper border of the aortic arch.",
    inferiorBoundary: "The lower border of the aortic arch.",
    relationshipToAirway: null,
    relationshipToVessels: "Anterior and lateral to the ascending aorta and aortic arch.",
    accessibleBy: draftAccess({ ebusTbna: "not-conventional", eusBFna: "not-conventional", notes: "Draft placeholder pending guideline review." }),
    commonConfusions: ["Station 6 is anterolateral to the aorta; station 5 lies below the arch, lateral to the ligamentum arteriosum."],
    uncertaintyNotes: `${BOUNDARY_NOTE} Laterality 'left' reflects the position relative to the aortic arch; confirm with the source.`,
  }),
  st({
    stationCode: "7",
    stationName: "Subcarinal nodes",
    zone: "subcarinal",
    laterality: "midline",
    superiorBoundary: "The carina of the trachea.",
    inferiorBoundary: "The upper border of the lower lobe bronchus on the left; the lower border of the bronchus intermedius on the right.",
    relationshipToAirway: "Below the carina.",
    relationshipToVessels: null,
    accessibleBy: draftAccess({ ebusTbna: "conventional", eusBFna: "conventional", notes: "Draft placeholder pending guideline review." }),
    commonConfusions: ["Station 7 is a single subcarinal group; it is not divided into right and left."],
  }),
  st({
    stationCode: "8",
    stationName: "Paraesophageal nodes (below carina)",
    zone: "lower",
    laterality: "bilateral",
    superiorBoundary: "The upper border of the lower lobe bronchus on the left; the lower border of the bronchus intermedius on the right.",
    inferiorBoundary: "The diaphragm.",
    relationshipToAirway: "Below the level of station 7's lower border.",
    relationshipToVessels: null,
    accessibleBy: draftAccess({ ebusTbna: "not-conventional", eusBFna: "conventional", notes: "Draft placeholder pending guideline review." }),
    commonConfusions: ["Station 8 begins where station 7 ends (lower border of the bronchus intermedius on the right, upper border of the lower lobe bronchus on the left)."],
    uncertaintyNotes: `${BOUNDARY_NOTE} Right and left station 8 are not modeled separately in this MVP.`,
  }),
  st({
    stationCode: "9",
    stationName: "Pulmonary ligament nodes",
    zone: "lower",
    laterality: "bilateral",
    superiorBoundary: "The inferior pulmonary vein.",
    inferiorBoundary: "The diaphragm.",
    relationshipToAirway: null,
    relationshipToVessels: "Upper border is the inferior pulmonary vein.",
    accessibleBy: draftAccess({ ebusTbna: "not-conventional", eusBFna: "conventional", notes: "Draft placeholder pending guideline review." }),
    commonConfusions: ["Station 9 lies within the pulmonary ligament, below the inferior pulmonary vein."],
    uncertaintyNotes: `${BOUNDARY_NOTE} Right and left station 9 are not modeled separately in this MVP.`,
  }),
  st({
    stationCode: "10R",
    stationName: "Hilar nodes (right)",
    zone: "hilar-interlobar",
    laterality: "right",
    superiorBoundary: "The lower rim of the azygos vein on the right.",
    inferiorBoundary: "Interlobar region.",
    relationshipToAirway: "Includes nodes immediately adjacent to the mainstem bronchus and hilar vessels.",
    relationshipToVessels: "Upper border is the lower rim of the azygos vein.",
    accessibleBy: draftAccess({ ebusTbna: "conventional", eusBFna: "unknown", notes: "Draft placeholder pending guideline review." }),
    commonConfusions: ["10R begins at the lower rim of the azygos vein, where 4R ends."],
  }),
  st({
    stationCode: "10L",
    stationName: "Hilar nodes (left)",
    zone: "hilar-interlobar",
    laterality: "left",
    superiorBoundary: "Upper rim of the pulmonary artery on the left.",
    inferiorBoundary: "Interlobar region.",
    relationshipToAirway: "Includes nodes immediately adjacent to the mainstem bronchus and hilar vessels.",
    relationshipToVessels: "Upper border is the upper rim of the pulmonary artery.",
    accessibleBy: draftAccess({ ebusTbna: "conventional", eusBFna: "unknown", notes: "Draft placeholder pending guideline review." }),
    commonConfusions: ["10L begins at the upper rim of the pulmonary artery, where 4L ends."],
  }),
  st({
    stationCode: "11R",
    stationName: "Interlobar nodes (right)",
    zone: "hilar-interlobar",
    laterality: "right",
    superiorBoundary: null,
    inferiorBoundary: null,
    otherBoundaryNotes:
      "Between the origin of the lobar bronchi. Optional subcategories on the right: 11s, between the upper lobe bronchus and bronchus intermedius; 11i, between the middle and lower lobe bronchi.",
    relationshipToAirway: "Between the origins of the lobar bronchi.",
    relationshipToVessels: null,
    accessibleBy: draftAccess({ ebusTbna: "conventional", eusBFna: "not-conventional", notes: "Draft placeholder pending guideline review." }),
    commonConfusions: ["11s and 11i are optional right-sided subcategories."],
  }),
  st({
    stationCode: "11L",
    stationName: "Interlobar nodes (left)",
    zone: "hilar-interlobar",
    laterality: "left",
    superiorBoundary: null,
    inferiorBoundary: null,
    otherBoundaryNotes: "Between the origin of the lobar bronchi.",
    relationshipToAirway: "Between the origins of the lobar bronchi.",
    relationshipToVessels: null,
    accessibleBy: draftAccess({ ebusTbna: "conventional", eusBFna: "not-conventional", notes: "Draft placeholder pending guideline review." }),
    commonConfusions: [],
  }),
  st({
    stationCode: "12",
    stationName: "Lobar nodes",
    zone: "peripheral",
    laterality: "bilateral",
    superiorBoundary: null,
    inferiorBoundary: null,
    otherBoundaryNotes: "Adjacent to the lobar bronchi. Subgroups 12u, 12m and 12l.",
    relationshipToAirway: "Adjacent to the lobar bronchi.",
    relationshipToVessels: null,
    accessibleBy: draftAccess({ ebusTbna: "variable", eusBFna: "not-conventional", notes: "Draft placeholder pending guideline review." }),
    commonConfusions: [],
    uncertaintyNotes: `${BOUNDARY_NOTE} The source table for stations 12–14 was partly flattened in extraction.`,
  }),
  st({
    stationCode: "13",
    stationName: "Segmental nodes",
    zone: "peripheral",
    laterality: "bilateral",
    superiorBoundary: null,
    inferiorBoundary: null,
    otherBoundaryNotes: "Adjacent to the segmental bronchi.",
    relationshipToAirway: "Adjacent to the segmental bronchi.",
    relationshipToVessels: null,
    accessibleBy: draftAccess({ ebusTbna: "unknown", eusBFna: "not-conventional", notes: "Draft placeholder pending guideline review." }),
    commonConfusions: [],
    uncertaintyNotes: `${BOUNDARY_NOTE} The source table for stations 12–14 was partly flattened in extraction.`,
  }),
  st({
    stationCode: "14",
    stationName: "Subsegmental nodes",
    zone: "peripheral",
    laterality: "bilateral",
    superiorBoundary: null,
    inferiorBoundary: null,
    otherBoundaryNotes: "Adjacent to the subsegmental bronchi.",
    relationshipToAirway: "Adjacent to the subsegmental bronchi.",
    relationshipToVessels: null,
    accessibleBy: draftAccess({ ebusTbna: "unknown", eusBFna: "not-conventional", notes: "Draft placeholder pending guideline review." }),
    commonConfusions: [],
    uncertaintyNotes: `${BOUNDARY_NOTE} The source table for stations 12–14 was partly flattened in extraction.`,
  }),
];

export function getStation(code: string): LymphNodeStation | undefined {
  return STATIONS.find((s) => s.stationCode === code);
}
