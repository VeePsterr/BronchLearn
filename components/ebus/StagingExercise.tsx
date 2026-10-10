"use client";

import { useState } from "react";
import { NODAL_RULES } from "@/content/staging/nodalRules";
import { getStation } from "@/content/stations/stations";
import type { NCategory, TumourSide } from "@/lib/contentSchemas";
import { progressActions, useProgress } from "@/lib/progress/store";
import { MetaFooter } from "@/components/ui/MetaFooter";
import { DraftNotice } from "@/components/ui/ReviewBadge";

const CATEGORIES: NCategory[] = ["N1", "N2", "N3"];

export function StagingExercise() {
  const [side, setSide] = useState<TumourSide | null>(null);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<NCategory | null>(null);
  const { update } = useProgress();

  const rule = NODAL_RULES[index % NODAL_RULES.length]!;
  const station = getStation(rule.stationCode);
  const correct = side ? rule.byTumourSide[side] : null;

  const choose = (c: NCategory) => {
    if (!side || answer) return;
    setAnswer(c);
    update((p) => progressActions.recordStaging(p, c === correct));
  };

  return (
    <div className="space-y-6">
      <DraftNotice>
        The N-category rules on this page are draft-unverified teaching placeholders. They have not yet been checked against
        the TNM edition in use and must not be used to stage real patients.
      </DraftNotice>

      <fieldset className="rounded-xl border border-line bg-surface p-5">
        <legend className="px-1 text-lg font-semibold">Step 1 · Choose a hypothetical primary-tumour side</legend>
        <p className="mb-3 text-muted">N1, N2 and N3 depend on where the primary tumour is. Nothing is shown until you choose.</p>
        <div className="flex flex-wrap gap-3">
          {(["right", "left"] as const).map((s) => (
            <label key={s} className={`flex cursor-pointer items-center gap-2 rounded-lg border-2 px-4 py-2.5 ${side === s ? "border-accent bg-accent-soft" : "border-line"}`}>
              <input
                type="radio"
                name="tumour-side"
                value={s}
                checked={side === s}
                onChange={() => {
                  setSide(s);
                  setAnswer(null);
                }}
              />
              <span className="font-bold">{s === "right" ? "R" : "L"}</span>
              <span>Tumour in the {s} lung</span>
            </label>
          ))}
        </div>
      </fieldset>

      {!side ? (
        <p className="rounded-xl border border-dashed border-line p-5 text-muted" data-testid="no-context">
          Select a tumour side above to start the exercise. N categories are not displayed without tumour context.
        </p>
      ) : (
        <section aria-labelledby="q-h" className="rounded-xl border border-line bg-surface p-5">
          <p className="text-sm font-semibold uppercase tracking-wide text-muted">
            Step 2 · Scenario: hypothetical {side}-lung primary tumour
          </p>
          <h2 id="q-h" className="mt-1 text-xl font-semibold">
            If station {rule.stationCode} ({station?.stationName}) were involved, which N category would that represent?
          </h2>
          <div className="mt-4 flex flex-wrap gap-3" role="group" aria-label="N category options">
            {CATEGORIES.map((c) => {
              const state = answer ? (c === correct ? "correct" : c === answer ? "wrong" : "idle") : "idle";
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => choose(c)}
                  aria-disabled={answer !== null}
                  className={`min-w-24 rounded-lg border-2 px-5 py-3 text-lg font-bold ${
                    state === "correct" ? "border-ok bg-ok-soft" : state === "wrong" ? "border-bad bg-bad-soft" : "border-line hover:bg-surface-2"
                  }`}
                >
                  {c}
                  {state === "correct" && <span className="ml-2 text-sm">✓ Correct answer</span>}
                  {state === "wrong" && <span className="ml-2 text-sm">✗ Your answer</span>}
                </button>
              );
            })}
          </div>
          <div aria-live="polite">
            {answer && (
              <div className={`mt-4 rounded-lg border-2 p-4 ${answer === correct ? "border-ok bg-ok-soft" : "border-bad bg-bad-soft"}`}>
                <p className="font-semibold">{answer === correct ? "✓ Correct." : `✗ Not quite. The teaching answer is ${correct}.`}</p>
                <p>{rule.reasoning[side]}</p>
              </div>
            )}
          </div>
          {answer && (
            <button
              type="button"
              className="mt-4 rounded-lg bg-accent px-4 py-2 font-medium text-on-accent"
              onClick={() => {
                setIndex((i) => i + 1);
                setAnswer(null);
              }}
            >
              Next station
            </button>
          )}
          <MetaFooter meta={rule.meta} />
        </section>
      )}

      {side && (
        <details className="rounded-xl border border-line bg-surface p-5">
          <summary className="cursor-pointer font-semibold">Reference: teaching categories for a {side}-lung tumour (draft)</summary>
          <table className="mt-3 w-full text-left text-sm">
            <caption className="sr-only">Draft N categories by station for a hypothetical {side}-lung tumour</caption>
            <thead>
              <tr className="border-b border-line">
                <th scope="col" className="py-1.5">Station</th>
                <th scope="col">Category</th>
                <th scope="col">Reasoning</th>
              </tr>
            </thead>
            <tbody>
              {NODAL_RULES.map((r) => (
                <tr key={r.stationCode} className="border-b border-line align-top">
                  <th scope="row" className="py-1.5 font-mono">{r.stationCode}</th>
                  <td className="font-bold">{r.byTumourSide[side]}</td>
                  <td>{r.reasoning[side]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      )}
    </div>
  );
}
