import { describe, expect, it } from "vitest";
import { BRONCHOSCOPIC_VIEWS } from "@/content/airways/bronchoscopicViews";
import { CARINAS } from "@/content/airways/carinas";
import { SOURCE_IDS, SOURCES } from "@/content/sources/registry";
import { bronchoscopicViewSchema, carinaSchema } from "@/lib/contentSchemas";
import { getAirway, getAllChildren } from "@/lib/navigation/tree";

describe("carinas", () => {
  it("match the schema, cite registered authoritative sources and refer to real airways", () => {
    const authoritative = new Set(SOURCES.filter((s) => s.authoritative).map((s) => s.id));
    for (const c of CARINAS) {
      expect(() => carinaSchema.parse(c), c.id).not.toThrow();
      for (const r of c.meta.sourceRefs) {
        expect(SOURCE_IDS.has(r), `${c.id} cites ${r}`).toBe(true);
        expect(authoritative.has(r), `${c.id} cites non-authoritative ${r}`).toBe(true);
      }
      expect(getAirway(c.atAirwayId), c.id).toBeDefined();
      const children = getAllChildren(c.atAirwayId).map((a) => a.id);
      for (const s of c.separates) expect(children, `${c.id} separates ${s}`).toContain(s);
    }
  });

  it("names RC1, RC2, LC1 and LC2 at the expected divisions", () => {
    const at = Object.fromEntries(CARINAS.map((c) => [c.label, c.atAirwayId]));
    expect(at).toMatchObject({ RC1: "rmb", RC2: "bi", LC1: "lmb", LC2: "lul" });
  });

  it("keeps LC1/LC2 draft because the source is internally inconsistent", () => {
    for (const c of CARINAS.filter((x) => x.label.startsWith("LC"))) expect(c.meta.reviewStatus).toBe("draft-unverified");
  });
});

describe("bronchoscopic view layouts", () => {
  it("match the schema and only place real children of the airway", () => {
    for (const v of BRONCHOSCOPIC_VIEWS) {
      expect(() => bronchoscopicViewSchema.parse(v), v.airwayId).not.toThrow();
      const children = getAllChildren(v.airwayId).map((a) => a.id);
      for (const o of v.openings) expect(children, `${v.airwayId} → ${o.childId}`).toContain(o.childId);
      if (v.carinaId) expect(CARINAS.find((c) => c.id === v.carinaId)?.atAirwayId).toBe(v.airwayId);
    }
  });

  it("are draft-unverified because they rest on a non-authoritative source", () => {
    for (const v of BRONCHOSCOPIC_VIEWS) expect(v.meta.reviewStatus).toBe("draft-unverified");
  });

  it("put the left main bronchus left of the right main bronchus at the main carina", () => {
    const v = BRONCHOSCOPIC_VIEWS.find((x) => x.airwayId === "carina")!;
    const x = (id: string) => v.openings.find((o) => o.childId === id)!.x;
    expect(x("lmb")).toBeLessThan(0);
    expect(x("rmb")).toBeGreaterThan(0);
  });
});
