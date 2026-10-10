/**
 * Prints a review-status inventory of all medical content.
 * Usage: npm run content:report
 */
import { AIRWAYS } from "@/content/airways/airways";
import { GLOSSARY } from "@/content/glossary/glossary";
import { NODAL_RULES } from "@/content/staging/nodalRules";
import { STATIONS } from "@/content/stations/stations";
import { ZONES } from "@/content/stations/zones";
import { QUESTION_BANK } from "@/lib/quiz/bank";

type Row = { group: string; id: string; status: string };
const rows: Row[] = [
  ...AIRWAYS.map((a) => ({ group: "airway", id: a.code ?? a.id, status: a.meta.reviewStatus })),
  ...STATIONS.map((s) => ({ group: "station-anatomy", id: s.stationCode, status: s.reviewStatus })),
  ...STATIONS.map((s) => ({ group: "station-access", id: s.stationCode, status: s.accessibleBy.meta.reviewStatus })),
  ...STATIONS.flatMap((s) =>
    (["typicalAirwayApproach", "ultrasoundLandmarks", "samplingNotes"] as const).map((f) => ({
      group: "station-procedural",
      id: `${s.stationCode}.${f}`,
      status: s[f].text === null ? "empty (hidden)" : s[f].reviewStatus,
    })),
  ),
  ...ZONES.map((z) => ({ group: "zone", id: z.id, status: z.meta.reviewStatus })),
  ...NODAL_RULES.map((r) => ({ group: "nodal-rule", id: r.stationCode, status: r.meta.reviewStatus })),
  ...GLOSSARY.map((g) => ({ group: "glossary", id: g.id, status: g.meta.reviewStatus })),
  ...QUESTION_BANK.map((q) => ({ group: "quiz", id: q.id, status: q.meta.reviewStatus })),
];

const summary = new Map<string, Map<string, number>>();
for (const r of rows) {
  const g = summary.get(r.group) ?? new Map<string, number>();
  g.set(r.status, (g.get(r.status) ?? 0) + 1);
  summary.set(r.group, g);
}
console.log("Medical content review-status inventory\n");
for (const [group, counts] of summary) {
  console.log(`${group.padEnd(20)} ${[...counts].map(([s, n]) => `${s}: ${n}`).join(", ")}`);
}
console.log("\nDraft-unverified items:");
for (const r of rows.filter((x) => x.status === "draft-unverified")) console.log(`  [${r.group}] ${r.id}`);
