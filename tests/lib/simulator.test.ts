import { describe, expect, it } from "vitest";
import { advance, back, getChoices, initialState, isOnRoute, quizTargets } from "@/lib/navigation/simulator";

function walk(target: string | null, steps: string[], mode: "standard" | "variants" = "standard") {
  let s = initialState(mode, target);
  const feedback = [];
  for (const id of steps) {
    const r = advance(s, id);
    s = r.state;
    feedback.push(r.feedback);
  }
  return { s, feedback };
}

describe("navigation simulator", () => {
  it("starts at the trachea with a single forward move to the carina", () => {
    const choices = getChoices(initialState());
    expect(choices).toEqual([expect.objectContaining({ id: "carina", direction: "forward" })]);
  });

  it("offers explicit right and left branches at the carina", () => {
    const { s } = walk(null, ["carina"]);
    const dirs = getChoices(s).map((c) => c.direction).sort();
    expect(dirs).toEqual(["left-branch", "right-branch"]);
    expect(getChoices(s).find((c) => c.direction === "right-branch")?.id).toBe("rmb");
  });

  it.each([
    ["RB1", ["carina", "rmb", "rul", "RB1"]],
    ["RB5", ["carina", "rmb", "bi", "rml", "RB5"]],
    ["RB10", ["carina", "rmb", "bi", "rll", "RB10"]],
    ["LB1+2", ["carina", "lmb", "lul", "lul-upper-division", "LB1+2"]],
    ["LB4", ["carina", "lmb", "lul", "lingular", "LB4"]],
    ["LB9", ["carina", "lmb", "lll", "LB9"]],
  ])("navigates from the trachea to %s", (target, steps) => {
    const { s, feedback } = walk(target, steps);
    expect(s.completed).toBe(true);
    expect(s.wrongTurns).toBe(0);
    expect(feedback.at(-1)?.kind).toBe("arrived");
  });

  it("flags a wrong turn with an explanation and lets the learner go back", () => {
    let { s, feedback } = walk("RB6", ["carina", "lmb"]);
    expect(feedback.at(-1)?.kind).toBe("incorrect");
    expect(feedback.at(-1)?.message).toMatch(/Right main bronchus/);
    expect(s.wrongTurns).toBe(1);
    s = back(s);
    expect(s.currentId).toBe("carina");
  });

  it("accepts LB7+8 as reaching LB8 in the variant pattern (not a learner error)", () => {
    const { s, feedback } = walk("LB8", ["carina", "lmb", "lll", "LB7+8"], "variants");
    expect(s.completed).toBe(true);
    expect(s.wrongTurns).toBe(0);
    expect(feedback.at(-1)?.kind).toBe("arrived-variant");
  });

  it("treats the LLL bronchus as on-route for LB7 via either pattern", () => {
    expect(isOnRoute("lll", "LB7")).toBe(true);
    expect(isOnRoute("LB7+8", "LB7")).toBe(true);
    expect(isOnRoute("LB9", "LB7")).toBe(false);
  });

  it("quiz targets cover all segments visible in a pattern", () => {
    expect(quizTargets("standard")).toHaveLength(19);
    expect(quizTargets("variants")).toContain("LB7+8");
  });
});
