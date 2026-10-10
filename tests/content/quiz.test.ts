import { describe, expect, it } from "vitest";
import { AIRWAYS } from "@/content/airways/airways";
import { SOURCE_IDS } from "@/content/sources/registry";
import { STATIONS } from "@/content/stations/stations";
import { QUESTION_TYPES, quizQuestionSchema } from "@/lib/contentSchemas";
import { filterBank, gradeAnswer, QUESTION_BANK } from "@/lib/quiz/bank";

const airwayIds = new Set(AIRWAYS.map((a) => a.id));
const stationCodes = new Set(STATIONS.map((s) => s.stationCode));

describe("quiz bank", () => {
  it("every question matches the schema", () => {
    for (const q of QUESTION_BANK) {
      const r = quizQuestionSchema.safeParse(q);
      expect(r.success, `${q.id}: ${r.success ? "" : r.error.message}`).toBe(true);
    }
  });

  it("question ids are unique", () => {
    const ids = QUESTION_BANK.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has at least 20 functioning questions with verified content alone", () => {
    expect(filterBank(QUESTION_BANK, { types: "all", includeDraft: false }).length).toBeGreaterThanOrEqual(20);
  });

  it("covers every question type", () => {
    for (const t of QUESTION_TYPES) expect(QUESTION_BANK.some((q) => q.type === t), t).toBe(true);
  });

  it("every airway and station reference exists", () => {
    for (const q of QUESTION_BANK) {
      for (const id of q.airwayRefs) expect(airwayIds.has(id), `${q.id} → airway ${id}`).toBe(true);
      for (const code of q.stationRefs) expect(stationCodes.has(code), `${q.id} → station ${code}`).toBe(true);
      if (q.navigation) {
        expect(airwayIds.has(q.navigation.targetId)).toBe(true);
        for (const e of q.navigation.acceptedEndIds) expect(airwayIds.has(e)).toBe(true);
      }
    }
  });

  it("accepted answers of airway questions refer to real airway structures", () => {
    for (const q of QUESTION_BANK.filter((x) => ["code-to-name", "name-to-code", "next-branch", "navigate-to-segment"].includes(x.type))) {
      for (const id of q.acceptedOptionIds) expect(airwayIds.has(id), `${q.id} → ${id}`).toBe(true);
    }
  });

  it("accepted answers of station questions refer to real stations", () => {
    for (const q of QUESTION_BANK.filter((x) => x.type === "station-from-landmarks")) {
      for (const id of q.acceptedOptionIds) expect(stationCodes.has(id), `${q.id} → ${id}`).toBe(true);
    }
  });

  it("every N-category question has primary-tumour context", () => {
    for (const q of QUESTION_BANK.filter((x) => x.type === "n-category")) {
      expect(q.tumourContext, q.id).toBeDefined();
      expect(q.prompt.toLowerCase()).toContain(q.tumourContext!.side);
    }
  });

  it("schema rejects an N-category question without tumour context", () => {
    const q = QUESTION_BANK.find((x) => x.type === "n-category")!;
    const { tumourContext: _omit, ...rest } = q;
    expect(quizQuestionSchema.safeParse(rest).success).toBe(false);
  });

  it("every cited source exists in the registry", () => {
    for (const q of QUESTION_BANK) for (const r of q.meta.sourceRefs) expect(SOURCE_IDS.has(r), `${q.id} cites ${r}`).toBe(true);
  });

  it("accepts LB7+8 as a correct answer for the medial basal bronchus of the left lung", () => {
    const q = QUESTION_BANK.find((x) => x.id === "name-to-code-lb7")!;
    expect(q.acceptedOptionIds).toEqual(expect.arrayContaining(["LB7", "LB7+8"]));
    expect(gradeAnswer(q, "LB7+8")).toEqual({ correct: true, viaVariant: true });
  });

  it("contains no puncture-site or sampling-technique questions", () => {
    const text = JSON.stringify(QUESTION_BANK).toLowerCase();
    expect(text).not.toMatch(/safest|puncture site|needle entry|clock-face|number of passes/);
  });

  it("questions based on unverified content are marked draft and hidden by default", () => {
    for (const q of QUESTION_BANK.filter((x) => x.type === "modality-access" || x.type === "n-category")) {
      expect(q.meta.reviewStatus).toBe("draft-unverified");
    }
    const visible = filterBank(QUESTION_BANK, { types: "all", includeDraft: false });
    expect(visible.some((q) => q.meta.reviewStatus === "draft-unverified")).toBe(false);
  });
});
