"use client";

import { useEffect, useMemo, useState } from "react";
import type { PatternMode } from "@/content/airways/airways";
import type { Lobe, Side } from "@/lib/contentSchemas";
import { getAirway, searchAirways } from "@/lib/navigation/tree";
import { progressActions, useProgress } from "@/lib/progress/store";
import { LabeledSwitch, Segmented } from "@/components/ui/Controls";
import { SideTag } from "@/components/ui/SideTag";
import { AirwayInfoCard } from "./AirwayInfoCard";
import { AirwayTree } from "./AirwayTree";

const LOBES: { value: Lobe | "all"; label: string }[] = [
  { value: "all", label: "All lobes" },
  { value: "RUL", label: "Right upper (RUL)" },
  { value: "RML", label: "Right middle (RML)" },
  { value: "RLL", label: "Right lower (RLL)" },
  { value: "LUL", label: "Left upper (LUL)" },
  { value: "LLL", label: "Left lower (LLL)" },
];

export function AirwayAtlas() {
  const [selectedId, setSelectedId] = useState<string>("trachea");
  const [showLabels, setShowLabels] = useState(true);
  const [mode, setMode] = useState<PatternMode>("standard");
  const [side, setSide] = useState<Side | "all">("all");
  const [lobe, setLobe] = useState<Lobe | "all">("all");
  const [query, setQuery] = useState("");
  const { update } = useProgress();

  // Deep link: /atlas?s=RB1
  useEffect(() => {
    const s = new URLSearchParams(window.location.search).get("s");
    if (s && getAirway(s)) setSelectedId(s);
  }, []);

  const select = (id: string) => {
    setSelectedId(id);
    const a = getAirway(id);
    if (a?.patterns.includes("LLL-combined-7+8")) setMode("variants");
    if (a?.patterns.includes("LLL-separate-7-8")) setMode("standard");
    update((p) => progressActions.visitAirway(p, id));
    const url = new URL(window.location.href);
    url.searchParams.set("s", id);
    window.history.replaceState(null, "", url);
  };

  const results = useMemo(() => searchAirways(query).slice(0, 8), [query]);
  const selected = getAirway(selectedId) ?? getAirway("trachea")!;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
      <section aria-label="Airway map and controls" className="space-y-4">
        <div className="flex flex-wrap items-end gap-4 rounded-xl border border-line bg-surface p-4">
          <LabeledSwitch checked={showLabels} onChange={setShowLabels} label="Labels" />
          <Segmented
            label="Side"
            value={side}
            onChange={setSide}
            options={[
              { value: "all", label: "Both" },
              { value: "right", label: "R · Right" },
              { value: "left", label: "L · Left" },
            ]}
          />
          <div>
            <label htmlFor="lobe-filter" className="mb-1 block text-sm font-medium">Lobe</label>
            <select
              id="lobe-filter"
              value={lobe}
              onChange={(e) => setLobe(e.target.value as Lobe | "all")}
              className="rounded-lg border border-line bg-surface px-3 py-1.5 text-sm"
            >
              {LOBES.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
            </select>
          </div>
          <Segmented
            label="Branching pattern"
            value={mode}
            onChange={setMode}
            options={[
              { value: "standard", label: "Standard" },
              { value: "variants", label: "Variants" },
            ]}
          />
        </div>

        <div className="rounded-xl border border-line bg-surface p-2">
          <AirwayTree selectedId={selectedId} onSelect={select} showLabels={showLabels} mode={mode} sideFilter={side} lobeFilter={lobe} />
          <p className="px-3 pb-2 text-sm text-muted">
            {mode === "variants"
              ? "Variant view: the left lower lobe shows the combined anteromedial basal bronchus (LB7+8, dashed) instead of separate LB7 and LB8."
              : "Standard view: the left lower lobe shows LB7 and LB8 listed separately. Switch to Variants to see LB7+8."}{" "}
            Select any branch, or use Tab and Enter.
          </p>
        </div>
      </section>

      <section aria-label="Search and details" className="space-y-4">
        <div className="rounded-xl border border-line bg-surface p-4">
          <label htmlFor="airway-search" className="block text-sm font-semibold">Search by code or name</label>
          <input
            id="airway-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. RB6, lingular, apicoposterior"
            className="mt-1 w-full rounded-lg border border-line bg-surface px-3 py-2"
            aria-describedby="airway-search-count"
            autoComplete="off"
          />
          <p id="airway-search-count" className="sr-only" aria-live="polite">
            {query ? `${results.length} matches` : ""}
          </p>
          {query && (
            <ul className="mt-2 divide-y divide-line">
              {results.length === 0 && <li className="py-2 text-sm text-muted">No matching structures.</li>}
              {results.map((r) => (
                <li key={r.id}>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 py-2 text-left hover:bg-surface-2"
                    onClick={() => {
                      select(r.id);
                      setQuery("");
                    }}
                  >
                    <SideTag side={r.side} />
                    <span className="font-mono font-semibold">{r.code ?? ""}</span>
                    <span>{r.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div aria-live="polite">
          <AirwayInfoCard airway={selected} mode={mode} onSelect={select} />
        </div>
      </section>
    </div>
  );
}
