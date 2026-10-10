/**
 * Marker positions for the ORIGINAL schematic station map (viewBox 0 0 800 640).
 * Anterior view, patient's right on the viewer's left. Positions are approximate teaching
 * positions only; they do not define station boundaries (see the station card text).
 */
export const STATION_MARKERS: Record<string, { x: number; y: number; posterior?: boolean }[]> = {
  "1R": [{ x: 322, y: 52 }],
  "1L": [{ x: 478, y: 52 }],
  "2R": [{ x: 340, y: 178 }],
  "2L": [{ x: 462, y: 150 }],
  "3a": [{ x: 238, y: 168 }],
  "3p": [{ x: 400, y: 112, posterior: true }],
  "4R": [{ x: 342, y: 262 }],
  "4L": [{ x: 456, y: 258 }],
  "5": [{ x: 566, y: 300 }],
  "6": [{ x: 612, y: 210 }],
  "7": [{ x: 400, y: 352 }],
  "8": [{ x: 470, y: 486, posterior: true }],
  "9": [
    { x: 262, y: 574 },
    { x: 570, y: 574 },
  ],
  "10R": [{ x: 286, y: 324 }],
  "10L": [{ x: 548, y: 352 }],
  "11R": [{ x: 248, y: 416 }],
  "11L": [{ x: 576, y: 436 }],
  "12": [
    { x: 196, y: 372 },
    { x: 626, y: 404 },
  ],
  "13": [
    { x: 156, y: 330 },
    { x: 666, y: 366 },
  ],
  "14": [
    { x: 118, y: 292 },
    { x: 704, y: 328 },
  ],
};
