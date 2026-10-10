import { z } from "zod";
import { reviewMetaSchema } from "./common";

export const glossaryTermSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  term: z.string(),
  aliases: z.array(z.string()),
  definition: z.string(),
  seeAlso: z.array(z.string()).default([]),
  meta: reviewMetaSchema,
});
export type GlossaryTerm = z.infer<typeof glossaryTermSchema>;
