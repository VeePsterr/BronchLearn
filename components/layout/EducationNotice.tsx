import { siteConfig } from "@/config/site";

/** Persistent, unobtrusive education-only notice. Rendered on every page by the root layout. */
export function EducationNotice() {
  return (
    <div role="note" aria-label="Educational notice" className="border-b border-line bg-surface-2 text-sm text-muted">
      <p className="mx-auto max-w-6xl px-4 py-1.5">
        <span aria-hidden="true">ⓘ </span>
        {siteConfig.notice}{" "}
        <a href="/about#disclaimer" className="underline underline-offset-2 hover:text-ink">
          Full disclaimer
        </a>
      </p>
    </div>
  );
}
