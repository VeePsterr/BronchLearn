import { AIRWAYS, BRANCHING_PATTERNS, type PatternMode } from "@/content/airways/airways";
import type { AirwayStructure } from "@/lib/contentSchemas";

const byId = new Map(AIRWAYS.map((a) => [a.id, a]));

export function getAirway(id: string): AirwayStructure | undefined {
  return byId.get(id);
}

export function requireAirway(id: string): AirwayStructure {
  const a = byId.get(id);
  if (!a) throw new Error(`Unknown airway id: ${id}`);
  return a;
}

/** True when the structure belongs in the given branching-pattern view. */
export function isVisibleInMode(a: AirwayStructure, mode: PatternMode): boolean {
  if (a.patterns.length === 0) return true;
  const active: readonly string[] = BRANCHING_PATTERNS[mode].activePatterns;
  return a.patterns.some((p) => active.includes(p));
}

export function getChildren(id: string, mode: PatternMode = "standard"): AirwayStructure[] {
  return AIRWAYS.filter((a) => a.parentId === id && isVisibleInMode(a, mode));
}

/** All children regardless of pattern (used by validation and the info card). */
export function getAllChildren(id: string): AirwayStructure[] {
  return AIRWAYS.filter((a) => a.parentId === id);
}

/** Path from the trachea to the structure, inclusive. Throws on a broken or cyclic chain. */
export function getPath(id: string): AirwayStructure[] {
  const path: AirwayStructure[] = [];
  const seen = new Set<string>();
  let current = byId.get(id);
  if (!current) throw new Error(`Unknown airway id: ${id}`);
  while (current) {
    if (seen.has(current.id)) throw new Error(`Cycle in airway tree at ${current.id}`);
    seen.add(current.id);
    path.unshift(current);
    if (current.parentId === null) break;
    const parent = byId.get(current.parentId);
    if (!parent) throw new Error(`Broken parent link: ${current.id} → ${current.parentId}`);
    current = parent;
  }
  if (path[0]?.kind !== "trachea") throw new Error(`Path for ${id} does not start at the trachea`);
  return path;
}

export function displayLabel(a: AirwayStructure): string {
  return a.code ? `${a.code} — ${a.name}` : a.name;
}

export function shortLabel(a: AirwayStructure): string {
  return a.code ?? a.aliases.find((x) => x.length <= 4) ?? a.name;
}

/** Breadcrumb text, e.g. "Trachea → Right main bronchus → Right superior lobar bronchus → RB1". */
export function breadcrumbText(id: string): string {
  return getPath(id)
    .filter((a) => a.kind !== "carina")
    .map((a) => a.code ?? a.name)
    .join(" → ");
}

function normalise(s: string): string {
  return s.toLowerCase().replace(/\s+/g, "").replace(/[–—-]/g, "");
}

/** Search by code, name, Latin name or alias. Exact code matches first. */
export function searchAirways(query: string): AirwayStructure[] {
  const q = normalise(query);
  if (!q) return [];
  const scored = AIRWAYS.map((a) => {
    const code = a.code ? normalise(a.code) : "";
    let score = 0;
    if (code && code === q) score = 100;
    else if (code && code.startsWith(q)) score = 80;
    else if (normalise(a.name).includes(q)) score = 60;
    else if (a.aliases.some((x) => normalise(x).includes(q))) score = 40;
    else if (a.latinName && normalise(a.latinName).includes(q)) score = 30;
    return { a, score };
  });
  return scored
    .filter((s) => s.score > 0)
    .sort((x, y) => y.score - x.score)
    .map((s) => s.a);
}

export const SEGMENTS = AIRWAYS.filter((a) => a.kind === "segmental-bronchus");
export { AIRWAYS };
