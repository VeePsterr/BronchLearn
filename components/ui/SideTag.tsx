import type { Side } from "@/lib/contentSchemas";

/** Side label that never relies on colour alone: always shows R / L / Midline text. */
export function SideTag({ side }: { side: Side }) {
  const cfg = {
    right: { letter: "R", text: "Right", cls: "border-side-r bg-side-r-soft text-side-r" },
    left: { letter: "L", text: "Left", cls: "border-side-l bg-side-l-soft text-side-l" },
    midline: { letter: "M", text: "Midline", cls: "border-line bg-surface-2 text-muted" },
  }[side];
  return (
    <span className={`inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-xs font-bold ${cfg.cls}`}>
      <span aria-hidden="true">{cfg.letter}</span>
      <span>{cfg.text}</span>
    </span>
  );
}
