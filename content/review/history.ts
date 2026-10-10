/** Content-review history shown on the About page. Append a row for every review. */
export const REVIEW_HISTORY = [
  {
    date: "2026-10-10",
    version: "0.1.0-draft",
    reviewer: "AI-assisted build (not a human reviewer)",
    scope: "Initial dataset. Airway terminology and IASLC boundary wording compared with source text via automated extraction; access and N-category data drafted and marked draft-unverified; no procedural content authored.",
  },
  {
    date: "2026-10-10",
    version: "0.2.0-draft",
    reviewer: "AI-assisted build (not a human reviewer)",
    scope: "Added secondary carina labels (RC1 and RC2 checked against the Jaypee chapter text; LC1 and LC2 draft because the chapter is inconsistent). Added draft on-screen layouts for the simulated bronchoscopic views, shown with the patient's left on the screen left, informed by an owner-supplied manufacturer poster. Views are original computer-generated renderings.",
  },
] as const;
