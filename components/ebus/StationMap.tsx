"use client";

import type { KeyboardEvent } from "react";
import type { LymphNodeStation } from "@/lib/contentSchemas";
import { STATION_MARKERS } from "./stationLayout";

/**
 * ORIGINAL schematic of the central airway, great vessels, oesophagus and IASLC station markers.
 * Drawn for this project; not traced from any published figure. Not to scale.
 */
export function StationMap({
  stations,
  visibleCodes,
  selectedCode,
  onSelect,
  showLabels,
}: {
  stations: LymphNodeStation[];
  visibleCodes: Set<string>;
  selectedCode: string | null;
  onSelect: (code: string) => void;
  showLabels: boolean;
}) {
  const key = (e: KeyboardEvent, code: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect(code);
    }
  };
  return (
    <svg
      viewBox="0 0 800 640"
      role="group"
      aria-label="Schematic IASLC lymph-node station map. Anterior view, patient's right on the left of the image. Marker positions are approximate."
      className="h-auto w-full"
    >
      <title>Schematic lymph-node station map</title>
      <g aria-hidden="true">
        {/* Oesophagus (posterior) */}
        <rect x="404" y="30" width="44" height="560" rx="20" fill="var(--surface-2)" stroke="var(--muted)" strokeDasharray="6 5" strokeWidth="2" />
        {/* Descending aorta (posterior, left) */}
        <path d="M528 262 L548 600" stroke="var(--vessel)" strokeOpacity="0.35" strokeWidth="34" strokeLinecap="round" fill="none" />
        {/* Azygos vein arching over the right main bronchus */}
        <path d="M250 560 C 246 420, 270 300, 318 272 C 330 266, 338 262, 344 250" stroke="var(--vein)" strokeOpacity="0.75" strokeWidth="12" fill="none" strokeLinecap="round" />
        {/* SVC */}
        <rect x="300" y="96" width="34" height="200" rx="14" fill="var(--vein)" fillOpacity="0.6" />
        {/* Left brachiocephalic (innominate) vein crossing anterior to the trachea */}
        <path d="M560 112 C 480 140, 400 150, 318 120" stroke="var(--vein)" strokeOpacity="0.6" strokeWidth="18" fill="none" strokeLinecap="round" />
        {/* Trachea */}
        <rect x="372" y="20" width="56" height="282" rx="16" fill="var(--surface)" stroke="var(--ink)" strokeWidth="3" />
        {Array.from({ length: 10 }, (_, i) => (
          <line key={i} x1="376" x2="424" y1={40 + i * 26} y2={40 + i * 26} stroke="var(--line)" strokeWidth="3" />
        ))}
        {/* Main bronchi and lobar stubs */}
        <path d="M386 296 L304 364 L230 346 M304 364 L292 452 L254 490 M292 452 L304 520" stroke="var(--ink)" strokeWidth="26" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M386 296 L304 364 L230 346 M304 364 L292 452 L254 490 M292 452 L304 520" stroke="var(--surface)" strokeWidth="20" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M414 296 L522 400 L600 380 M522 400 L532 520" stroke="var(--ink)" strokeWidth="26" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M414 296 L522 400 L600 380 M522 400 L532 520" stroke="var(--surface)" strokeWidth="20" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        {/* Aortic arch and ascending aorta */}
        <path d="M352 430 L352 250 C 352 176, 500 160, 528 262" stroke="var(--vessel)" strokeOpacity="0.75" strokeWidth="34" fill="none" strokeLinecap="round" />
        {/* Pulmonary trunk and arteries */}
        <path d="M430 470 L470 400 L590 352 M452 430 L300 404" stroke="var(--vein)" strokeOpacity="0.45" strokeWidth="24" fill="none" strokeLinecap="round" />
        {/* Ligamentum arteriosum */}
        <line x1="500" y1="226" x2="520" y2="376" stroke="var(--ink)" strokeWidth="3" strokeDasharray="4 4" />
        {/* Inferior pulmonary veins */}
        <ellipse cx="270" cy="540" rx="26" ry="14" fill="var(--vein)" fillOpacity="0.45" />
        <ellipse cx="560" cy="540" rx="26" ry="14" fill="var(--vein)" fillOpacity="0.45" />
        {/* Diaphragm */}
        <path d="M60 620 C 240 580, 560 580, 740 620" stroke="var(--muted)" strokeWidth="3" fill="none" />

        {showLabels && (
          <g className="fill-muted text-[13px]">
            <text x="426" y="22" textAnchor="start" dx="30">Oesophagus (posterior, dashed)</text>
            <text x="236" y="92" textAnchor="end">SVC</text>
            <text x="566" y="104">L brachiocephalic (innominate) v.</text>
            <text x="300" y="168" textAnchor="end" className="sr-only">Trachea</text>
            <text x="352" y="462" textAnchor="middle">Asc. aorta</text>
            <text x="548" y="244">Aortic arch</text>
            <text x="216" y="560" textAnchor="end">Azygos v.</text>
            <text x="600" y="342">L pulm. artery</text>
            <text x="472" y="324">Lig. arteriosum</text>
            <text x="300" y="540" >Inf. pulm. vv.</text>
            <text x="200" y="336" textAnchor="end">RUL</text>
            <text x="252" y="510" textAnchor="end">BI</text>
            <text x="612" y="376">LUL</text>
            <text x="700" y="606" textAnchor="middle">Diaphragm</text>
          </g>
        )}
        <text x="30" y="40" className="fill-side-r text-[30px] font-bold">R</text>
        <text x="30" y="62" className="fill-muted text-[14px]">Patient&apos;s right</text>
        <text x="770" y="40" textAnchor="end" className="fill-side-l text-[30px] font-bold">L</text>
        <text x="770" y="62" textAnchor="end" className="fill-muted text-[14px]">Patient&apos;s left</text>
      </g>

      {stations.map((s) => {
        const markers = STATION_MARKERS[s.stationCode] ?? [];
        const visible = visibleCodes.has(s.stationCode);
        const selected = s.stationCode === selectedCode;
        return markers.map((m, i) => (
          <g
            key={`${s.stationCode}-${i}`}
            role={i === 0 ? "button" : undefined}
            tabIndex={i === 0 && visible ? 0 : undefined}
            aria-label={i === 0 ? `Station ${s.stationCode}, ${s.stationName}` : undefined}
            aria-pressed={i === 0 ? selected : undefined}
            aria-hidden={i === 0 ? undefined : true}
            aria-disabled={i === 0 && !visible ? true : undefined}
            data-station={s.stationCode}
            onClick={() => visible && onSelect(s.stationCode)}
            onKeyDown={(e) => key(e, s.stationCode)}
            className="group cursor-pointer outline-none"
            opacity={visible ? 1 : 0.18}
          >
            <circle cx={m.x} cy={m.y} r={26} fill="none" stroke="var(--accent)" strokeWidth="4" className="opacity-0 group-focus-visible:opacity-100" />
            <circle
              cx={m.x}
              cy={m.y}
              r={selected ? 21 : 18}
              fill={selected ? "var(--accent)" : "var(--surface)"}
              stroke={selected ? "var(--ink)" : "var(--accent)"}
              strokeWidth={3}
              strokeDasharray={m.posterior ? "5 3" : undefined}
            />
            <text x={m.x} y={m.y + 5} textAnchor="middle" className={`pointer-events-none text-[14px] font-bold ${selected ? "fill-[var(--on-accent)]" : "fill-ink"}`}>
              {s.stationCode}
            </text>
          </g>
        ));
      })}
    </svg>
  );
}
