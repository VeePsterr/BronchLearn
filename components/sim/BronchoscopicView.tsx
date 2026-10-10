import type { Choice } from "@/lib/navigation/simulator";
import { getAirway } from "@/lib/navigation/tree";

/**
 * ORIGINAL simplified "bronchoscopic view". This is a schematic simulation:
 * openings are spaced evenly for legibility and do NOT represent true anatomical positions,
 * clock-face orientation, size or the view through a real bronchoscope.
 */
export function BronchoscopicView({
  currentId,
  choices,
  showLabels,
  numbered,
  onChoose,
}: {
  currentId: string;
  choices: Choice[];
  showLabels: boolean;
  numbered: boolean;
  onChoose?: (id: string) => void;
}) {
  const current = getAirway(currentId);
  const n = choices.length;
  const R = n <= 1 ? 0 : n === 2 ? 70 : 92;
  const r = n <= 1 ? 62 : n <= 3 ? 46 : n <= 4 ? 38 : 32;
  return (
    <figure className="m-0">
      <svg
        key={currentId}
        viewBox="0 0 320 320"
        className="bl-advance mx-auto h-auto w-full max-w-[360px]"
        role="img"
        aria-label={`Simulated learning view at ${current?.name ?? currentId}: ${n === 0 ? "no further branches modeled" : `${n} opening${n > 1 ? "s" : ""}`}. Schematic only; openings are not in true anatomical positions.`}
      >
        <defs>
          <radialGradient id="wall" cx="50%" cy="50%" r="50%">
            <stop offset="55%" stopColor="#e6a49a" />
            <stop offset="100%" stopColor="#7d3a33" />
          </radialGradient>
          <radialGradient id="lumen" cx="50%" cy="45%" r="60%">
            <stop offset="0%" stopColor="#1a0d0b" />
            <stop offset="100%" stopColor="#4a211d" />
          </radialGradient>
        </defs>
        <circle cx="160" cy="160" r="150" fill="url(#wall)" />
        <circle cx="160" cy="160" r="150" fill="none" stroke="#2a2a2a" strokeWidth="10" />
        {n === 0 && (
          <text x="160" y="166" textAnchor="middle" className="fill-[#3b1915] text-[15px] font-semibold">
            End of modeled branches
          </text>
        )}
        {choices.map((c, i) => {
          const angle = n === 2 ? (i === 0 ? Math.PI : 0) : (2 * Math.PI * i) / n - Math.PI / 2;
          const cx = 160 + R * Math.cos(angle);
          const cy = 160 + R * Math.sin(angle);
          const a = getAirway(c.id);
          const text = numbered ? String(i + 1) : showLabels ? (a?.code ?? shortName(a?.name ?? c.id)) : "";
          return (
            <g
              key={c.id}
              data-opening={c.id}
              onClick={onChoose ? () => onChoose(c.id) : undefined}
              className={onChoose ? "cursor-pointer" : undefined}
              aria-hidden="true"
            >
              <ellipse cx={cx} cy={cy} rx={r} ry={r * 0.86} fill="url(#lumen)" stroke="#c97f74" strokeWidth="3" />
              {text && (
                <text
                  x={cx}
                  y={cy + 6}
                  textAnchor="middle"
                  className="fill-white text-[16px] font-bold"
                  style={{ paintOrder: "stroke", stroke: "#000", strokeWidth: 3 }}
                >
                  {text}
                </text>
              )}
              {a && a.side !== "midline" && (
                <text x={cx} y={cy + r + 18} textAnchor="middle" className="fill-white text-[13px] font-bold" style={{ paintOrder: "stroke", stroke: "#000", strokeWidth: 3 }}>
                  {a.side === "right" ? "R" : "L"}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <figcaption className="mt-2 text-center text-sm text-muted">
        Simulated learning view (original schematic). Openings are evenly spaced for clarity and are{" "}
        <strong className="text-ink">not</strong> shown in their true anatomical position or orientation.
      </figcaption>
    </figure>
  );
}

function shortName(name: string): string {
  const map: Record<string, string> = {
    "Carina of trachea": "Carina",
    "Right main bronchus": "RMB",
    "Left main bronchus": "LMB",
    "Right superior lobar bronchus": "RUL",
    "Intermediate bronchus": "BI",
    "Middle lobar bronchus": "RML",
    "Right inferior lobar bronchus": "RLL",
    "Left superior lobar bronchus": "LUL",
    "Left inferior lobar bronchus": "LLL",
    "Upper division bronchus of left upper lobe": "Upper div.",
    "Lingular bronchus": "Lingular",
  };
  return map[name] ?? name;
}
