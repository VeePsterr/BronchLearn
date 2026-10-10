/**
 * Site-wide configuration. Rename the site by changing `name` here only.
 */
export const siteConfig = {
  name: "BronchLearn",
  tagline: "Learn the airway one branch at a time",
  description:
    "An education-only website for learning tracheobronchial anatomy, bronchoscopic orientation and IASLC lymph-node stations.",
  /** Bump when any file under /content changes. Shown on the About page. */
  contentVersion: "0.1.0-draft",
  contentDate: "2026-10-10",
  notice: "For education only. Not for patient-specific decision-making or unsupervised procedural use.",
  /**
   * Where learners report an anatomy error. Replace with your repository's issue form or a
   * monitored address before deployment. No personal data is collected by the site itself.
   */
  feedbackUrl: "https://github.com/YOUR-ORG/bronchlearn/issues/new?template=anatomy-error.md",
  /** Storage key prefix for anonymous local progress. */
  storagePrefix: "bronchlearn",
} as const;

export type SiteConfig = typeof siteConfig;
