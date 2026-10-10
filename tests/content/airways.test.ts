import { describe, expect, it } from "vitest";
import { AIRWAYS } from "@/content/airways/airways";
import { SOURCE_IDS, SOURCES } from "@/content/sources/registry";
import { airwayStructureSchema, sourceSchema } from "@/lib/contentSchemas";
import { breadcrumbText, getChildren, getPath } from "@/lib/navigation/tree";

describe("source registry", () => {
  it("every source matches the schema", () => {
    for (const s of SOURCES) expect(() => sourceSchema.parse(s), s.id).not.toThrow();
  });
  it("source ids are unique", () => {
    expect(SOURCE_IDS.size).toBe(SOURCES.length);
  });
  it("video inspiration sources are never marked authoritative", () => {
    for (const s of SOURCES.filter((x) => x.kind === "teaching-inspiration")) expect(s.authoritative).toBe(false);
  });
});

describe("airway dataset", () => {
  it("every structure matches the schema", () => {
    for (const a of AIRWAYS) {
      const r = airwayStructureSchema.safeParse(a);
      expect(r.success, `${a.id}: ${r.success ? "" : r.error.message}`).toBe(true);
    }
  });

  it("ids are unique", () => {
    const ids = AIRWAYS.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("codes are unique", () => {
    const codes = AIRWAYS.map((a) => a.code).filter((c): c is string => c !== null);
    expect(new Set(codes).size).toBe(codes.length);
  });

  it("codes contain no spaces", () => {
    for (const a of AIRWAYS) if (a.code) expect(a.code).not.toMatch(/\s/);
  });

  it("every parent reference exists", () => {
    const ids = new Set(AIRWAYS.map((a) => a.id));
    for (const a of AIRWAYS) if (a.parentId !== null) expect(ids.has(a.parentId), `${a.id} → ${a.parentId}`).toBe(true);
  });

  it("there is exactly one root and it is the trachea", () => {
    const roots = AIRWAYS.filter((a) => a.parentId === null);
    expect(roots.map((r) => r.id)).toEqual(["trachea"]);
  });

  it("every structure has an unbroken breadcrumb path from the trachea", () => {
    for (const a of AIRWAYS) {
      const path = getPath(a.id);
      expect(path[0]?.id).toBe("trachea");
      expect(path.at(-1)?.id).toBe(a.id);
    }
  });

  it("every source reference exists in the registry", () => {
    for (const a of AIRWAYS) for (const r of a.meta.sourceRefs) expect(SOURCE_IDS.has(r), `${a.id} cites ${r}`).toBe(true);
  });

  it("only authoritative sources are cited", () => {
    const authoritative = new Set(SOURCES.filter((s) => s.authoritative).map((s) => s.id));
    for (const a of AIRWAYS) for (const r of a.meta.sourceRefs) expect(authoritative.has(r)).toBe(true);
  });

  it("side matches code prefix and laterality is consistent with the parent", () => {
    for (const a of AIRWAYS) {
      if (a.code?.startsWith("RB")) expect(a.side).toBe("right");
      if (a.code?.startsWith("LB")) expect(a.side).toBe("left");
      const parent = AIRWAYS.find((p) => p.id === a.parentId);
      if (parent && parent.side !== "midline") expect(a.side).toBe(parent.side);
    }
  });

  it("contains the 10 right and the expected left segmental codes from the baseline", () => {
    const codes = new Set(AIRWAYS.map((a) => a.code));
    for (const c of ["RB1", "RB2", "RB3", "RB4", "RB5", "RB6", "RB7", "RB8", "RB9", "RB10"]) expect(codes.has(c)).toBe(true);
    for (const c of ["LB1+2", "LB3", "LB4", "LB5", "LB6", "LB7", "LB8", "LB7+8", "LB9", "LB10"]) expect(codes.has(c)).toBe(true);
  });

  it("RB1 is the apical segmental bronchus with the expected breadcrumb", () => {
    const rb1 = AIRWAYS.find((a) => a.code === "RB1")!;
    expect(rb1.name).toBe("Apical segmental bronchus");
    expect(rb1.lobe).toBe("RUL");
    expect(breadcrumbText("RB1")).toBe("Trachea → Right main bronchus → Right superior lobar bronchus → RB1");
  });

  it("LB7+8 is a variant pattern, not a replacement for LB7/LB8 in the standard view", () => {
    const standard = getChildren("lll", "standard").map((a) => a.code);
    const variants = getChildren("lll", "variants").map((a) => a.code);
    expect(standard).toEqual(expect.arrayContaining(["LB7", "LB8"]));
    expect(standard).not.toContain("LB7+8");
    expect(variants).toContain("LB7+8");
    expect(variants).not.toContain("LB7");
    const combined = AIRWAYS.find((a) => a.code === "LB7+8")!;
    expect(combined.anatomyClass).toBe("variant");
    expect(combined.acceptedEquivalents).toEqual(expect.arrayContaining(["LB7", "LB8"]));
  });

  it("each lobe has its expected segment count in the standard view", () => {
    const segs = (lobe: string) => AIRWAYS.filter((a) => a.kind === "segmental-bronchus" && a.lobe === lobe && !a.patterns.includes("LLL-combined-7+8"));
    expect(segs("RUL")).toHaveLength(3);
    expect(segs("RML")).toHaveLength(2);
    expect(segs("RLL")).toHaveLength(5);
    expect(segs("LUL")).toHaveLength(4);
    expect(segs("LLL")).toHaveLength(5);
  });
});
