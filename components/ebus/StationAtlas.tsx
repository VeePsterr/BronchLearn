"use client";

import { useEffect, useMemo, useState } from "react";
import { STATIONS, getStation } from "@/content/stations/stations";
import { ZONES } from "@/content/stations/zones";
import type { LymphNodeStation, ZoneId } from "@/lib/contentSchemas";
import { progressActions, useProgress } from "@/lib/progress/store";
import { LabeledSwitch, Segmented } from "@/components/ui/Controls";
import { ReviewBadge } from "@/components/ui/ReviewBadge";
import { StationCard } from "./StationCard";
import { StationMap } from "./StationMap";

type SideFilter = "all" | "right" | "left" | "midline";
type ModalityFilter = "all" | "ebus" | "eusb" | "neither";

export function filterStations(stations: LymphNodeStation[], side: SideFilter, zone: ZoneId | "all", modality: ModalityFilter) {
  return stations.filter((s) => {
    if (side !== "all") {
      if (side === "midline" ? !(s.laterality === "midline" || s.laterality === "bilateral") : s.laterality !== side) return false;
    }
    if (zone !== "all" && s.zone !== zone) return false;
    if (modality === "ebus" && s.accessibleBy.ebusTbna !== "conventional") return false;
    if (modality === "eusb" && s.accessibleBy.eusBFna !== "conventional") return false;
    if (modality === "neither" && (s.accessibleBy.ebusTbna === "conventional" || s.accessibleBy.eusBFna === "conventional")) return false;
    return true;
  });
}

export function StationAtlas() {
  const [selected, setSelected] = useState<string>("4R");
  const [side, setSide] = useState<SideFilter>("all");
  const [zone, setZone] = useState<ZoneId | "all">("all");
  const [modality, setModality] = useState<ModalityFilter>("all");
  const [labels, setLabels] = useState(true);
  const { update } = useProgress();

  useEffect(() => {
    const s = new URLSearchParams(window.location.search).get("s");
    if (s && getStation(s)) setSelected(s);
  }, []);

  const visible = useMemo(() => filterStations(STATIONS, side, zone, modality), [side, zone, modality]);
  const visibleCodes = useMemo(() => new Set(visible.map((s) => s.stationCode)), [visible]);
  const station = getStation(selected) ?? STATIONS[0]!;

  const select = (code: string) => {
    setSelected(code);
    update((p) => progressActions.visitStation(p, code));
    const url = new URL(window.location.href);
    url.searchParams.set("s", code);
    window.history.replaceState(null, "", url);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-4 rounded-xl border border-line bg-surface p-4">
        <Segmented
          label="Side"
          value={side}
          onChange={setSide}
          options={[
            { value: "all", label: "All" },
            { value: "right", label: "R · Right" },
            { value: "left", label: "L · Left" },
            { value: "midline", label: "Midline / both" },
          ]}
        />
        <div>
          <label htmlFor="zone" className="mb-1 block text-sm font-medium">Zone</label>
          <select id="zone" value={zone} onChange={(e) => setZone(e.target.value as ZoneId | "all")} className="rounded-lg border border-line bg-surface px-3 py-1.5 text-sm">
            <option value="all">All zones</option>
            {ZONES.map((z) => <option key={z.id} value={z.id}>{z.name}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="modality" className="mb-1 block text-sm font-medium">
            Modality access <span className="font-normal text-draft">(draft data)</span>
          </label>
          <select id="modality" value={modality} onChange={(e) => setModality(e.target.value as ModalityFilter)} className="rounded-lg border border-line bg-surface px-3 py-1.5 text-sm">
            <option value="all">Any</option>
            <option value="ebus">EBUS-TBNA: conventionally reached</option>
            <option value="eusb">EUS-B-FNA: conventionally reached</option>
            <option value="neither">Neither conventionally reached</option>
          </select>
        </div>
        <LabeledSwitch checked={labels} onChange={setLabels} label="Structure labels" />
      </div>

      {modality !== "all" && (
        <p className="flex flex-wrap items-center gap-2 text-sm">
          <ReviewBadge status="draft-unverified" compact /> The modality filter uses draft access values that have not been verified against a guideline.
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <section aria-label="Station map" className="space-y-3">
          <div className="rounded-xl border border-line bg-surface p-2">
            <StationMap stations={STATIONS} visibleCodes={visibleCodes} selectedCode={selected} onSelect={select} showLabels={labels} />
            <p className="px-3 pb-2 text-sm text-muted">
              Original schematic, anterior view, not to scale. Marker positions are approximate and do not define boundaries.
              Dashed markers lie posterior. {visible.length} of {STATIONS.length} stations match the filters.
            </p>
          </div>
          <div className="rounded-xl border border-line bg-surface p-4">
            <p className="mb-2 text-sm font-semibold" id="station-list-label">Station list</p>
            <ul aria-labelledby="station-list-label" className="flex flex-wrap gap-1.5">
              {visible.map((s) => (
                <li key={s.stationCode}>
                  <button
                    type="button"
                    onClick={() => select(s.stationCode)}
                    aria-pressed={s.stationCode === selected}
                    className="rounded-md border border-line px-2.5 py-1 font-mono text-sm aria-pressed:bg-accent aria-pressed:text-on-accent"
                  >
                    {s.stationCode}
                  </button>
                </li>
              ))}
              {visible.length === 0 && <li className="text-sm text-muted">No stations match these filters.</li>}
            </ul>
          </div>
        </section>
        <section aria-label="Station details" aria-live="polite">
          <StationCard station={station} />
        </section>
      </div>
    </div>
  );
}
