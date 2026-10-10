"use client";

import { useState } from "react";
import type { QuizQuestion } from "@/lib/contentSchemas";
import { gradeAnswer, TYPE_LABELS } from "@/lib/quiz/bank";
import { MetaFooter } from "@/components/ui/MetaFooter";
import { ReviewBadge } from "@/components/ui/ReviewBadge";

export function QuestionCard({
  question,
  onAnswered,
}: {
  question: QuizQuestion;
  onAnswered: (correct: boolean) => void;
}) {
  const [picked, setPicked] = useState<string | null>(null);
  const result = picked ? gradeAnswer(question, picked) : null;

  // Guard: never render an N-category question without tumour context.
  if (question.type === "n-category" && !question.tumourContext) {
    return <p role="alert">This question is missing its tumour context and cannot be shown.</p>;
  }

  return (
    <article aria-labelledby={`q-${question.id}`} className="rounded-xl border border-line bg-surface p-5 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center gap-2 text-sm">
        <span className="rounded-full bg-surface-2 px-2.5 py-0.5 font-medium">{TYPE_LABELS[question.type]}</span>
        <ReviewBadge status={question.meta.reviewStatus} compact />
      </div>
      {question.tumourContext && (
        <p className="mb-3 rounded-lg border-2 border-accent bg-accent-soft px-3 py-2 font-semibold">
          Scenario: {question.tumourContext.description}
        </p>
      )}
      <h2 id={`q-${question.id}`} className="text-xl font-semibold">{question.prompt}</h2>
      <ul className="mt-4 grid gap-2" role="list">
        {question.options.map((o) => {
          const isAccepted = question.acceptedOptionIds.includes(o.id);
          const state = picked ? (isAccepted ? "accepted" : o.id === picked ? "wrong" : "idle") : "idle";
          return (
            <li key={o.id}>
              <button
                type="button"
                aria-disabled={picked !== null}
                onClick={() => {
                  if (picked) return;
                  setPicked(o.id);
                  onAnswered(gradeAnswer(question, o.id).correct);
                }}
                className={`flex w-full items-center gap-3 rounded-lg border-2 px-4 py-3 text-left ${
                  state === "accepted" ? "border-ok bg-ok-soft" : state === "wrong" ? "border-bad bg-bad-soft" : "border-line hover:bg-surface-2"
                }`}
              >
                <span className="flex-1">{o.label}</span>
                {state === "accepted" && <span className="text-sm font-semibold">✓ {o.id === picked ? "Your answer – correct" : "Accepted answer"}</span>}
                {state === "wrong" && <span className="text-sm font-semibold">✗ Your answer</span>}
              </button>
            </li>
          );
        })}
      </ul>
      <div aria-live="polite">
        {result && (
          <div className={`mt-4 rounded-lg border-2 p-4 ${result.correct ? "border-ok bg-ok-soft" : "border-bad bg-bad-soft"}`}>
            <p className="font-semibold">{result.correct ? "✓ Correct." : "✗ Not quite."}</p>
            {result.viaVariant && question.variantNote && <p className="mt-1">{question.variantNote}</p>}
            {!result.viaVariant && question.variantNote && question.acceptedOptionIds.length > 1 && <p className="mt-1 text-sm">{question.variantNote}</p>}
            <p className="mt-1">{question.explanation}</p>
          </div>
        )}
      </div>
      {result && <MetaFooter meta={question.meta} />}
    </article>
  );
}
