import type { GlossaryTerm, ReviewMeta } from "@/lib/contentSchemas";

const DATE = "2026-10-10";
const ta2: ReviewMeta = {
  sourceRefs: ["fipat-ta2"],
  reviewStatus: "source-verified",
  lastReviewedDate: DATE,
  reviewerRole: "AI-assisted source check against FIPAT TA2 text (not a human reviewer)",
  uncertaintyNotes: "",
};
const iaslc: ReviewMeta = {
  sourceRefs: ["iaslc-map-2009"],
  reviewStatus: "source-verified",
  lastReviewedDate: DATE,
  reviewerRole: "AI-assisted source check against IASLC map text (not a human reviewer)",
  uncertaintyNotes: "",
};
const draft = (refs: string[], note: string): ReviewMeta => ({
  sourceRefs: refs,
  reviewStatus: "draft-unverified",
  lastReviewedDate: DATE,
  reviewerRole: "Not yet reviewed",
  uncertaintyNotes: note,
});

export const GLOSSARY: GlossaryTerm[] = [
  { id: "carina", term: "Carina of trachea", aliases: ["Main carina", "Tracheal carina"], definition: "The ridge at the tracheal bifurcation separating the openings of the right and left main bronchi (TA2 3225).", seeAlso: ["tracheal-bifurcation"], meta: ta2 },
  { id: "tracheal-bifurcation", term: "Tracheal bifurcation", aliases: ["Bifurcatio tracheae"], definition: "The division of the trachea into the right and left main bronchi (TA2 3224).", seeAlso: ["carina"], meta: ta2 },
  { id: "intermediate-bronchus", term: "Intermediate bronchus", aliases: ["Bronchus intermedius", "BI", "Hyparterial bronchus"], definition: "The part of the right bronchial tree between the origin of the right superior lobar bronchus and the origins of the middle and right inferior lobar bronchi (TA2 3242).", seeAlso: [], meta: ta2 },
  { id: "lobar-bronchus", term: "Lobar bronchus", aliases: ["Lobe bronchus"], definition: "A bronchus supplying one lobe of the lung, for example the right superior lobar bronchus or the left inferior lobar bronchus.", seeAlso: ["segmental-bronchus"], meta: ta2 },
  { id: "segmental-bronchus", term: "Segmental bronchus", aliases: ["B1–B10", "RB1", "LB1+2"], definition: "A bronchus supplying one bronchopulmonary segment. TA2 numbers them B1–B10 on each side, with combined left-sided entries B1+2 and (in parentheses) B7+8. This site prefixes R or L, e.g. RB1, LB1+2.", seeAlso: ["anatomical-variant"], meta: ta2 },
  { id: "lingula", term: "Lingula", aliases: ["Lingular segments"], definition: "The part of the left upper lobe supplied by the superior (LB4) and inferior (LB5) lingular segmental bronchi.", seeAlso: [], meta: draft(["fipat-ta2"], "Segmental bronchus names are from TA2; 'lingular bronchus' as a grouping term was not found in the retrieved TA2 text.") },
  { id: "anatomical-variant", term: "Anatomical / nomenclature variant", aliases: ["Variant pattern"], definition: "A recognized alternative branching pattern or naming convention, such as the left anteromedial basal bronchus (LB7+8) in place of separate LB7 and LB8. On this site variants are taught explicitly and are never marked as learner errors.", seeAlso: ["segmental-bronchus"], meta: ta2 },
  { id: "iaslc-map", term: "IASLC lymph node map", aliases: ["IASLC map"], definition: "The International Association for the Study of Lung Cancer map that defines thoracic lymph-node stations and their anatomical boundaries for lung cancer staging.", seeAlso: ["station-identification"], meta: iaslc },
  { id: "ligamentum-arteriosum", term: "Ligamentum arteriosum", aliases: [], definition: "In the IASLC map, the landmark that separates station 4L (medial) from station 5 (lateral).", seeAlso: ["iaslc-map"], meta: iaslc },
  { id: "station-identification", term: "Station identification", aliases: [], definition: "Naming which IASLC station a node belongs to using anatomical boundaries. It is a separate question from whether a modality can reach it (procedural access) and from where a particular patient should be sampled.", seeAlso: ["procedural-access"], meta: iaslc },
  { id: "procedural-access", term: "Procedural access", aliases: ["Modality access"], definition: "Whether a station is conventionally reached by a given technique such as EBUS-TBNA or EUS-B-FNA. On this site access data are draft-unverified.", seeAlso: ["station-identification", "ebus-tbna", "eus-b-fna"], meta: draft(["ers-esge-ests-2026"], "Access definitions pending review against the endosonography guideline, which could not be accessed.") },
  { id: "ebus-tbna", term: "EBUS-TBNA", aliases: ["Endobronchial ultrasound-guided transbronchial needle aspiration", "Linear/convex-probe EBUS"], definition: "Sampling through the airway wall under real-time ultrasound guidance using a bronchoscope with a convex (linear) ultrasound probe.", seeAlso: ["eus-b-fna"], meta: draft(["ers-esge-ests-2026", "ebus-tbna-guideline-pmc10401980"], "Definition not yet checked against the guidelines, which could not be accessed.") },
  { id: "eus-b-fna", term: "EUS-B-FNA", aliases: ["Endoscopic ultrasound with bronchoscope-guided fine-needle aspiration"], definition: "Sampling through the oesophageal wall using the EBUS bronchoscope placed in the oesophagus.", seeAlso: ["ebus-tbna"], meta: draft(["ers-esge-ests-2026"], "Definition not yet checked against the guideline, which could not be accessed.") },
  { id: "n-category", term: "N category", aliases: ["N1", "N2", "N3"], definition: "The TNM descriptor for regional lymph-node involvement. A station has no fixed N category: it depends on the side and location of the primary tumour.", seeAlso: ["iaslc-map"], meta: draft(["tnm-n-descriptors"], "TNM text not retrieved; edition to be confirmed.") },
  { id: "simulated-learning-view", term: "Simulated learning view", aliases: [], definition: "This site's schematic stand-in for a bronchoscopic image. It shows which branches arise at a point, not their true position, size or orientation.", seeAlso: [], meta: { ...ta2, uncertaintyNotes: "Describes this website's own illustration; branch content follows TA2." } },
];
