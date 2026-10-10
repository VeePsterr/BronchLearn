import { z } from "zod";
import { isoDateSchema, reviewMetaSchema, reviewStatusSchema, sensitiveTextSchema } from "./common";

export const zoneIdSchema = z.enum([
  "supraclavicular",
  "upper",
  "aortopulmonary",
  "subcarinal",
  "lower",
  "hilar-interlobar",
  "peripheral",
]);
export type ZoneId = z.infer<typeof zoneIdSchema>;

export const zoneSchema = z.object({
  id: zoneIdSchema,
  name: z.string(),
  stations: z.array(z.string()),
  meta: reviewMetaSchema,
});
export type Zone = z.infer<typeof zoneSchema>;

/**
 * conventional: described as conventionally reached by the modality.
 * not-conventional: not conventionally reached by the modality.
 * variable: reached in some patients or with non-standard technique.
 * unknown: not yet sourced.
 */
export const accessLevelSchema = z.enum(["conventional", "not-conventional", "variable", "unknown"]);
export type AccessLevel = z.infer<typeof accessLevelSchema>;

export const stationAccessSchema = z.object({
  ebusTbna: accessLevelSchema,
  eusBFna: accessLevelSchema,
  otherApproaches: z.array(z.string()),
  notes: z.string(),
  meta: reviewMetaSchema,
});
export type StationAccess = z.infer<typeof stationAccessSchema>;

export const lymphNodeStationSchema = z.object({
  stationCode: z.string().regex(/^\d{1,2}[A-Za-z]*$/),
  stationName: z.string(),
  zone: zoneIdSchema,
  laterality: z.enum(["right", "left", "midline", "bilateral"]),
  superiorBoundary: z.string().nullable(),
  inferiorBoundary: z.string().nullable(),
  medialBoundary: z.string().nullable(),
  lateralBoundary: z.string().nullable(),
  otherBoundaryNotes: z.string().nullable(),
  relationshipToAirway: z.string().nullable(),
  relationshipToVessels: z.string().nullable(),
  accessibleBy: stationAccessSchema,
  typicalAirwayApproach: sensitiveTextSchema,
  ultrasoundLandmarks: sensitiveTextSchema,
  samplingNotes: sensitiveTextSchema,
  commonConfusions: z.array(z.string()),
  /** Anatomy (boundary/relationship) review metadata, flattened as the brief requires. */
  sourceRefs: z.array(z.string().min(1)).min(1, "A station needs at least one source reference"),
  reviewStatus: reviewStatusSchema,
  lastReviewedDate: isoDateSchema,
  reviewerName: z.string().min(1).optional(),
  reviewerRole: z.string().min(1).optional(),
  uncertaintyNotes: z.string(),
}).refine((s) => Boolean(s.reviewerName || s.reviewerRole), { message: "reviewerName or reviewerRole is required" });
export type LymphNodeStation = z.infer<typeof lymphNodeStationSchema>;
