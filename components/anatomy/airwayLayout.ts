/**
 * Coordinates for the ORIGINAL schematic airway tree (viewBox 0 0 1000 720).
 * Anterior view: the patient's right is on the viewer's left.
 * These positions are a teaching schematic only. They are not to scale and do not encode true
 * anatomical angles, lengths or bronchoscopic positions. This file is presentation, not content.
 */
export interface Pt { x: number; y: number }

export const TRACHEA_START: Pt = { x: 500, y: 24 };

export const AIRWAY_ENDPOINTS: Record<string, Pt> = {
  trachea: { x: 500, y: 188 },
  carina: { x: 500, y: 196 },
  rmb: { x: 420, y: 262 },
  rul: { x: 300, y: 232 },
  RB1: { x: 268, y: 110 },
  RB2: { x: 166, y: 168 },
  RB3: { x: 176, y: 292 },
  bi: { x: 402, y: 372 },
  rml: { x: 300, y: 424 },
  RB4: { x: 186, y: 440 },
  RB5: { x: 248, y: 528 },
  rll: { x: 402, y: 502 },
  RB6: { x: 470, y: 470 },
  RB7: { x: 456, y: 640 },
  RB8: { x: 296, y: 604 },
  RB9: { x: 344, y: 668 },
  RB10: { x: 408, y: 684 },
  lmb: { x: 600, y: 284 },
  lul: { x: 700, y: 254 },
  "lul-upper-division": { x: 762, y: 186 },
  "LB1+2": { x: 762, y: 78 },
  LB3: { x: 866, y: 200 },
  lingular: { x: 782, y: 334 },
  LB4: { x: 884, y: 334 },
  LB5: { x: 824, y: 436 },
  lll: { x: 608, y: 496 },
  LB6: { x: 540, y: 446 },
  LB7: { x: 540, y: 632 },
  LB8: { x: 612, y: 664 },
  "LB7+8": { x: 572, y: 650 },
  LB9: { x: 694, y: 624 },
  LB10: { x: 668, y: 690 },
};

export const STROKE_BY_KIND: Record<string, number> = {
  trachea: 26,
  carina: 0,
  "main-bronchus": 18,
  "intermediate-bronchus": 14,
  "lobar-bronchus": 12,
  "division-bronchus": 9,
  "segmental-bronchus": 6,
};

/** Short on-diagram labels for unnumbered structures (presentation only). */
export const DIAGRAM_LABELS: Record<string, string> = {
  trachea: "Trachea",
  rmb: "RMB",
  lmb: "LMB",
  rul: "RUL",
  bi: "BI",
  rml: "RML",
  rll: "RLL",
  lul: "LUL",
  "lul-upper-division": "Upper div.",
  lingular: "Lingular",
  lll: "LLL",
};
