import type { ReviewStatus } from "@/lib/contentSchemas";
import { STATUS_EXPLANATION, STATUS_LABEL } from "@/lib/content/display";

const STYLES: Record<ReviewStatus, string> = {
  "draft-unverified": "border-draft bg-draft-soft text-draft",
  "source-verified": "border-accent bg-accent-soft text-ink",
  "clinician-reviewed": "border-ok bg-ok-soft text-ok",
};
const ICONS: Record<ReviewStatus, string> = {
  "draft-unverified": "⚠",
  "source-verified": "◆",
  "clinician-reviewed": "✓",
};

export function ReviewBadge({ status, compact = false }: { status: ReviewStatus; compact?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold ${STYLES[status]}`}
      title={STATUS_EXPLANATION[status]}
      data-review-status={status}
    >
      <span aria-hidden="true">{ICONS[status]}</span>
      {STATUS_LABEL[status]}
      {!compact && <span className="sr-only">. {STATUS_EXPLANATION[status]}</span>}
    </span>
  );
}

export function DraftNotice({ children }: { children?: React.ReactNode }) {
  return (
    <div role="note" className="rounded-lg border border-draft bg-draft-soft p-3 text-sm text-ink">
      <p className="font-semibold text-draft">
        <span aria-hidden="true">⚠ </span>Draft – unverified content
      </p>
      <p>{children ?? STATUS_EXPLANATION["draft-unverified"]}</p>
    </div>
  );
}
