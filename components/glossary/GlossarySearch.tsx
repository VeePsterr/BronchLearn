"use client";

import { useMemo, useState } from "react";
import { GLOSSARY } from "@/content/glossary/glossary";
import { ReviewBadge } from "@/components/ui/ReviewBadge";
import { SourceList } from "@/components/ui/SourceList";

export function GlossarySearch() {
  const [q, setQ] = useState("");
  const results = useMemo(() => {
    const n = q.trim().toLowerCase();
    const list = [...GLOSSARY].sort((a, b) => a.term.localeCompare(b.term));
    if (!n) return list;
    return list.filter((t) => [t.term, t.definition, ...t.aliases].some((s) => s.toLowerCase().includes(n)));
  }, [q]);
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="glossary-search" className="block font-semibold">Search the glossary</label>
        <input id="glossary-search" type="search" value={q} onChange={(e) => setQ(e.target.value)} className="mt-1 w-full max-w-lg rounded-lg border border-line bg-surface px-3 py-2" placeholder="e.g. carina, EUS-B, variant" />
        <p className="mt-1 text-sm text-muted" aria-live="polite">{results.length} term{results.length === 1 ? "" : "s"}</p>
      </div>
      <dl className="grid gap-3">
        {results.map((t) => (
          <div key={t.id} id={t.id} className="rounded-xl border border-line bg-surface p-4">
            <dt className="flex flex-wrap items-center gap-2 text-lg font-semibold">
              {t.term} <ReviewBadge status={t.meta.reviewStatus} compact />
            </dt>
            {t.aliases.length > 0 && <dd className="text-sm text-muted">Also: {t.aliases.join("; ")}</dd>}
            <dd className="mt-1">{t.definition}</dd>
            {t.seeAlso.length > 0 && (
              <dd className="mt-1 text-sm">
                See also: {t.seeAlso.map((s, i) => (
                  <span key={s}>{i > 0 && ", "}<a className="underline" href={`#${s}`}>{GLOSSARY.find((g) => g.id === s)?.term ?? s}</a></span>
                ))}
              </dd>
            )}
            <dd className="mt-2"><SourceList refs={t.meta.sourceRefs} /></dd>
            {t.meta.uncertaintyNotes && <dd className="mt-1 text-sm text-muted">{t.meta.uncertaintyNotes}</dd>}
          </div>
        ))}
      </dl>
    </div>
  );
}
