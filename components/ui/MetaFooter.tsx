import type { ReviewMeta } from "@/lib/contentSchemas";
import { ReviewBadge } from "./ReviewBadge";
import { SourceList } from "./SourceList";

/** Standard provenance block shown under every medical content object. */
export function MetaFooter({ meta }: { meta: ReviewMeta }) {
  return (
    <div className="mt-4 space-y-3 border-t border-line pt-3">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <ReviewBadge status={meta.reviewStatus} />
        <span className="text-muted">
          Last checked {meta.lastReviewedDate} · {meta.reviewerName ?? meta.reviewerRole}
        </span>
      </div>
      <SourceList refs={meta.sourceRefs} />
      {meta.uncertaintyNotes && (
        <p className="text-sm text-muted">
          <span className="font-semibold text-ink">Uncertainty and variation: </span>
          {meta.uncertaintyNotes}
        </p>
      )}
    </div>
  );
}
