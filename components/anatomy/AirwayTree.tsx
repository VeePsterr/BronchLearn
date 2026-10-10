"use client";

import type { KeyboardEvent } from "react";
import type { PatternMode } from "@/content/airways/airways";
import type { AirwayStructure, Lobe, Side } from "@/lib/contentSchemas";
import { AIRWAYS, getPath, isVisibleInMode, shortLabel } from "@/lib/navigation/tree";
import { AIRWAY_ENDPOINTS, DIAGRAM_LABELS, STROKE_BY_KIND, TRACHEA_START, type Pt } from "./airwayLayout";

export interface AirwayTreeProps {
  selectedId: string | null;
  onSelect: (id: string) => void;
  showLabels: boolean;
  mode: PatternMode;
  sideFilter: Side | "all";
  lobeFilter: Lobe | "all";
  /** Optional ids to emphasise (e.g. the simulator's current position). */
  highlightIds?: string[];
  /** Compact rendering for the mini-map. */
  compact?: boolean;
  title?: string;
}

function startOf(a: AirwayStructure): Pt {
  if (a.parentId === null) return TRACHEA_START;
  return AIRWAY_ENDPOINTS[a.parentId] ?? TRACHEA_START;
}

function matchesFilter(a: AirwayStructure, side: Side | "all", lobe: Lobe | "all"): boolean {
  if (side !== "all" && a.side !== side && a.side !== "midline") return false;
  if (lobe !== "all" && a.lobe !== lobe && a.lobe !== null) return false;
  if (lobe !== "all" && a.lobe === null) {
    // Keep central airways leading to the chosen lobe visible as context.
    return true;
  }
  return true;
}

function accessibleName(a: AirwayStructure): string {
  const side = a.side === "midline" ? "midline" : `${a.side} side`;
  return [a.code, a.name, side, a.lobe ? `${a.lobe} lobe` : null, a.anatomyClass === "variant" ? "variant pattern" : null]
    .filter(Boolean)
    .join(", ");
}

export function AirwayTree({
  selectedId,
  onSelect,
  showLabels,
  mode,
  sideFilter,
  lobeFilter,
  highlightIds = [],
  compact = false,
  title = "Schematic airway tree",
}: AirwayTreeProps) {
  const visible = AIRWAYS.filter((a) => isVisibleInMode(a, mode) && AIRWAY_ENDPOINTS[a.id]);
  const pathIds = new Set(selectedId ? safePath(selectedId) : []);
  const highlight = new Set(highlightIds);

  const handleKey = (e: KeyboardEvent<SVGGElement>, id: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect(id);
    }
  };

  return (
    <svg
      viewBox="0 0 1000 720"
      role={compact ? "img" : "group"}
      aria-label={`${title}. Anterior view, patient's right on the left of the image. Schematic, not to scale.`}
      className="h-auto w-full select-none"
    >
      <title>{title}</title>
      {!compact && (
        <g aria-hidden="true" className="fill-muted text-[34px] font-bold">
          <text x="40" y="44" className="fill-side-r">R</text>
          <text x="40" y="72" className="fill-muted text-[18px] font-normal">Patient&apos;s right</text>
          <text x="960" y="44" textAnchor="end" className="fill-side-l">L</text>
          <text x="960" y="72" textAnchor="end" className="fill-muted text-[18px] font-normal">Patient&apos;s left</text>
          <text x="500" y="714" textAnchor="middle" className="fill-muted text-[17px] font-normal">
            Original schematic · anterior view · not to scale
          </text>
        </g>
      )}

      {/* Airway segments */}
      {visible
        .filter((a) => a.kind !== "carina")
        .map((a) => {
          const s = startOf(a);
          const e = AIRWAY_ENDPOINTS[a.id]!;
          const width = (STROKE_BY_KIND[a.kind] ?? 6) * (compact ? 1.4 : 1);
          const selected = a.id === selectedId;
          const onPath = pathIds.has(a.id);
          const dim = !matchesFilter(a, sideFilter, lobeFilter);
          const hl = highlight.has(a.id);
          const sideColour = a.side === "right" ? "var(--right)" : a.side === "left" ? "var(--left)" : "var(--muted)";
          return (
            <g
              key={a.id}
              role={compact ? undefined : "button"}
              tabIndex={compact ? undefined : 0}
              aria-label={compact ? undefined : accessibleName(a)}
              aria-pressed={compact ? undefined : selected}
              data-airway-id={a.id}
              onClick={() => onSelect(a.id)}
              onKeyDown={(ev) => handleKey(ev, a.id)}
              className="group cursor-pointer outline-none"
              opacity={dim ? 0.22 : 1}
            >
              {/* wide invisible hit area */}
              <line x1={s.x} y1={s.y} x2={e.x} y2={e.y} stroke="transparent" strokeWidth={Math.max(width + 18, 26)} strokeLinecap="round" />
              <line
                x1={s.x}
                y1={s.y}
                x2={e.x}
                y2={e.y}
                stroke={selected || hl ? "var(--accent)" : onPath ? "var(--ink)" : sideColour}
                strokeOpacity={selected || onPath || hl ? 1 : 0.55}
                strokeWidth={width}
                strokeLinecap="round"
                strokeDasharray={a.anatomyClass === "variant" ? "10 6" : undefined}
              />
              {/* focus ring drawn in SVG so it follows the shape */}
              <line
                x1={s.x}
                y1={s.y}
                x2={e.x}
                y2={e.y}
                stroke="var(--accent)"
                strokeWidth={width + 10}
                strokeLinecap="round"
                fill="none"
                className="opacity-0 group-focus-visible:opacity-40"
              />
              {a.kind === "segmental-bronchus" && (
                <circle cx={e.x} cy={e.y} r={selected ? 11 : 8} fill={selected ? "var(--accent)" : "var(--surface)"} stroke={sideColour} strokeWidth={3} />
              )}
              {showLabels && !compact && (
                <text
                  x={e.x + labelDx(a, e)}
                  y={e.y + labelDy(a)}
                  textAnchor={labelAnchor(e)}
                  className={`pointer-events-none text-[22px] ${selected ? "fill-ink font-bold" : "fill-ink"}`}
                  style={{ paintOrder: "stroke", stroke: "var(--bg)", strokeWidth: 5 }}
                >
                  {a.code ?? DIAGRAM_LABELS[a.id] ?? shortLabel(a)}
                </text>
              )}
            </g>
          );
        })}

      {/* Carina marker */}
      {(() => {
        const c = AIRWAYS.find((a) => a.kind === "carina");
        if (!c) return null;
        const p = AIRWAY_ENDPOINTS[c.id]!;
        const selected = c.id === selectedId;
        return (
          <g
            role={compact ? undefined : "button"}
            tabIndex={compact ? undefined : 0}
            aria-label={compact ? undefined : accessibleName(c)}
            aria-pressed={compact ? undefined : selected}
            data-airway-id={c.id}
            onClick={() => onSelect(c.id)}
            onKeyDown={(ev) => handleKey(ev, c.id)}
            className="group cursor-pointer outline-none"
          >
            <circle cx={p.x} cy={p.y} r={20} fill="transparent" />
            <path
              d={`M${p.x - 11} ${p.y} L${p.x} ${p.y - 11} L${p.x + 11} ${p.y} L${p.x} ${p.y + 11} Z`}
              fill={selected || highlight.has(c.id) ? "var(--accent)" : "var(--surface)"}
              stroke="var(--ink)"
              strokeWidth={2.5}
            />
            <circle cx={p.x} cy={p.y} r={18} fill="none" stroke="var(--accent)" strokeWidth={4} className="opacity-0 group-focus-visible:opacity-60" />
            {showLabels && !compact && (
              <text x={p.x + 22} y={p.y + 30} className="pointer-events-none fill-ink text-[22px]" style={{ paintOrder: "stroke", stroke: "var(--bg)", strokeWidth: 5 }}>
                Carina
              </text>
            )}
          </g>
        );
      })()}
    </svg>
  );
}

function safePath(id: string): string[] {
  try {
    return getPath(id).map((a) => a.id);
  } catch {
    return [];
  }
}

function labelAnchor(e: Pt): "start" | "end" | "middle" {
  if (e.x < 470) return "end";
  if (e.x > 530) return "start";
  return "middle";
}
function labelDx(a: AirwayStructure, e: Pt): number {
  const off = a.kind === "segmental-bronchus" ? 14 : 12;
  if (e.x < 470) return -off;
  if (e.x > 530) return off;
  return 0;
}
function labelDy(a: AirwayStructure): number {
  return a.kind === "segmental-bronchus" ? 6 : -10;
}
