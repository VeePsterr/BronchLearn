import { getPath } from "@/lib/navigation/tree";

/** Path from the trachea. The carina is shown as a landmark, not a step. */
export function AirwayBreadcrumb({ id, onSelect }: { id: string; onSelect?: (id: string) => void }) {
  const path = getPath(id).filter((a) => a.kind !== "carina" || a.id === id);
  return (
    <nav aria-label="Path from the trachea">
      <ol className="flex flex-wrap items-center gap-1 text-sm">
        {path.map((a, i) => {
          const last = i === path.length - 1;
          const label = a.code ?? a.name;
          return (
            <li key={a.id} className="flex items-center gap-1">
              {onSelect && !last ? (
                <button type="button" className="rounded px-1 underline underline-offset-2 hover:bg-surface-2" onClick={() => onSelect(a.id)}>
                  {label}
                </button>
              ) : (
                <span className={last ? "px-1 font-semibold" : "px-1"} aria-current={last ? "location" : undefined}>
                  {label}
                </span>
              )}
              {!last && <span aria-hidden="true" className="text-muted">→</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
