"use client";

import { useMemo, useState } from "react";
import { QUESTION_TYPES, type QuestionType } from "@/lib/contentSchemas";
import { filterBank, QUESTION_BANK, TYPE_LABELS } from "@/lib/quiz/bank";
import { seededShuffle } from "@/lib/quiz/generate";
import { progressActions, useProgress } from "@/lib/progress/store";
import { LabeledSwitch } from "@/components/ui/Controls";
import { QuestionCard } from "./QuestionCard";

const ROUND_LENGTH = 10;

export function QuizRunner() {
  const [types, setTypes] = useState<QuestionType[]>([...QUESTION_TYPES]);
  const [includeDraft, setIncludeDraft] = useState(false);
  const [round, setRound] = useState(1);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState({ answered: 0, correct: 0 });
  const [answeredCurrent, setAnsweredCurrent] = useState(false);
  const { update } = useProgress();

  const pool = useMemo(() => filterBank(QUESTION_BANK, { types, includeDraft }), [types, includeDraft]);
  const questions = useMemo(() => seededShuffle(pool, round * 7919).slice(0, ROUND_LENGTH), [pool, round]);
  const q = questions[index];
  const finished = index >= questions.length && questions.length > 0;

  const restart = () => {
    setRound((r) => r + 1);
    setIndex(0);
    setScore({ answered: 0, correct: 0 });
    setAnsweredCurrent(false);
  };

  const toggleType = (t: QuestionType) => {
    setTypes((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]));
    setIndex(0);
    setScore({ answered: 0, correct: 0 });
    setAnsweredCurrent(false);
  };

  const draftCount = QUESTION_BANK.filter((x) => x.meta.reviewStatus === "draft-unverified").length;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)]">
      <aside className="space-y-4 rounded-xl border border-line bg-surface p-4" aria-label="Quiz settings">
        <fieldset>
          <legend className="mb-2 font-semibold">Question types</legend>
          <ul className="space-y-1.5">
            {QUESTION_TYPES.map((t) => {
              const n = QUESTION_BANK.filter((x) => x.type === t && (includeDraft || x.meta.reviewStatus !== "draft-unverified")).length;
              return (
                <li key={t}>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={types.includes(t)} onChange={() => toggleType(t)} />
                    <span>{TYPE_LABELS[t]}</span>
                    <span className="ml-auto text-muted">{n}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </fieldset>
        <div className="border-t border-line pt-3">
          <LabeledSwitch
            checked={includeDraft}
            onChange={(v) => {
              setIncludeDraft(v);
              setIndex(0);
              setAnsweredCurrent(false);
            }}
            label="Include draft questions"
          />
          <p className="mt-1 text-xs text-muted">
            {draftCount} questions rely on draft-unverified content (modality access, N categories, grouping terms) and are off by
            default.
          </p>
        </div>
        <p className="border-t border-line pt-3 text-sm" aria-live="polite">
          Score this round: <strong>{score.correct}</strong> / {score.answered}
        </p>
      </aside>

      <section aria-label="Question">
        {pool.length === 0 ? (
          <p className="rounded-xl border border-dashed border-line p-6 text-muted">No questions match these settings. Select at least one question type.</p>
        ) : finished ? (
          <div className="rounded-xl border border-line bg-surface p-6">
            <h2 className="text-2xl font-semibold">Round complete</h2>
            <p className="mt-2 text-lg">
              You answered {score.correct} of {score.answered} correctly.
            </p>
            <button type="button" onClick={restart} className="mt-4 rounded-lg bg-accent px-4 py-2 font-medium text-on-accent">
              Start a new round
            </button>
          </div>
        ) : q ? (
          <>
            <p className="mb-2 text-sm text-muted">
              Question {index + 1} of {questions.length} · {pool.length} available
            </p>
            <QuestionCard
              key={`${round}-${q.id}`}
              question={q}
              onAnswered={(correct) => {
                setAnsweredCurrent(true);
                setScore((s) => ({ answered: s.answered + 1, correct: s.correct + (correct ? 1 : 0) }));
                update((p) => progressActions.recordQuiz(p, q.type, correct));
              }}
            />
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                disabled={!answeredCurrent}
                onClick={() => {
                  setIndex((i) => i + 1);
                  setAnsweredCurrent(false);
                }}
                className="rounded-lg bg-accent px-4 py-2 font-medium text-on-accent disabled:opacity-50"
              >
                {index + 1 === questions.length ? "Finish round" : "Next question"}
              </button>
            </div>
          </>
        ) : null}
      </section>
    </div>
  );
}
