/**
 * Site-wide configuration. Rename the site by changing `name` here only.
 */
export const siteConfig = {
  name: "BronchRounds",
  tagline: "Learn the airway one branch at a time",
  description:
    "An education-only website for learning tracheobronchial anatomy, bronchoscopic orientation and IASLC lymph-node stations.",
  /** Bump when any file under /content changes. Shown on the About page. */
  contentVersion: "0.2.0-draft",
  contentDate: "2026-10-10",
  notice: "For education only. Not for patient-specific decision-making or unsupervised procedural use.",
  /**
   * Where learners report an anatomy error. Replace with your repository's issue form or a
   * monitored address before deployment. No personal data is collected by the site itself.
   */
  feedbackUrl: "https://github.com/VeePsterr/BronchLearn/issues/new?template=anatomy-error.md",
  /** Storage key prefix for anonymous local progress. */
  storagePrefix: "bronchrounds",
} as const;

export type SiteConfig = typeof siteConfig;
