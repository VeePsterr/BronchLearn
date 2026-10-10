import type { PatternMode } from "@/content/airways/airways";
import type { AirwayStructure } from "@/lib/contentSchemas";
import { getAirway, getAllChildren, isVisibleInMode } from "@/lib/navigation/tree";
import { MetaFooter } from "@/components/ui/MetaFooter";
import { ReviewBadge } from "@/components/ui/ReviewBadge";
import { SideTag } from "@/components/ui/SideTag";
import { AirwayBreadcrumb } from "./Breadcrumb";

const LOBE_NAMES: Record<string, string> = {
  RUL: "Right upper lobe",
  RML: "Right middle lobe",
  RLL: "Right lower lobe",
  LUL: "Left upper lobe",
  LLL: "Left lower lobe",
};

const CLASS_LABEL = {
  standard: "Standard term",
  common: "Common clinical term",
  variant: "Recognized variant / alternative pattern",
} as const;

export function AirwayInfoCard({
  airway,
  mode,
  onSelect,
}: {
  airway: AirwayStructure;
  mode: PatternMode;
  onSelect: (id: string) => void;
}) {
  const parent = airway.parentId ? getAirway(airway.parentId) : undefined;
  const children = getAllChildren(airway.id);
  return (
    <article aria-labelledby="airway-card-title" className="rounded-xl border border-line bg-surface p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          {airway.code && <p className="font-mono text-2xl font-bold text-accent">{airway.code}</p>}
          <h2 id="airway-card-title" className="text-xl font-semibold">{airway.name}</h2>
          {airway.latinName && <p className="text-sm italic text-muted">{airway.latinName}</p>}
        </div>
        <ReviewBadge status={airway.meta.reviewStatus} compact />
      </div>

      <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-[0.95rem]">
        <dt className="font-semibold">Side</dt>
        <dd><SideTag side={airway.side} /></dd>
        <dt className="font-semibold">Lobe</dt>
        <dd>{airway.lobe ? LOBE_NAMES[airway.lobe] : "—"}{airway.region ? ` (${airway.region})` : ""}</dd>
        <dt className="font-semibold">Classification</dt>
        <dd>{CLASS_LABEL[airway.anatomyClass]}</dd>
        <dt className="font-semibold">Parent airway</dt>
        <dd>
          {parent ? (
            <button type="button" className="underline underline-offset-2" onClick={() => onSelect(parent.id)}>
              {parent.code ?? parent.name}
            </button>
          ) : (
            "None (start of the airway tree)"
          )}
        </dd>
        <dt className="font-semibold">Child branches</dt>
        <dd>
          {children.length === 0 ? (
            "Not modeled beyond this level in the MVP"
          ) : (
            <ul className="flex flex-wrap gap-1.5">
              {children.map((c) => {
                const hidden = !isVisibleInMode(c, mode);
                return (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => onSelect(c.id)}
                      className={`rounded-md border px-2 py-0.5 text-sm hover:bg-surface-2 ${c.anatomyClass === "variant" ? "border-dashed" : ""} border-line`}
                    >
                      {c.code ?? c.name}
                      {c.anatomyClass === "variant" && <span className="text-muted"> (variant)</span>}
                      {hidden && <span className="sr-only"> (not shown in current pattern view)</span>}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </dd>
        {airway.aliases.length > 0 && (
          <>
            <dt className="font-semibold">Also called</dt>
            <dd>{airway.aliases.join("; ")}</dd>
          </>
        )}
        {airway.ta2Id && (
          <>
            <dt className="font-semibold">TA2 ID</dt>
            <dd>{airway.ta2Id}</dd>
          </>
        )}
      </dl>

      <div className="mt-4">
        <p className="mb-1 text-sm font-semibold">Path from the trachea</p>
        <AirwayBreadcrumb id={airway.id} onSelect={onSelect} />
      </div>

      <p className="mt-4">{airway.shortDescription}</p>

      {airway.variantNotes.length > 0 && (
        <div className="mt-3 rounded-lg bg-surface-2 p-3 text-sm">
          <p className="font-semibold">Variants and nomenclature</p>
          <ul className="ml-5 list-disc">
            {airway.variantNotes.map((n) => <li key={n}>{n}</li>)}
          </ul>
        </div>
      )}

      <MetaFooter meta={airway.meta} />
    </article>
  );
}
