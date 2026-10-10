import { z } from "zod";

export const REVIEW_STATUSES = ["draft-unverified", "source-verified", "clinician-reviewed"] as const;
export const reviewStatusSchema = z.enum(REVIEW_STATUSES);
export type ReviewStatus = z.infer<typeof reviewStatusSchema>;

export const isoDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD");

/**
 * Review metadata required on every medical content object.
 * At least one of reviewerName / reviewerRole must be present.
 */
export const reviewMetaSchema = z
  .object({
    sourceRefs: z.array(z.string().min(1)).min(1, "Every medical content object needs at least one source"),
    reviewStatus: reviewStatusSchema,
    lastReviewedDate: isoDateSchema,
    reviewerName: z.string().min(1).optional(),
    reviewerRole: z.string().min(1).optional(),
    uncertaintyNotes: z.string(),
  })
  .refine((m) => Boolean(m.reviewerName || m.reviewerRole), {
    message: "reviewerName or reviewerRole is required",
  })
  .refine((m) => m.reviewStatus !== "clinician-reviewed" || Boolean(m.reviewerName), {
    message: "clinician-reviewed content must name the reviewer",
  });
export type ReviewMeta = z.infer<typeof reviewMetaSchema>;

/**
 * Clinically sensitive procedural text (approach, ultrasound landmarks, sampling notes, etc.).
 * It may be stored while in draft, but the UI only renders it when clinician-reviewed with a
 * named reviewer and a review date. See lib/content/display.ts.
 */
export const sensitiveTextSchema = z
  .object({
    text: z.string().nullable(),
    reviewStatus: reviewStatusSchema,
    reviewerName: z.string().min(1).optional(),
    reviewerRole: z.string().min(1).optional(),
    reviewedDate: isoDateSchema.optional(),
    sourceRefs: z.array(z.string()).default([]),
  })
  .refine(
    (s) => s.reviewStatus !== "clinician-reviewed" || Boolean(s.reviewerName && s.reviewedDate && s.reviewerRole),
    { message: "Sensitive text marked clinician-reviewed must include reviewerName, reviewerRole and reviewedDate" },
  )
  .refine((s) => s.reviewStatus !== "clinician-reviewed" || s.sourceRefs.length > 0, {
    message: "Sensitive text marked clinician-reviewed must cite a source",
  });
export type SensitiveText = z.infer<typeof sensitiveTextSchema>;

export const UNAVAILABLE: SensitiveText = {
  text: null,
  reviewStatus: "draft-unverified",
  sourceRefs: [],
};
