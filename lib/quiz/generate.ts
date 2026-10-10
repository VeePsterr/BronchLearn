import { AIRWAYS } from "@/content/airways/airways";
import type { AirwayStructure, QuizQuestion, ReviewMeta } from "@/lib/contentSchemas";
import { getAllChildren, getPath, SEGMENTS } from "@/lib/navigation/tree";

/** Deterministic pseudo-random helpers so pages prerender identically on server and client. */
export function seededShuffle<T>(arr: readonly T[], seed: number): T[] {
  const out = [...arr];
  let s = seed >>> 0 || 1;
  for (let i = out.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) >>> 0;
    const j = s % (i + 1);
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

function hash(str: string): number {
  let h = 2166136261;
  for (const c of str) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return h >>> 0;
}

function slug(id: string): string {
  return id.toLowerCase().replace(/\+/g, "plus").replace(/[^a-z0-9]+/g, "-");
}

function sideName(a: AirwayStructure): string {
  return a.side === "right" ? "right" : "left";
}

/** Same-side segments, excluding the target and its accepted equivalents. */
function distractorSegments(target: AirwayStructure, n: number): AirwayStructure[] {
  const exclude = new Set([target.code, ...target.acceptedEquivalents]);
  const pool = SEGMENTS.filter((s) => s.side === target.side && !exclude.has(s.code));
  return seededShuffle(pool, hash(target.id)).slice(0, n);
}

function codeToName(t: AirwayStructure): QuizQuestion {
  const distract = distractorSegments(t, 3).filter((d) => d.name !== t.name);
  const options = seededShuffle(
    [{ id: t.id, label: t.name }, ...distract.map((d) => ({ id: d.id, label: d.name }))],
    hash(`c2n${t.id}`),
  );
  return {
    id: `code-to-name-${slug(t.id)}`,
    type: "code-to-name",
    prompt: `What is the full anatomical name of ${t.code} (${sideName(t)} lung)?`,
    options,
    acceptedOptionIds: [t.id],
    explanation: `${t.code} is the ${t.name.toLowerCase()} of the ${sideName(t)} lung (${t.lobe}). Path: ${getPath(t.id)
      .filter((a) => a.kind !== "carina")
      .map((a) => a.code ?? a.name)
      .join(" → ")}.`,
    airwayRefs: [t.id, ...distract.map((d) => d.id)],
    stationRefs: [],
    meta: t.meta,
  };
}

function nameToCode(t: AirwayStructure): QuizQuestion {
  const equivalents = t.anatomyClass === "variant" ? [] : SEGMENTS.filter((s) => t.acceptedEquivalents.includes(s.code ?? ""));
  const distract = distractorSegments(t, 3 - Math.min(1, equivalents.length));
  const all = [t, ...equivalents.slice(0, 1), ...distract];
  const options = seededShuffle(all.map((a) => ({ id: a.id, label: a.code! })), hash(`n2c${t.id}`));
  const eq = equivalents.slice(0, 1).filter((e) => options.some((o) => o.id === e.id));
  return {
    id: `name-to-code-${slug(t.id)}`,
    type: "name-to-code",
    prompt: `Which code is the ${t.name.toLowerCase()} of the ${sideName(t)} lung${t.patterns.length ? " (when separately present/described)" : ""}?`,
    options,
    acceptedOptionIds: [t.id, ...eq.map((e) => e.id)],
    explanation: `The ${t.name.toLowerCase()} of the ${sideName(t)} lung is ${t.code}.`,
    variantNote: eq.length
      ? `${eq.map((e) => e.code).join(", ")} is also accepted: it is a recognized combined-branch nomenclature variant, not an error.`
      : undefined,
    airwayRefs: all.map((a) => a.id),
    stationRefs: [],
    meta: t.meta,
  };
}

function nextBranch(parent: AirwayStructure): QuizQuestion | null {
  const children = getAllChildren(parent.id).filter((c) => c.anatomyClass !== "variant");
  if (children.length < 2) return null;
  const correct = children[hash(parent.id) % children.length]!;
  const childIds = new Set(getAllChildren(parent.id).map((c) => c.id));
  const pool = AIRWAYS.filter(
    (a) => !childIds.has(a.id) && a.id !== parent.id && a.kind !== "trachea" && a.kind !== "carina" && (a.side === parent.side || parent.side === "midline"),
  );
  const distract = seededShuffle(pool, hash(`nb${parent.id}`)).slice(0, 3);
  const label = (a: AirwayStructure) => (a.code ? `${a.code} — ${a.name}` : a.name);
  const strictest: ReviewMeta = [parent.meta, correct.meta].find((m) => m.reviewStatus === "draft-unverified") ?? parent.meta;
  return {
    id: `next-branch-${slug(parent.id)}`,
    type: "next-branch",
    prompt: `Which of these arises directly from the ${parent.name.toLowerCase()}?`,
    options: seededShuffle([correct, ...distract].map((a) => ({ id: a.id, label: label(a) })), hash(`nbo${parent.id}`)),
    acceptedOptionIds: [correct.id],
    explanation: `Branches of the ${parent.name.toLowerCase()} in this atlas: ${getAllChildren(parent.id).map(label).join("; ")}.`,
    airwayRefs: [parent.id, correct.id, ...distract.map((d) => d.id)],
    stationRefs: [],
    meta: strictest,
  };
}

function routeText(ids: string[]): string {
  return ids.map((id) => AIRWAYS.find((a) => a.id === id)).filter((a): a is AirwayStructure => !!a && a.kind !== "carina").map((a) => a.code ?? a.name).join(" → ");
}

function navigate(t: AirwayStructure): QuizQuestion {
  const correct = getPath(t.id).map((a) => a.id);
  const others = seededShuffle(
    SEGMENTS.filter((s) => s.parentId !== t.parentId && s.patterns.length === 0),
    hash(`nav${t.id}`),
  );
  const wrongRoutes: { id: string; label: string }[] = [];
  const seen = new Set([routeText(correct)]);
  for (const o of others) {
    const r = routeText([...getPath(o.parentId!).map((a) => a.id)]) + ` → ${t.code}`;
    if (!seen.has(r)) {
      seen.add(r);
      wrongRoutes.push({ id: `route-via-${slug(o.parentId!)}`, label: r });
    }
    if (wrongRoutes.length === 3) break;
  }
  const options = seededShuffle([{ id: t.id, label: routeText(correct) }, ...wrongRoutes], hash(`navo${t.id}`));
  const strictest = getPath(t.id).find((a) => a.meta.reviewStatus === "draft-unverified")?.meta ?? t.meta;
  return {
    id: `navigate-${slug(t.id)}`,
    type: "navigate-to-segment",
    prompt: `Which route leads from the trachea to ${t.code} (${t.name.toLowerCase()})?`,
    options,
    acceptedOptionIds: [t.id],
    explanation: `The route is ${routeText(correct)}. Practise it in the navigation simulator.`,
    airwayRefs: correct,
    stationRefs: [],
    navigation: { targetId: t.id, acceptedEndIds: [t.id] },
    meta: strictest,
  };
}

export function generateAirwayQuestions(): QuizQuestion[] {
  const segs = SEGMENTS;
  const parents = AIRWAYS.filter((a) => getAllChildren(a.id).length >= 2);
  const navTargets = ["RB1", "RB5", "RB10", "LB1+2", "LB4", "LB9"];
  return [
    ...segs.map(codeToName),
    ...segs.map(nameToCode),
    ...parents.map(nextBranch).filter((q): q is QuizQuestion => q !== null),
    ...navTargets.map((id) => navigate(AIRWAYS.find((a) => a.id === id)!)),
  ];
}
