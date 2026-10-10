import { z } from "zod";
import { reviewMetaSchema } from "./common";

/**
 * On-screen arrangement of branch openings in the simulated bronchoscopic view at one airway.
 * Coordinates are normalised to the view: x and y from -1 (left/top) to 1 (right/bottom).
 */
export const viewOpeningSchema = z.object({
  childId: z.string(),
  x: z.number().min(-1).max(1),
  y: z.number().min(-1).max(1),
  /** Relative size, 0.08–0.6 of the view radius. */
  r: z.number().min(0.08).max(0.6),
});

export const bronchoscopicViewSchema = z.object({
  airwayId: z.string(),
  openings: z.array(viewOpeningSchema).min(1),
  /** Carina to label between the openings, if any. */
  carinaId: z.string().nullable(),
  meta: reviewMetaSchema,
});
export type BronchoscopicViewLayout = z.infer<typeof bronchoscopicViewSchema>;
