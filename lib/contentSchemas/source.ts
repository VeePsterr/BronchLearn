import { z } from "zod";
import { isoDateSchema } from "./common";

export const sourceSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  shortTitle: z.string().min(1),
  citation: z.string().min(1),
  url: z.url(),
  kind: z.enum(["terminology", "anatomy-reference", "textbook", "staging", "guideline", "teaching-inspiration", "user-supplied-reference"]),
  /** Only authoritative sources may be cited by medical content. */
  authoritative: z.boolean(),
  accessStatus: z.enum(["accessed-text", "partially-accessed", "not-accessible"]),
  accessedDate: isoDateSchema,
  accessNotes: z.string(),
  usedFor: z.array(z.string()),
});
export type Source = z.infer<typeof sourceSchema>;
