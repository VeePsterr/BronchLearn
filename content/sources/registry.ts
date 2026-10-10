import type { Source } from "@/lib/contentSchemas";

/**
 * Central source registry. Medical content cites sources ONLY by `id` from this list.
 * Access results are from the 2026-10-10 source-access audit (see docs/PLAN.md §2).
 */
export const SOURCES: Source[] = [
  {
    id: "fipat-ta2",
    shortTitle: "FIPAT Terminologia Anatomica, 2nd ed. (Part 3)",
    citation:
      "Federative International Programme for Anatomical Terminology (FIPAT). Terminologia Anatomica, 2nd edition. Part 3. FIPAT.library.dal.ca; 2019.",
    url: "https://cdn.dal.ca/content/dam/dalhousie/pdf/library/FIPAT/TA2/FIPAT-TA2-Part-3.pdf",
    kind: "terminology",
    authoritative: true,
    accessStatus: "partially-accessed",
    accessedDate: "2026-10-10",
    accessNotes:
      "Text of the tracheobronchial tree entries (TA2 IDs 3212, 3237–3264) was extracted with an automated tool. Endnotes 474–479 were not in the extracted text and have not been read.",
    usedFor: ["Bronchial terminology", "Segmental codes"],
  },
  {
    id: "imaios-bronchoscopy",
    shortTitle: "IMAIOS e-Anatomy: Bronchoscopy",
    citation: "IMAIOS. e-Anatomy: Thorax — Bronchoscopy (Terminologia Anatomica-based labels). Accessed 2026-10-10.",
    url: "https://www.imaios.com/en/e-anatomy/thorax/bronchoscopy",
    kind: "anatomy-reference",
    authoritative: true,
    accessStatus: "partially-accessed",
    accessedDate: "2026-10-10",
    accessNotes:
      "Label list read via an automated tool. Images not reused. Lists left B7 and B8 separately and does not mention B7+8. Lists 'Intermediate bronchus' without a code.",
    usedFor: ["Cross-check of bronchial terminology"],
  },
  {
    id: "iaslc-map-2009",
    shortTitle: "IASLC lymph node map (Rusch et al., 2009)",
    citation:
      "Rusch VW, Asamura H, Watanabe H, Giroux DJ, Rami-Porta R, Goldstraw P; Members of IASLC Staging Committee. The IASLC lung cancer staging project: a proposal for a new international lymph node map in the forthcoming seventh edition of the TNM classification for lung cancer. J Thorac Oncol. 2009;4(5):568–577.",
    url: "https://www.jto.org/article/S1556-0864(15)31673-7/fulltext",
    kind: "staging",
    authoritative: true,
    accessStatus: "partially-accessed",
    accessedDate: "2026-10-10",
    accessNotes:
      "Station definition table text read via an automated tool; table was partly flattened for stations 12–14. Figures (including the zone diagram, Figure 3) could not be read. Citation details are from the project's prior knowledge and should be confirmed against the article page.",
    usedFor: ["Station names and boundaries", "AP zone definition"],
  },
  {
    id: "ers-esge-ests-2026",
    shortTitle: "ERS/ESGE/ESTS endosonography guideline (2026)",
    citation:
      "ERS/ESGE/ESTS clinical practice guidelines on endobronchial and oesophageal endosonography for the diagnosis and staging of lung cancer. Eur Respir J. 2026;68(2):2600097.",
    url: "https://publications.ersnet.org/content/erj/68/2/2600097",
    kind: "guideline",
    authoritative: true,
    accessStatus: "not-accessible",
    accessedDate: "2026-10-10",
    accessNotes:
      "Server error on fetch. Title taken from a search-results listing only. No content has been read; nothing on this site is verified against it yet.",
    usedFor: ["Intended source for EBUS-TBNA / EUS-B-FNA station access (pending)"],
  },
  {
    id: "ebus-tbna-guideline-pmc10401980",
    shortTitle: "EBUS-TBNA guideline (PMC10401980)",
    citation: "EBUS-TBNA guideline describing station accessibility and procedural standards. PubMed Central PMC10401980. Full citation not yet retrieved.",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10401980/",
    kind: "guideline",
    authoritative: true,
    accessStatus: "not-accessible",
    accessedDate: "2026-10-10",
    accessNotes: "Blocked by a browser-verification page. Title, authors and content are unknown to this project.",
    usedFor: ["Intended source for station accessibility (pending)"],
  },
  {
    id: "chest-ebus-samples-2024",
    shortTitle: "CHEST guideline: acquisition and handling of EBUS-TBNA samples (2024)",
    citation: "CHEST guideline and expert panel report: Acquisition and Handling of Endobronchial Ultrasound Transbronchial Needle Samples. CHEST. 2024. Full citation not yet retrieved.",
    url: "https://journal.chestnet.org/article/S0012-3692(24)05276-0/fulltext",
    kind: "guideline",
    authoritative: true,
    accessStatus: "not-accessible",
    accessedDate: "2026-10-10",
    accessNotes:
      "Fetch error. Title confirmed from search-results listings only. Specimen handling is out of scope for the MVP and stays hidden until clinician-reviewed.",
    usedFor: ["Reference only; sample handling is intentionally not taught"],
  },
  {
    id: "tnm-n-descriptors",
    shortTitle: "TNM classification of lung cancer: N descriptors",
    citation:
      "UICC/AJCC TNM classification of lung cancer, regional lymph node (N) descriptors, as applied to the IASLC lymph node map. Edition and page to be confirmed by a reviewer (8th or 9th edition).",
    url: "https://www.jto.org/article/S1556-0864(15)31673-7/fulltext",
    kind: "staging",
    authoritative: true,
    accessStatus: "not-accessible",
    accessedDate: "2026-10-10",
    accessNotes:
      "The N descriptor text was not retrieved during the audit. The URL points to the IASLC map paper as a placeholder; a reviewer must replace it with the TNM edition used.",
    usedFor: ["N-category learning mode (draft)"],
  },
  {
    id: "jaypee-bronchoscopy-icu-ch1",
    shortTitle: "Bronchoscopy in ICU, Ch. 1: Bronchoscopic Anatomy of Tracheobronchial Tree (Jaypee)",
    citation:
      "Goel MK, Kumar L, Kant S. Bronchoscopic Anatomy of Tracheobronchial Tree. In: Bronchoscopy in ICU: A Practical Guide, Chapter 1. Jaypee Brothers Medical Publishers. ISBN 9789352704699. Author list to be confirmed against the book (the chapter byline and book listing differ).",
    url: "https://www.jaypeedigital.com/eReader/chapter/9789352704699/ch1",
    kind: "textbook",
    authoritative: true,
    accessStatus: "partially-accessed",
    accessedDate: "2026-10-10",
    accessNotes:
      "Chapter text read via an automated tool on 2026-10-10 (suggested by the project owner). Defines RC1 and RC2. Its text and figure captions disagree about LC1 (text: between upper division and lingula; Fig. 31 caption: between left upper and left lower lobe bronchi). It does not state which side of the screen each main bronchus appears on. Figures were not viewed and nothing is reproduced.",
    usedFor: ["Secondary carina names (RC1, RC2, LC1, LC2)", "Branch order"],
  },
  {
    id: "olympus-videobronchoscopy-poster",
    shortTitle: "Olympus poster: Videobronchoscopy – Nomenclature and Anatomy of the Bronchial Tree (2018)",
    citation:
      "Olympus. Videobronchoscopy: Nomenclature and Anatomy of the Bronchial Tree (poster E0428301, 07/18). Clinical images credited to Prof. Dr. med. Ralf Eberhardt, Thoraxklinik, University of Heidelberg.",
    url: "https://www.olympus-europa.com/",
    kind: "user-supplied-reference",
    authoritative: false,
    accessStatus: "accessed-text",
    accessedDate: "2026-10-10",
    accessNotes:
      "PDF supplied by the project owner and viewed directly. Manufacturer educational material, so it is not treated as authoritative. Used only to inform the approximate on-screen arrangement of openings (for example the left main bronchus on the left of the screen at the main carina) in draft, clinician-review-pending view layouts. No images, drawings, colours or text are copied or traced. URL is the publisher's home page; the poster's own URL is unknown.",
    usedFor: ["Draft on-screen opening arrangement in the simulated bronchoscopic views"],
  },
  {
    id: "ats-intro-bronchoscopy-video",
    shortTitle: "ATS: Introduction to Bronchoscopy – Lecture (video)",
    citation: "American Thoracic Society. Introduction to Bronchoscopy – Lecture. YouTube.",
    url: "https://www.youtube.com/watch?v=w2EeRpbNfUU",
    kind: "teaching-inspiration",
    authoritative: false,
    accessStatus: "not-accessible",
    accessedDate: "2026-10-10",
    accessNotes:
      "Not watched; captions not read. Only the general teaching order suggested by the project owner (trachea → carina → right/left → lobar → segmental) informed the lesson sequence. No footage, narration or diagrams are used.",
    usedFor: ["Lesson sequencing inspiration only"],
  },
  {
    id: "ctsnet-mastering-bronchoscopy-video",
    shortTitle: "CTSNet: Mastering Bronchoscopy for Thoracic Surgery, Chapter 1 (video)",
    citation: "CTSNet. Mastering Bronchoscopy for Thoracic Surgery: Chapter 1. YouTube.",
    url: "https://www.youtube.com/watch?v=24E1MDQE7gI",
    kind: "teaching-inspiration",
    authoritative: false,
    accessStatus: "not-accessible",
    accessedDate: "2026-10-10",
    accessNotes: "Not watched; captions not read. No footage, narration or diagrams are used.",
    usedFor: ["Lesson sequencing inspiration only"],
  },
];

export const SOURCE_IDS = new Set(SOURCES.map((s) => s.id));

export function getSource(id: string): Source | undefined {
  return SOURCES.find((s) => s.id === id);
}
