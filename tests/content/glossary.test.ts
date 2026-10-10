import { describe, expect, it } from "vitest";
import { GLOSSARY } from "@/content/glossary/glossary";
import { SOURCE_IDS } from "@/content/sources/registry";
import { glossaryTermSchema } from "@/lib/contentSchemas";

describe("glossary", () => {
  it("every term matches the schema, cites a registered source and has a unique id", () => {
    const ids = new Set<string>();
    for (const t of GLOSSARY) {
      expect(() => glossaryTermSchema.parse(t), t.id).not.toThrow();
      for (const r of t.meta.sourceRefs) expect(SOURCE_IDS.has(r), `${t.id} cites ${r}`).toBe(true);
      expect(ids.has(t.id)).toBe(false);
      ids.add(t.id);
    }
  });
  it("see-also links resolve", () => {
    const ids = new Set(GLOSSARY.map((t) => t.id));
    for (const t of GLOSSARY) for (const s of t.seeAlso) expect(ids.has(s), `${t.id} → ${s}`).toBe(true);
  });
});
