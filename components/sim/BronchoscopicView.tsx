import { getViewLayout } from "@/content/airways/bronchoscopicViews";
import { getCarina } from "@/content/airways/carinas";
import type { Choice } from "@/lib/navigation/simulator";
import { getAirway } from "@/lib/navigation/tree";

/**
 * ORIGINAL procedurally rendered "simulated learning view". Everything here (mucosa, vessels,
 * rings, openings, ridges) is generated from code and a seeded random number generator; no
 * photograph, poster or video frame is copied or traced.
 *
 * Opening positions come from draft layout data (content/airways/bronchoscopicViews.ts) and are
 * not patient-specific. Airways without layout data use evenly spaced openings.
 */

const SIZE = 400;
const C = SIZE / 2;
const SCALE = 168;

interface Opening {
  id: string;
  cx: number;
  cy: number;
  r: number;
  label: string;
  side: "right" | "left" | "midline";
}

function rng(seedText: string) {
  let h = 2166136261;
  for (const ch of seedText) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  let s = h >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export function layoutOpenings(currentId: string, choices: Choice[]): { openings: Opening[]; fromLayout: boolean; carinaId: string | null } {
  const layout = getViewLayout(currentId);
  const ids = choices.map((c) => c.id);
  const fromLayout = Boolean(layout && ids.every((id) => layout.openings.some((o) => o.childId === id)));
  const label = (id: string) => {
    const a = getAirway(id);
    return a?.code ?? SHORT[id] ?? a?.name ?? id;
  };
  const side = (id: string) => getAirway(id)?.side ?? "midline";
  if (fromLayout && layout) {
    return {
      fromLayout,
      carinaId: layout.carinaId,
      openings: ids.map((id) => {
        const o = layout.openings.find((x) => x.childId === id)!;
        return { id, cx: C + o.x * SCALE, cy: C + o.y * SCALE, r: o.r * SCALE, label: label(id), side: side(id) };
      }),
    };
  }
  const n = ids.length;
  const R = n <= 1 ? 0 : n === 2 ? 0.42 : 0.5;
  const r = n <= 1 ? 0.36 : n <= 3 ? 0.24 : n <= 4 ? 0.2 : 0.17;
  return {
    fromLayout: false,
    carinaId: layout?.carinaId ?? null,
    openings: ids.map((id, i) => {
      const angle = n === 2 ? (i === 0 ? Math.PI : 0) : (2 * Math.PI * i) / n - Math.PI / 2;
      return { id, cx: C + R * SCALE * Math.cos(angle), cy: C + R * SCALE * Math.sin(angle), r: r * SCALE, label: label(id), side: side(id) };
    }),
  };
}

const SHORT: Record<string, string> = {
  carina: "Main carina",
  rmb: "RMB",
  lmb: "LMB",
  rul: "RUL",
  bi: "BI",
  rml: "RML",
  rll: "RLL",
  lul: "LUL",
  lll: "LLL",
  "lul-upper-division": "UDB",
  lingular: "LIN",
};

/** Octagon-like frame typical of a video bronchoscope image. */
const FRAME = (() => {
  const cut = 58;
  return `M${cut} 0 H${SIZE - cut} L${SIZE} ${cut} V${SIZE - cut} L${SIZE - cut} ${SIZE} H${cut} L0 ${SIZE - cut} V${cut} Z`;
})();

function vesselPaths(rand: () => number, count: number): string[] {
  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    const a = rand() * Math.PI * 2;
    const r0 = SIZE * (0.42 + rand() * 0.12);
    let x = C + Math.cos(a) * r0;
    let y = C + Math.sin(a) * r0;
    let d = `M${x.toFixed(1)} ${y.toFixed(1)}`;
    let heading = a + Math.PI + (rand() - 0.5) * 1.2;
    const steps = 3 + Math.floor(rand() * 3);
    for (let s = 0; s < steps; s++) {
      const len = 18 + rand() * 30;
      heading += (rand() - 0.5) * 1.1;
      const nx = x + Math.cos(heading) * len;
      const ny = y + Math.sin(heading) * len;
      const cx1 = x + Math.cos(heading + (rand() - 0.5)) * len * 0.5;
      const cy1 = y + Math.sin(heading + (rand() - 0.5)) * len * 0.5;
      d += ` Q${cx1.toFixed(1)} ${cy1.toFixed(1)} ${nx.toFixed(1)} ${ny.toFixed(1)}`;
      x = nx;
      y = ny;
    }
    out.push(d);
  }
  return out;
}

export function BronchoscopicView({
  currentId,
  choices,
  showLabels,
  numbered,
  onChoose,
  focusId,
}: {
  currentId: string;
  choices: Choice[];
  showLabels: boolean;
  numbered: boolean;
  onChoose?: (id: string) => void;
  /** Opening the camera is moving into (drives the advance animation). */
  focusId?: string | null;
}) {
  const current = getAirway(currentId);
  const { openings, fromLayout, carinaId } = layoutOpenings(currentId, choices);
  const carina = carinaId ? getCarina(carinaId) : undefined;
  const rand = rng(currentId);
  const uid = currentId.replace(/[^A-Za-z0-9]/g, "_");
  const vessels = vesselPaths(rand, 9);
  const fine = vesselPaths(rand, 14);
  const centroid = openings.length
    ? { x: openings.reduce((s, o) => s + o.cx, 0) / openings.length, y: openings.reduce((s, o) => s + o.cy, 0) / openings.length }
    : { x: C, y: C };
  const ringed = ["trachea", "carina", "rmb", "lmb", "bi"].includes(currentId);
  const focus = focusId ? openings.find((o) => o.id === focusId) : undefined;
  const isTrachea = currentId === "trachea";

  // Carina ridge between the two openings it separates.
  let ridge: { x: number; y: number; angle: number; len: number } | null = null;
  if (carina) {
    const a = openings.find((o) => o.id === carina.separates[0]);
    const b = openings.find((o) => o.id === carina.separates[1]);
    if (a && b) {
      const dx = b.cx - a.cx;
      const dy = b.cy - a.cy;
      const dist = Math.hypot(dx, dy) || 1;
      const ux = dx / dist;
      const uy = dy / dist;
      // Point on the gap between the two rims.
      const gapStart = { x: a.cx + ux * a.r, y: a.cy + uy * a.r };
      const gapEnd = { x: b.cx - ux * b.r, y: b.cy - uy * b.r };
      ridge = {
        x: (gapStart.x + gapEnd.x) / 2,
        y: (gapStart.y + gapEnd.y) / 2,
        angle: (Math.atan2(dy, dx) * 180) / Math.PI + 90,
        len: Math.min(a.r, b.r) * 1.5,
      };
    }
  }

  const ariaLabel = [
    `Simulated learning view at ${current?.name ?? currentId}.`,
    openings.length === 0 ? "No further branches are modeled." : `Openings: ${openings.map((o) => `${o.label}${o.side !== "midline" ? ` (${o.side})` : ""}`).join(", ")}.`,
    carina ? `${carina.label === "Main carina" ? "The main carina" : `Secondary carina ${carina.label}`} separates them.` : "",
    "Original procedural rendering; not a patient image.",
  ].join(" ");

  return (
    <figure className="m-0">
      <div className="relative mx-auto aspect-square w-full max-w-[420px] overflow-hidden rounded-md bg-black">
        <svg
          key={currentId}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className={`h-full w-full ${focus ? "bl-dive" : "bl-arrive"}`}
          style={focus ? ({ transformOrigin: `${(focus.cx / SIZE) * 100}% ${(focus.cy / SIZE) * 100}%` } as React.CSSProperties) : undefined}
          role="img"
          aria-label={ariaLabel}
          data-view={currentId}
        >
          <defs>
            <clipPath id={`frame-${uid}`}>
              <path d={FRAME} />
            </clipPath>
            <radialGradient id={`mucosa-${uid}`} cx={centroid.x / SIZE} cy={centroid.y / SIZE} r="0.75">
              <stop offset="0%" stopColor="#f3b7a2" />
              <stop offset="35%" stopColor="#e09078" />
              <stop offset="70%" stopColor="#b8604a" />
              <stop offset="100%" stopColor="#4a160e" />
            </radialGradient>
            <radialGradient id={`lumen-${uid}`} cx="0.5" cy="0.55" r="0.55">
              <stop offset="0%" stopColor="#050101" />
              <stop offset="55%" stopColor="#1c0704" />
              <stop offset="78%" stopColor="#4a1a10" />
              <stop offset="100%" stopColor="#b5604a" />
            </radialGradient>
            <radialGradient id={`vignette-${uid}`} cx="0.5" cy="0.5" r="0.62">
              <stop offset="60%" stopColor="#000" stopOpacity="0" />
              <stop offset="100%" stopColor="#000" stopOpacity="0.75" />
            </radialGradient>
            <linearGradient id={`ridge-${uid}`} x1="0" x2="1">
              <stop offset="0%" stopColor="#ffe6da" stopOpacity="0" />
              <stop offset="50%" stopColor="#fff1ea" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#ffe6da" stopOpacity="0" />
            </linearGradient>
            <filter id={`texture-${uid}`} x="0" y="0" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.028" numOctaves="4" seed={Math.floor(rand() * 1000)} result="noise" />
              <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0.45  0 0 0 0 0.08  0 0 0 0 0.05  0 0 0 0.55 -0.12" />
            </filter>
            {/* Wet, bumpy mucosa: procedural noise used as a height map, lit diffusely and specularly */}
            <filter id={`wet-${uid}`} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
              <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="4" seed={Math.floor(rand() * 1000)} result="n" />
              <feDiffuseLighting in="n" surfaceScale="2.6" diffuseConstant="1.05" lightingColor="#ffe0d4" result="d">
                <feDistantLight azimuth="230" elevation="58" />
              </feDiffuseLighting>
              <feSpecularLighting in="n" surfaceScale="3.4" specularConstant="0.75" specularExponent="26" lightingColor="#ffffff" result="sp">
                <fePointLight x={C} y={C - 30} z="190" />
              </feSpecularLighting>
              <feBlend in="SourceGraphic" in2="d" mode="multiply" result="m" />
              <feComposite in="sp" in2="m" operator="arithmetic" k1="0" k2="0.28" k3="1" k4="0" result="lit" />
              <feComposite in="lit" in2="SourceAlpha" operator="in" />
            </filter>
            <radialGradient id={`farwall-${uid}`} cx="0.5" cy="0.3" r="0.6">
              <stop offset="0%" stopColor="#c86a52" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#c86a52" stopOpacity="0" />
            </radialGradient>
            <filter id={`soft-${uid}`}>
              <feGaussianBlur stdDeviation="2.2" />
            </filter>
            <filter id={`blur6-${uid}`}>
              <feGaussianBlur stdDeviation="6" />
            </filter>
          </defs>

          <g clipPath={`url(#frame-${uid})`}>
            <g filter={`url(#wet-${uid})`}>
            <rect width={SIZE} height={SIZE} fill={`url(#mucosa-${uid})`} />
            <rect width={SIZE} height={SIZE} filter={`url(#texture-${uid})`} opacity="0.35" />

            {/* Cartilage rings converging towards the openings */}
            {ringed &&
              Array.from({ length: isTrachea ? 9 : 5 }, (_, i) => {
                const n = isTrachea ? 10 : 6;
                const t = 1 - Math.pow(1 - (i + 1) / n, 1.7);
                const rr = SIZE * (0.66 - t * 0.5) * (0.97 + rand() * 0.06);
                return (
                  <g key={i} opacity={0.18 + t * 0.25}>
                    <ellipse cx={C + (centroid.x - C) * t} cy={C + (centroid.y - C) * t} rx={rr} ry={rr * 0.86} fill="none" stroke="#ffd8c8" strokeWidth={10 * (1 - t) + 2} filter={`url(#soft-${uid})`} />
                    <ellipse cx={C + (centroid.x - C) * t} cy={C + (centroid.y - C) * t + 6 * (1 - t)} rx={rr * 0.97} ry={rr * 0.83} fill="none" stroke="#6e2618" strokeOpacity="0.35" strokeWidth={4 * (1 - t) + 1} filter={`url(#soft-${uid})`} />
                  </g>
                );
              })}

            {/* Superficial vessels */}
            <g fill="none" strokeLinecap="round">
              {vessels.map((d, i) => <path key={`v${i}`} d={d} stroke="#9c2a1e" strokeOpacity="0.45" strokeWidth={1.6} />)}
              {fine.map((d, i) => <path key={`f${i}`} d={d} stroke="#b23a2a" strokeOpacity="0.28" strokeWidth={0.8} />)}
            </g>
            </g>

            {/* Openings */}
            {openings.map((o, i) => {
              const tilt = (Math.atan2(o.cy - C, o.cx - C) * 180) / Math.PI;
              return (
                <g key={o.id} data-opening={o.id} onClick={onChoose ? () => onChoose(o.id) : undefined} className={onChoose ? "cursor-pointer" : undefined}>
                  <ellipse cx={o.cx} cy={o.cy + o.r * 0.12} rx={o.r * 1.18} ry={o.r * 1.05} fill="#3a0f08" opacity="0.55" filter={`url(#blur6-${uid})`} transform={`rotate(${tilt} ${o.cx} ${o.cy})`} />
                  <ellipse cx={o.cx} cy={o.cy} rx={o.r} ry={o.r * 0.88} fill={`url(#lumen-${uid})`} transform={`rotate(${tilt} ${o.cx} ${o.cy})`} />
                  {/* far wall catching light, giving a sense of depth */}
                  <ellipse cx={o.cx + (C - o.cx) * 0.08} cy={o.cy - o.r * 0.38} rx={o.r * 0.62} ry={o.r * 0.34} fill={`url(#farwall-${uid})`} opacity="0.55" filter={`url(#soft-${uid})`} transform={`rotate(${tilt} ${o.cx} ${o.cy})`} />
                  {/* depth rings inside the lumen */}
                  {[0.72, 0.5, 0.32].map((k) => (
                    <ellipse
                      key={k}
                      cx={o.cx + (C - o.cx) * (1 - k) * 0.06}
                      cy={o.cy + (C - o.cy) * (1 - k) * 0.06 + o.r * 0.06}
                      rx={o.r * k}
                      ry={o.r * k * 0.86}
                      fill="none"
                      stroke="#8a3a2a"
                      strokeOpacity={0.35 * k}
                      strokeWidth={Math.max(1, o.r * 0.05 * k)}
                      transform={`rotate(${tilt} ${o.cx} ${o.cy})`}
                    />
                  ))}
                  {/* distant main carina seen from the trachea */}
                  {isTrachea && (
                    <g>
                      <ellipse cx={o.cx} cy={o.cy + o.r * 0.06} rx={o.r * 0.82} ry={o.r * 0.66} fill="#7b2e20" opacity="0.65" filter={`url(#soft-${uid})`} />
                      <ellipse cx={o.cx - o.r * 0.36} cy={o.cy + o.r * 0.08} rx={o.r * 0.3} ry={o.r * 0.34} fill={`url(#lumen-${uid})`} filter={`url(#soft-${uid})`} />
                      <ellipse cx={o.cx + o.r * 0.37} cy={o.cy + o.r * 0.12} rx={o.r * 0.31} ry={o.r * 0.35} fill={`url(#lumen-${uid})`} filter={`url(#soft-${uid})`} />
                      <ellipse cx={o.cx} cy={o.cy + o.r * 0.1} rx={o.r * 0.06} ry={o.r * 0.36} fill={`url(#ridge-${uid})`} transform={`rotate(90 ${o.cx} ${o.cy + o.r * 0.1})`} opacity="0" />
                      <ellipse cx={o.cx + o.r * 0.01} cy={o.cy + o.r * 0.1} rx={o.r * 0.055} ry={o.r * 0.38} fill="#f0b3a0" filter={`url(#soft-${uid})`} />
                    </g>
                  )}
                  {/* rim light */}
                  <path
                    d={`M${o.cx - o.r * 0.92} ${o.cy - o.r * 0.1} A ${o.r} ${o.r * 0.88} 0 0 1 ${o.cx + o.r * 0.92} ${o.cy - o.r * 0.1}`}
                    fill="none"
                    stroke="#ffe3d6"
                    strokeOpacity="0.55"
                    strokeWidth={Math.max(1.5, o.r * 0.06)}
                    filter={`url(#soft-${uid})`}
                    transform={`rotate(${tilt} ${o.cx} ${o.cy})`}
                  />
                  <ellipse cx={o.cx - o.r * 0.55} cy={o.cy - o.r * 0.72} rx={o.r * 0.16} ry={o.r * 0.06} fill="#fff" opacity="0.55" filter={`url(#soft-${uid})`} />
                  {(showLabels || numbered) && (
                    <text
                      x={o.cx}
                      y={o.cy + (isTrachea ? o.r + 26 : 6)}
                      textAnchor="middle"
                      className="text-[17px] font-semibold"
                      fill="#fff"
                      style={{ paintOrder: "stroke", stroke: "rgba(0,0,0,0.75)", strokeWidth: 4 }}
                    >
                      {numbered ? String(i + 1) : isTrachea ? "Main carina ahead" : o.label}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Carina ridge highlight and label */}
            {ridge && carina && (
              <g data-carina={carina.id}>
                <ellipse
                  cx={ridge.x}
                  cy={ridge.y}
                  rx={ridge.len / 2}
                  ry={Math.max(3, ridge.len * 0.07)}
                  fill={`url(#ridge-${uid})`}
                  transform={`rotate(${ridge.angle} ${ridge.x} ${ridge.y})`}
                  filter={`url(#soft-${uid})`}
                />
                {showLabels && !numbered && (
                  <g>
                    <rect x={ridge.x - 34} y={ridge.y - 12} width={68} height={22} rx={11} fill="rgba(10,30,36,0.82)" stroke="#9ee6ee" strokeWidth="1.2" />
                    <text x={ridge.x} y={ridge.y + 4} textAnchor="middle" className="text-[13px] font-bold" fill="#e6fbfd">
                      {carina.label === "Main carina" ? "Carina" : carina.label}
                    </text>
                  </g>
                )}
              </g>
            )}

            <rect width={SIZE} height={SIZE} fill={`url(#vignette-${uid})`} pointerEvents="none" />
          </g>
          {/* screen-side markers */}
          <g pointerEvents="none" className="text-[15px] font-bold">
            <text x="70" y="26" fill="#fff" style={{ paintOrder: "stroke", stroke: "#000", strokeWidth: 3 }}>L</text>
            <text x={SIZE - 78} y="26" fill="#fff" style={{ paintOrder: "stroke", stroke: "#000", strokeWidth: 3 }}>R</text>
          </g>
        </svg>
      </div>
      <figcaption className="mt-2 text-center text-sm text-muted">
        Simulated learning view (original computer-generated rendering, not a patient image). Shown as seen from the head of the
        patient: the patient&apos;s <strong className="text-ink">left is on the left</strong> of the screen and{" "}
        <strong className="text-ink">right on the right</strong>.{" "}
        {fromLayout
          ? "Opening positions are approximate and draft (awaiting bronchoscopist review)."
          : "Opening positions at this level are not modeled; openings are evenly spaced."}
      </figcaption>
    </figure>
  );
}
