import { z } from "zod";
import { reviewMetaSchema } from "./common";

export const airwayKindSchema = z.enum([
  "trachea",
  "carina",
  "main-bronchus",
  "intermediate-bronchus",
  "lobar-bronchus",
  "division-bronchus",
  "segmental-bronchus",
]);
export type AirwayKind = z.infer<typeof airwayKindSchema>;

export const sideSchema = z.enum(["right", "left", "midline"]);
export type Side = z.infer<typeof sideSchema>;

export const lobeSchema = z.enum(["RUL", "RML", "RLL", "LUL", "LLL"]);
export type Lobe = z.infer<typeof lobeSchema>;

/** standard = primary listed term; common = widely used clinical term; variant = recognized alternative pattern. */
export const anatomyClassSchema = z.enum(["standard", "common", "variant"]);
export type AnatomyClass = z.infer<typeof anatomyClassSchema>;

export const airwayStructureSchema = z
  .object({
    id: z.string().regex(/^[A-Za-z0-9+-]+$/),
    /** Bronchoscopic code without spaces, e.g. RB1, LB1+2. null for unnumbered structures. */
    code: z
      .string()
      .regex(/^(RB|LB)\d+(\+\d+)?$/, "Codes look like RB1 or LB7+8 with no spaces")
      .nullable(),
    name: z.string().min(1),
    latinName: z.string().optional(),
    /** FIPAT Terminologia Anatomica 2 identifier when known. */
    ta2Id: z.number().int().optional(),
    kind: airwayKindSchema,
    side: sideSchema,
    lobe: lobeSchema.nullable(),
    /** Sub-lobar region, e.g. "Upper division" or "Lingula". */
    region: z.string().optional(),
    parentId: z.string().nullable(),
    aliases: z.array(z.string()),
    variantNotes: z.array(z.string()),
    anatomyClass: anatomyClassSchema,
    /**
     * Branching patterns this structure belongs to. Structures with no patterns appear in every view.
     * Left lower lobe: "LLL-separate-7-8" (LB7 and LB8 listed separately) vs "LLL-combined-7+8" (LB7+8).
     */
    patterns: z.array(z.string()).default([]),
    /** Codes that a learner may give as an accepted equivalent (e.g. LB7+8 for LB7). */
    acceptedEquivalents: z.array(z.string()).default([]),
    shortDescription: z.string(),
    meta: reviewMetaSchema,
  })
  .refine((a) => (a.kind === "trachea" ? a.parentId === null : a.parentId !== null), {
    message: "Only the trachea may have no parent",
  })
  .refine((a) => (a.kind === "segmental-bronchus" ? a.code !== null && a.lobe !== null : true), {
    message: "Segmental bronchi need a code and lobe",
  });
export type AirwayStructure = z.infer<typeof airwayStructureSchema>;
