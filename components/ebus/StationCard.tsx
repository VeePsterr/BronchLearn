import type { AccessLevel, LymphNodeStation, SensitiveText } from "@/lib/contentSchemas";
import { getZone } from "@/content/stations/zones";
import { isSensitiveDisplayable } from "@/lib/content/display";
import { MetaFooter } from "@/components/ui/MetaFooter";
import { DraftNotice, ReviewBadge } from "@/components/ui/ReviewBadge";

const ACCESS_TEXT: Record<AccessLevel, { icon: string; text: string }> = {
  conventional: { icon: "●", text: "Conventionally reached" },
  "not-conventional": { icon: "○", text: "Not conventionally reached" },
  variable: { icon: "◐", text: "Variable / non-standard" },
  unknown: { icon: "?", text: "Not yet sourced" },
};

const LATERALITY = { right: "Right", left: "Left", midline: "Midline / not lateralized", bilateral: "Both sides (not modeled separately)" } as const;

function Row({ label, value }: { label: string; value: string | null }) {
  return (
    <>
      <dt className="font-semibold">{label}</dt>
      <dd>{value ?? <span className="text-muted">Not defined in the source text</span>}</dd>
    </>
  );
}

function Sensitive({ label, field }: { label: string; field: SensitiveText }) {
  if (isSensitiveDisplayable(field)) {
    return (
      <div>
        <p className="font-semibold">{label}</p>
        <p>{field.text}</p>
        <p className="text-sm text-muted">Reviewed by {field.reviewerName} ({field.reviewerRole}), {field.reviewedDate}</p>
      </div>
    );
  }
  return (
    <div data-sensitive-hidden={label}>
      <p className="font-semibold">{label}</p>
      <p className="text-muted">
        <span aria-hidden="true">🔒 </span>Unavailable. Awaiting review by an appropriately qualified bronchoscopist.
      </p>
    </div>
  );
}

export function StationCard({ station }: { station: LymphNodeStation }) {
  const zone = getZone(station.zone);
  const access = station.accessibleBy;
  return (
    <article aria-labelledby="station-title" className="space-y-4 rounded-xl border border-line bg-surface p-5 shadow-sm">
      <header className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-mono text-2xl font-bold text-accent">Station {station.stationCode}</p>
          <h2 id="station-title" className="text-xl font-semibold">{station.stationName}</h2>
          <p className="text-sm text-muted">
            {zone?.name ?? station.zone} · {LATERALITY[station.laterality]}
            {zone?.meta.reviewStatus === "draft-unverified" && " · zone grouping draft-unverified"}
          </p>
        </div>
      </header>

      <section aria-labelledby="anat-h" className="rounded-lg border border-line p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 id="anat-h" className="font-semibold">1 · Station anatomy (IASLC map definition)</h3>
          <ReviewBadge status={station.reviewStatus} compact />
        </div>
        <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-[0.95rem]">
          <Row label="Superior" value={station.superiorBoundary} />
          <Row label="Inferior" value={station.inferiorBoundary} />
          {station.medialBoundary && <Row label="Medial / midline" value={station.medialBoundary} />}
          {station.lateralBoundary && <Row label="Lateral" value={station.lateralBoundary} />}
          {station.otherBoundaryNotes && <Row label="Other" value={station.otherBoundaryNotes} />}
          <Row label="Airway relationship" value={station.relationshipToAirway} />
          <Row label="Vascular relationship" value={station.relationshipToVessels} />
        </dl>
        {station.commonConfusions.length > 0 && (
          <div className="mt-3 rounded-lg bg-surface-2 p-3 text-sm">
            <p className="font-semibold">Common confusions</p>
            <ul className="ml-5 list-disc">
              {station.commonConfusions.map((c) => <li key={c}>{c}</li>)}
            </ul>
          </div>
        )}
        <MetaFooter
          meta={{
            sourceRefs: station.sourceRefs,
            reviewStatus: station.reviewStatus,
            lastReviewedDate: station.lastReviewedDate,
            reviewerName: station.reviewerName,
            reviewerRole: station.reviewerRole,
            uncertaintyNotes: station.uncertaintyNotes,
          }}
        />
      </section>

      <section aria-labelledby="access-h" className="rounded-lg border border-line p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 id="access-h" className="font-semibold">2 · Modality access (separate from anatomy)</h3>
          <ReviewBadge status={access.meta.reviewStatus} compact />
        </div>
        <p className="mt-1 text-sm text-muted">
          Whether a modality conventionally reaches a station is not the same as where the station is, and neither decides
          where a particular patient should be sampled. Access is never inferred from distance on the map.
        </p>
        {access.meta.reviewStatus === "draft-unverified" && (
          <div className="mt-2">
            <DraftNotice>These access values are placeholders that have not been checked against the endosonography guidelines.</DraftNotice>
          </div>
        )}
        <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5">
          <dt className="font-semibold">EBUS-TBNA</dt>
          <dd><span aria-hidden="true">{ACCESS_TEXT[access.ebusTbna].icon} </span>{ACCESS_TEXT[access.ebusTbna].text}</dd>
          <dt className="font-semibold">EUS-B-FNA</dt>
          <dd><span aria-hidden="true">{ACCESS_TEXT[access.eusBFna].icon} </span>{ACCESS_TEXT[access.eusBFna].text}</dd>
          {access.otherApproaches.length > 0 && (
            <>
              <dt className="font-semibold">Other approaches</dt>
              <dd>{access.otherApproaches.join("; ")}</dd>
            </>
          )}
        </dl>
        {access.ebusTbna !== "conventional" && access.eusBFna !== "conventional" && (
          <p className="mt-2 font-medium">
            <span aria-hidden="true">⚑ </span>Not shown as conventionally reached by standard EBUS or EUS-B in this draft.
          </p>
        )}
        <MetaFooter meta={access.meta} />
      </section>

      <section aria-labelledby="proc-h" className="space-y-3 rounded-lg border border-line p-4">
        <h3 id="proc-h" className="font-semibold">3 · Procedural details</h3>
        <Sensitive label="Typical airway approach" field={station.typicalAirwayApproach} />
        <Sensitive label="Ultrasound landmarks" field={station.ultrasoundLandmarks} />
        <Sensitive label="Sampling notes" field={station.samplingNotes} />
        <p className="text-sm text-muted">
          No airway wall location is ever universally safe to biopsy. Sampling decisions are patient-specific and depend on
          imaging, ultrasound findings, vascular anatomy, Doppler assessment, operator judgment and local practice.
        </p>
      </section>
    </article>
  );
}
