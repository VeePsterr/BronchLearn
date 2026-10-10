import { z } from "zod";
import { reviewMetaSchema } from "./common";
import { tumourSideSchema } from "./staging";

export const QUESTION_TYPES = [
  "code-to-name",
  "name-to-code",
  "next-branch",
  "navigate-to-segment",
  "station-from-landmarks",
  "modality-access",
  "n-category",
  "variant-recognition",
] as const;
export const questionTypeSchema = z.enum(QUESTION_TYPES);
export type QuestionType = z.infer<typeof questionTypeSchema>;

export const quizOptionSchema = z.object({ id: z.string(), label: z.string() });

export const quizQuestionSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9-]+$/),
    type: questionTypeSchema,
    prompt: z.string(),
    options: z.array(quizOptionSchema).min(2),
    /** More than one id means several answers are accepted (e.g. nomenclature variants). */
    acceptedOptionIds: z.array(z.string()).min(1),
    explanation: z.string(),
    /** Extra note shown when a variant-equivalent answer was chosen. */
    variantNote: z.string().optional(),
    airwayRefs: z.array(z.string()).default([]),
    stationRefs: z.array(z.string()).default([]),
    tumourContext: z.object({ side: tumourSideSchema, description: z.string() }).optional(),
    /** For navigate-to-segment questions: the target airway id and the accepted end points. */
    navigation: z.object({ targetId: z.string(), acceptedEndIds: z.array(z.string()).min(1) }).optional(),
    meta: reviewMetaSchema,
  })
  .refine((q) => q.acceptedOptionIds.every((id) => q.options.some((o) => o.id === id)), {
    message: "acceptedOptionIds must refer to options",
  })
  .refine((q) => q.type !== "n-category" || q.tumourContext !== undefined, {
    message: "N-category questions require primary-tumour context",
  })
  .refine((q) => q.type !== "navigate-to-segment" || q.navigation !== undefined, {
    message: "Navigation questions require a navigation target",
  });
export type QuizQuestion = z.infer<typeof quizQuestionSchema>;
