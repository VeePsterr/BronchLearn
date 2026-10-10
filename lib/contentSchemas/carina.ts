import { z } from "zod";
import { reviewMetaSchema } from "./common";

/** A carina: the ridge where one airway divides into two or more branches. */
export const carinaSchema = z.object({
  id: z.string().regex(/^[A-Za-z0-9-]+$/),
  /** Short label shown on screen, e.g. "RC1". */
  label: z.string().min(1),
  name: z.string().min(1),
  aliases: z.array(z.string()),
  /** The airway whose division this carina marks (the view in which it is seen). */
  atAirwayId: z.string(),
  /** The two branches the carina separates. */
  separates: z.tuple([z.string(), z.string()]),
  description: z.string(),
  meta: reviewMetaSchema,
});
export type Carina = z.infer<typeof carinaSchema>;
