"use client";

import { STATIONS } from "@/content/stations/stations";
import { SEGMENTS } from "@/lib/navigation/tree";
import { useProgress } from "@/lib/progress/store";

export function ProgressSummary() {
  const { progress, reset } = useProgress();
  const segVisited = progress.visitedAirways.filter((id) => SEGMENTS.some((s) => s.id === id)).length;
  const pct = progress.quiz.answered ? Math.round((progress.quiz.correct / progress.quiz.answered) * 100) : null;
  const items = [
    { label: "Segments explored", value: `${segVisited} / ${SEGMENTS.length}`, ratio: segVisited / SEGMENTS.length },
    { label: "Stations explored", value: `${progress.visitedStations.length} / ${STATIONS.length}`, ratio: progress.visitedStations.length / STATIONS.length },
    { label: "Routes completed", value: `${progress.completedRoutes.length}`, ratio: Math.min(1, progress.completedRoutes.length / 10) },
    { label: "Quiz answers correct", value: pct === null ? "No answers yet" : `${progress.quiz.correct} / ${progress.quiz.answered} (${pct}%)`, ratio: pct === null ? 0 : pct / 100 },
  ];
  return (
    <section aria-labelledby="progress-h" className="rounded-xl border border-line bg-surface p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="progress-h" className="text-xl font-semibold">Your progress</h2>
        <button type="button" onClick={reset} className="text-sm text-muted underline">Reset progress</button>
      </div>
      <p className="text-sm text-muted">Saved only in this browser. No names, emails or patient data are collected.</p>
      <ul className="mt-4 grid gap-4 sm:grid-cols-2">
        {items.map((it) => (
          <li key={it.label}>
            <p className="flex justify-between text-sm"><span className="font-medium">{it.label}</span><span>{it.value}</span></p>
            <div className="mt-1 h-2 rounded-full bg-surface-2" role="presentation">
              <div className="h-2 rounded-full bg-accent" style={{ width: `${Math.round(it.ratio * 100)}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
