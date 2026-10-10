import type { ReviewStatus, SensitiveText } from "@/lib/contentSchemas";

/**
 * Display gates. Every component that renders medical content goes through these helpers so
 * that draft content can never be shown as definitive and sensitive procedural text never
 * appears unless clinician-reviewed.
 */

export function isSensitiveDisplayable(s: SensitiveText): boolean {
  return (
    s.text !== null &&
    s.text.trim().length > 0 &&
    s.reviewStatus === "clinician-reviewed" &&
    Boolean(s.reviewerName) &&
    Boolean(s.reviewerRole) &&
    Boolean(s.reviewedDate) &&
    s.sourceRefs.length > 0
  );
}

export function isDraft(status: ReviewStatus): boolean {
  return status === "draft-unverified";
}

export const STATUS_LABEL: Record<ReviewStatus, string> = {
  "draft-unverified": "Draft – unverified",
  "source-verified": "Source-verified",
  "clinician-reviewed": "Clinician-reviewed",
};

export const STATUS_EXPLANATION: Record<ReviewStatus, string> = {
  "draft-unverified":
    "Not yet checked against an authoritative source. Treat as a learning placeholder, not as fact.",
  "source-verified":
    "Wording compared with the cited source text (automated, AI-assisted check). Not yet reviewed by a clinician.",
  "clinician-reviewed": "Reviewed by the named, appropriately qualified clinician.",
};
