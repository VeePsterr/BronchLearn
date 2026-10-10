import type { PatternMode } from "@/content/airways/airways";
import type { AirwayStructure } from "@/lib/contentSchemas";
import { getAirway, getChildren, getPath, requireAirway, SEGMENTS } from "./tree";

/**
 * Pure state machine for the 2-D navigation simulator. No anatomical positions are encoded:
 * choices are the named child branches of the current airway.
 */
export type SimMode = "explore" | "label" | "quiz";

export interface SimState {
  currentId: string;
  history: string[];
  patternMode: PatternMode;
  targetId: string | null;
  wrongTurns: number;
  completed: boolean;
}

export interface Choice {
  id: string;
  /** Button label. At the main carina this names the patient's side explicitly. */
  label: string;
  direction: "forward" | "right-branch" | "left-branch" | "branch";
}

export function initialState(patternMode: PatternMode = "standard", targetId: string | null = null): SimState {
  return { currentId: "trachea", history: [], patternMode, targetId, wrongTurns: 0, completed: false };
}

export function getChoices(state: SimState): Choice[] {
  const current = requireAirway(state.currentId);
  const children = getChildren(current.id, state.patternMode);
  if (children.length === 1) {
    const only = children[0]!;
    return [{ id: only.id, label: `Advance to ${only.code ?? only.name}`, direction: "forward" }];
  }
  if (current.kind === "carina") {
    return children.map((c) => ({
      id: c.id,
      label: c.side === "right" ? "Right branch (patient's right): right main bronchus" : "Left branch (patient's left): left main bronchus",
      direction: c.side === "right" ? "right-branch" : "left-branch",
    }));
  }
  return children.map((c) => ({ id: c.id, label: c.code ? `${c.code} — ${c.name}` : c.name, direction: "branch" }));
}

/** Ids that count as reaching the target (target itself plus pattern equivalents). */
export function acceptedEndIds(targetId: string): string[] {
  const t = requireAirway(targetId);
  const equivalents = t.acceptedEquivalents
    .map((code) => SEGMENTS.find((s) => s.code === code)?.id)
    .filter((x): x is string => Boolean(x));
  return [t.id, ...equivalents];
}

/** True if moving to `nextId` keeps the learner on a route to the target (or an accepted equivalent). */
export function isOnRoute(nextId: string, targetId: string): boolean {
  return acceptedEndIds(targetId).some((end) => getPath(end).some((a) => a.id === nextId));
}

export interface StepFeedback {
  kind: "correct" | "incorrect" | "arrived" | "arrived-variant" | "info";
  message: string;
}

export function advance(state: SimState, nextId: string): { state: SimState; feedback: StepFeedback } {
  const next = requireAirway(nextId);
  if (next.parentId !== state.currentId) throw new Error(`${nextId} is not a branch of ${state.currentId}`);
  const moved: SimState = { ...state, currentId: nextId, history: [...state.history, state.currentId] };
  if (!state.targetId) return { state: moved, feedback: { kind: "info", message: describeArrival(next) } };

  const target = requireAirway(state.targetId);
  if (nextId === target.id) {
    return { state: { ...moved, completed: true }, feedback: { kind: "arrived", message: `You reached ${label(target)}.` } };
  }
  if (acceptedEndIds(target.id).includes(nextId)) {
    return {
      state: { ...moved, completed: true },
      feedback: {
        kind: "arrived-variant",
        message: `You reached ${label(next)}. In this branching pattern ${label(target)} is represented by ${next.code}; this is a recognized nomenclature variant, not an error.`,
      },
    };
  }
  if (isOnRoute(nextId, target.id)) {
    return { state: moved, feedback: { kind: "correct", message: `Correct: ${label(next)} is on the route to ${target.code ?? target.name}.` } };
  }
  const correctStep = getChildren(state.currentId, state.patternMode).find((c) => isOnRoute(c.id, target.id));
  return {
    state: { ...moved, wrongTurns: state.wrongTurns + 1 },
    feedback: {
      kind: "incorrect",
      message: `Not this way: ${label(next)} does not lead to ${target.code ?? target.name}.${
        correctStep ? ` From here the route continues through ${label(correctStep)}.` : ""
      } Use Back to withdraw.`,
    },
  };
}

export function back(state: SimState): SimState {
  if (state.history.length === 0) return state;
  const history = state.history.slice(0, -1);
  return { ...state, currentId: state.history.at(-1)!, history, completed: false };
}

function label(a: AirwayStructure): string {
  return a.code ? `${a.code} (${a.name})` : a.name;
}

function describeArrival(a: AirwayStructure): string {
  return `Now at ${label(a)}.`;
}

/** Route targets for quiz mode: every segmental bronchus visible in the given pattern. */
export function quizTargets(mode: PatternMode): string[] {
  return SEGMENTS.filter((s) => getChildren(s.parentId!, mode).some((c) => c.id === s.id)).map((s) => s.id);
}

/** For label mode: branches arising here plus distractors from elsewhere in the same side. */
export function labelExercise(currentId: string, mode: PatternMode, seed = 0): { correct: string[]; options: string[] } {
  const correct = getChildren(currentId, mode).map((c) => c.id);
  const current = getAirway(currentId);
  const pool = SEGMENTS.concat()
    .filter((s) => !correct.includes(s.id) && (current?.side === "midline" || s.side === current?.side))
    .map((s) => s.id);
  const distractors = rotate(pool, seed).slice(0, Math.max(2, 5 - correct.length));
  return { correct, options: rotate([...correct, ...distractors].sort(), seed) };
}

function rotate<T>(arr: T[], seed: number): T[] {
  if (arr.length === 0) return arr;
  const k = Math.abs(seed) % arr.length;
  return [...arr.slice(k), ...arr.slice(0, k)];
}
