import { z } from "zod";
import { reviewMetaSchema } from "./common";

export const tumourSideSchema = z.enum(["right", "left"]);
export type TumourSide = z.infer<typeof tumourSideSchema>;

export const nCategorySchema = z.enum(["N1", "N2", "N3"]);
export type NCategory = z.infer<typeof nCategorySchema>;

/**
 * Maps one station to an N category for each hypothetical primary-tumour side.
 * There is deliberately no "default" category: the UI cannot show one without a tumour side.
 */
export const nodalRuleSchema = z.object({
  stationCode: z.string(),
  byTumourSide: z.object({ right: nCategorySchema, left: nCategorySchema }),
  reasoning: z.object({ right: z.string(), left: z.string() }),
  meta: reviewMetaSchema,
});
export type NodalRule = z.infer<typeof nodalRuleSchema>;
