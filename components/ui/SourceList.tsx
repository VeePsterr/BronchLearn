import { getSource } from "@/content/sources/registry";

export function SourceList({ refs, label = "Sources" }: { refs: readonly string[]; label?: string }) {
  return (
    <div className="text-sm">
      <p className="font-semibold">{label}</p>
      <ul className="mt-1 space-y-1">
        {refs.map((id) => {
          const s = getSource(id);
          if (!s) return <li key={id} className="text-bad">Unknown source “{id}”</li>;
          return (
            <li key={id}>
              <a href={`/about#src-${s.id}`} className="underline underline-offset-2">
                {s.shortTitle}
              </a>
              {s.accessStatus === "not-accessible" && (
                <span className="text-muted"> (not yet accessed by this project)</span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
