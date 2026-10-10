import { describe, expect, it } from "vitest";
import { NODAL_RULES } from "@/content/staging/nodalRules";
import { STATIONS } from "@/content/stations/stations";
import { ZONES } from "@/content/stations/zones";
import { SOURCE_IDS } from "@/content/sources/registry";
import { isSensitiveDisplayable } from "@/lib/content/display";
import { lymphNodeStationSchema, nodalRuleSchema, sensitiveTextSchema, zoneSchema } from "@/lib/contentSchemas";

describe("station dataset", () => {
  it("every station matches the schema", () => {
    for (const s of STATIONS) {
      const r = lymphNodeStationSchema.safeParse(s);
      expect(r.success, `${s.stationCode}: ${r.success ? "" : r.error.message}`).toBe(true);
    }
  });

  it("station codes are unique", () => {
    const codes = STATIONS.map((s) => s.stationCode);
    expect(new Set(codes).size).toBe(codes.length);
  });

  it("every station has at least one source reference, and all references exist", () => {
    for (const s of STATIONS) {
      expect(s.sourceRefs.length, s.stationCode).toBeGreaterThan(0);
      for (const r of [...s.sourceRefs, ...s.accessibleBy.meta.sourceRefs]) expect(SOURCE_IDS.has(r), `${s.stationCode} cites ${r}`).toBe(true);
    }
  });

  it("every station appears in exactly one zone, matching its zone field", () => {
    for (const s of STATIONS) {
      const zones = ZONES.filter((z) => z.stations.includes(s.stationCode));
      expect(zones.map((z) => z.id), s.stationCode).toEqual([s.zone]);
    }
    for (const z of ZONES) expect(() => zoneSchema.parse(z)).not.toThrow();
  });

  it("no sensitive procedural text is displayable without clinician review", () => {
    for (const s of STATIONS) {
      for (const f of [s.typicalAirwayApproach, s.ultrasoundLandmarks, s.samplingNotes]) {
        if (f.reviewStatus !== "clinician-reviewed") expect(isSensitiveDisplayable(f)).toBe(false);
      }
    }
  });

  it("sampling notes stay empty unless clinician-reviewed", () => {
    for (const s of STATIONS) if (s.samplingNotes.reviewStatus !== "clinician-reviewed") expect(s.samplingNotes.text).toBeNull();
  });

  it("access data that are unverified are marked draft-unverified (never presented as verified)", () => {
    for (const s of STATIONS) {
      const notAccessed = s.accessibleBy.meta.sourceRefs.every((r) => ["ers-esge-ests-2026", "ebus-tbna-guideline-pmc10401980"].includes(r));
      if (notAccessed) expect(s.accessibleBy.meta.reviewStatus).toBe("draft-unverified");
    }
  });

  it("no medical text claims a location is universally safe to biopsy", () => {
    const text = JSON.stringify(STATIONS).toLowerCase();
    expect(text).not.toMatch(/safe to (biopsy|puncture|sample)/);
  });
});

describe("sensitive text schema", () => {
  it("rejects clinician-reviewed sampling text without reviewer metadata", () => {
    const r = sensitiveTextSchema.safeParse({ text: "Example", reviewStatus: "clinician-reviewed", sourceRefs: ["iaslc-map-2009"] });
    expect(r.success).toBe(false);
  });
  it("accepts clinician-reviewed text with full reviewer metadata", () => {
    const r = sensitiveTextSchema.safeParse({
      text: "Example",
      reviewStatus: "clinician-reviewed",
      reviewerName: "Dr Example",
      reviewerRole: "Interventional pulmonologist",
      reviewedDate: "2026-10-10",
      sourceRefs: ["iaslc-map-2009"],
    });
    expect(r.success).toBe(true);
  });
});

describe("nodal staging rules", () => {
  it("every rule matches the schema and refers to an existing station", () => {
    const codes = new Set(STATIONS.map((s) => s.stationCode));
    for (const r of NODAL_RULES) {
      expect(() => nodalRuleSchema.parse(r)).not.toThrow();
      expect(codes.has(r.stationCode), r.stationCode).toBe(true);
    }
  });
  it("lateralized hilar and mediastinal stations change category with tumour side", () => {
    for (const r of NODAL_RULES.filter((x) => /[RL]$/.test(x.stationCode) && !x.stationCode.startsWith("1"))) {
      expect(r.byTumourSide.right).not.toBe(r.byTumourSide.left);
    }
  });
  it("has no side-independent category field", () => {
    for (const r of NODAL_RULES) expect(Object.keys(r.byTumourSide).sort()).toEqual(["left", "right"]);
  });
});
