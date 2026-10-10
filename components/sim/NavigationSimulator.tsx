"use client";

import * as Tabs from "@radix-ui/react-tabs";
import { useMemo, useState } from "react";
import type { PatternMode } from "@/content/airways/airways";
import { AirwayTree } from "@/components/anatomy/AirwayTree";
import { AirwayBreadcrumb } from "@/components/anatomy/Breadcrumb";
import { Segmented } from "@/components/ui/Controls";
import { SideTag } from "@/components/ui/SideTag";
import {
  advance,
  back,
  getChoices,
  initialState,
  labelExercise,
  quizTargets,
  type SimMode,
  type SimState,
  type StepFeedback,
} from "@/lib/navigation/simulator";
import { getAirway, getPath, requireAirway } from "@/lib/navigation/tree";
import { progressActions, useProgress } from "@/lib/progress/store";
import { BronchoscopicView } from "./BronchoscopicView";

const DIRECTION_ICON = { forward: "↑", "right-branch": "R", "left-branch": "L", branch: "→" } as const;

export function NavigationSimulator() {
  const [mode, setMode] = useState<SimMode>("explore");
  const [pattern, setPattern] = useState<PatternMode>("standard");
  const [state, setState] = useState<SimState>(() => initialState("standard"));
  const [feedback, setFeedback] = useState<StepFeedback | null>(null);
  const [round, setRound] = useState(0);
  const { update } = useProgress();

  const choices = getChoices(state);
  const current = requireAirway(state.currentId);
  const pathIds = getPath(state.currentId).map((a) => a.id);

  const restart = (nextMode: SimMode, nextPattern: PatternMode, nextRound = round) => {
    const targets = quizTargets(nextPattern);
    const target = nextMode === "quiz" ? targets[(nextRound * 7 + 3) % targets.length]! : null;
    setState(initialState(nextPattern, target));
    setFeedback(null);
  };

  const choose = (id: string) => {
    const r = advance(state, id);
    setState(r.state);
    setFeedback(r.feedback);
    update((p) => progressActions.visitAirway(p, id));
    if (r.state.completed && r.state.targetId) {
      const t = r.state.targetId;
      update((p) => progressActions.completeRoute(p, t));
    }
  };

  const target = state.targetId ? getAirway(state.targetId) : null;

  return (
    <div className="space-y-4">
      <Tabs.Root
        value={mode}
        onValueChange={(v) => {
          setMode(v as SimMode);
          restart(v as SimMode, pattern);
        }}
      >
        <Tabs.List aria-label="Simulator mode" className="inline-flex flex-wrap gap-1 rounded-xl border border-line bg-surface p-1">
          {[
            { v: "explore", l: "Explore mode" },
            { v: "label", l: "Label mode" },
            { v: "quiz", l: "Quiz mode" },
          ].map((t) => (
            <Tabs.Trigger
              key={t.v}
              value={t.v}
              className="rounded-lg px-4 py-2 text-sm font-medium data-[state=active]:bg-accent data-[state=active]:text-on-accent"
            >
              {t.l}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        <Tabs.Content value="explore" className="mt-2 text-muted">
          Move freely through the airway. Openings are labeled.
        </Tabs.Content>
        <Tabs.Content value="label" className="mt-2 text-muted">
          Openings are numbered, not named. At each airway, choose every branch that arises there, then continue.
        </Tabs.Content>
        <Tabs.Content value="quiz" className="mt-2 text-muted">
          Navigate from the trachea to the target segment. You get feedback after every branch choice.
        </Tabs.Content>
      </Tabs.Root>

      <div className="flex flex-wrap items-end gap-4">
        <Segmented
          label="Left lower lobe pattern"
          value={pattern}
          onChange={(p) => {
            setPattern(p);
            restart(mode, p);
          }}
          options={[
            { value: "standard", label: "LB7 and LB8 separate" },
            { value: "variants", label: "LB7+8 combined" },
          ]}
        />
        {mode === "quiz" && (
          <button
            type="button"
            className="rounded-lg border border-line bg-surface px-4 py-2 text-sm font-medium hover:bg-surface-2"
            onClick={() => {
              const next = round + 1;
              setRound(next);
              restart("quiz", pattern, next);
            }}
          >
            New target
          </button>
        )}
      </div>

      {mode === "quiz" && target && (
        <div className="rounded-xl border-2 border-accent bg-accent-soft p-4" aria-live="polite">
          <p className="text-sm font-semibold uppercase tracking-wide text-muted">Target</p>
          <p className="text-xl font-semibold">
            <span className="font-mono">{target.code}</span> — {target.name} <SideTag side={target.side} />
          </p>
          {state.completed && <p className="mt-1 font-semibold text-ok">✓ Route complete{state.wrongTurns > 0 ? ` with ${state.wrongTurns} wrong turn${state.wrongTurns > 1 ? "s" : ""}` : " with no wrong turns"}.</p>}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <section aria-label="Simulated bronchoscopic view" className="rounded-xl border border-line bg-surface p-4">
          <p className="mb-2 text-sm text-muted">Current location</p>
          <h2 className="mb-1 flex flex-wrap items-center gap-2 text-xl font-semibold" aria-live="polite">
            {current.code ? <span className="font-mono">{current.code}</span> : null}
            {current.name}
            <SideTag side={current.side} />
          </h2>
          <div className="mb-3">
            <AirwayBreadcrumb id={state.currentId} />
          </div>
          <BronchoscopicView
            currentId={state.currentId}
            choices={choices}
            showLabels={mode === "explore"}
            numbered={mode !== "explore"}
            onChoose={mode === "label" ? undefined : choose}
          />
        </section>

        <section aria-label="Controls and map" className="space-y-4">
          {mode === "label" && choices.length > 1 ? (
            <LabelExercise key={`${state.currentId}-${pattern}`} currentId={state.currentId} pattern={pattern} onContinue={choose} choices={choices} />
          ) : (
            <div className="rounded-xl border border-line bg-surface p-4">
              <p className="mb-2 font-semibold">Where next?</p>
              {choices.length === 0 && <p className="text-muted">No further branches are modeled here. Go back to continue.</p>}
              <ul className="grid gap-2">
                {choices.map((c, i) => (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => choose(c.id)}
                      disabled={state.completed}
                      className="flex w-full items-center gap-3 rounded-lg border border-line px-3 py-2.5 text-left hover:bg-surface-2 disabled:opacity-50"
                    >
                      <span aria-hidden="true" className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-2 font-bold">
                        {DIRECTION_ICON[c.direction]}
                      </span>
                      <span>{mode === "quiz" ? `Opening ${i + 1}: ${c.label}` : c.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setState(back(state));
                    setFeedback(null);
                  }}
                  disabled={state.history.length === 0}
                  className="rounded-lg border border-line px-4 py-2 text-sm font-medium hover:bg-surface-2 disabled:opacity-50"
                >
                  ← Back (withdraw)
                </button>
                <button
                  type="button"
                  onClick={() => restart(mode, pattern)}
                  className="rounded-lg border border-line px-4 py-2 text-sm font-medium hover:bg-surface-2"
                >
                  Return to trachea
                </button>
              </div>
            </div>
          )}

          <FeedbackBox feedback={feedback} />

          <div className="rounded-xl border border-line bg-surface p-2">
            <p className="px-2 pt-1 text-sm font-semibold">Mini airway map</p>
            <AirwayTree
              compact
              title="Mini airway map showing your current position"
              selectedId={state.currentId}
              onSelect={() => undefined}
              showLabels={false}
              mode={pattern}
              sideFilter="all"
              lobeFilter="all"
              highlightIds={pathIds}
            />
            <p className="px-2 pb-1 text-xs text-muted">Highlighted: route travelled so far. Anterior view, patient&apos;s right on the left.</p>
          </div>
        </section>
      </div>
    </div>
  );
}

function FeedbackBox({ feedback }: { feedback: StepFeedback | null }) {
  const styles = useMemo(
    () => ({
      correct: { cls: "border-ok bg-ok-soft", icon: "✓", title: "On route" },
      arrived: { cls: "border-ok bg-ok-soft", icon: "✓", title: "Target reached" },
      "arrived-variant": { cls: "border-ok bg-ok-soft", icon: "✓", title: "Target reached (variant pattern)" },
      incorrect: { cls: "border-bad bg-bad-soft", icon: "✗", title: "Wrong turn" },
      info: { cls: "border-line bg-surface", icon: "ⓘ", title: "Moved" },
    }),
    [],
  );
  return (
    <div aria-live="polite" role="status">
      {feedback && (
        <div className={`rounded-xl border-2 p-3 ${styles[feedback.kind].cls}`}>
          <p className="font-semibold">
            <span aria-hidden="true">{styles[feedback.kind].icon} </span>
            {styles[feedback.kind].title}
          </p>
          <p>{feedback.message}</p>
        </div>
      )}
    </div>
  );
}

function LabelExercise({
  currentId,
  pattern,
  choices,
  onContinue,
}: {
  currentId: string;
  pattern: PatternMode;
  choices: { id: string; label: string }[];
  onContinue: (id: string) => void;
}) {
  const exercise = useMemo(() => labelExercise(currentId, pattern, currentId.length), [currentId, pattern]);
  const [picked, setPicked] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const current = requireAirway(currentId);
  const correctSet = new Set(exercise.correct);
  const allRight = checked && picked.length === correctSet.size && picked.every((p) => correctSet.has(p));

  // Options include grouping airways (non-segments) when they are the correct children.
  const options = Array.from(new Set([...exercise.correct, ...exercise.options]));

  return (
    <div className="rounded-xl border border-line bg-surface p-4">
      <fieldset>
        <legend className="mb-2 font-semibold">Which branches arise from the {current.name}? Select all that apply.</legend>
        <ul className="grid gap-2 sm:grid-cols-2">
          {options.map((id) => {
            const a = requireAirway(id);
            const isPicked = picked.includes(id);
            const verdict = checked ? (correctSet.has(id) ? (isPicked ? "correct" : "missed") : isPicked ? "wrong" : null) : null;
            return (
              <li key={id}>
                <label className={`flex items-center gap-2 rounded-lg border px-3 py-2 ${verdict === "correct" ? "border-ok bg-ok-soft" : verdict === "wrong" ? "border-bad bg-bad-soft" : verdict === "missed" ? "border-draft bg-draft-soft" : "border-line"}`}>
                  <input
                    type="checkbox"
                    checked={isPicked}
                    disabled={checked}
                    onChange={() => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))}
                  />
                  <span>{a.code ? `${a.code} — ${a.name}` : a.name}</span>
                  {verdict && (
                    <span className="ml-auto text-sm font-semibold">
                      {verdict === "correct" ? "✓ Correct" : verdict === "wrong" ? "✗ Does not arise here" : "Missed"}
                    </span>
                  )}
                </label>
              </li>
            );
          })}
        </ul>
      </fieldset>
      {!checked ? (
        <button type="button" onClick={() => setChecked(true)} className="mt-3 rounded-lg bg-accent px-4 py-2 font-medium text-on-accent">
          Check
        </button>
      ) : (
        <div className="mt-3 space-y-2">
          <p className={`font-semibold ${allRight ? "text-ok" : "text-bad"}`}>
            {allRight ? "✓ All branches identified." : "✗ Not quite. Compare your selection with the marks above."}
          </p>
          <p className="text-sm text-muted">Continue into one of the branches:</p>
          <div className="flex flex-wrap gap-2">
            {choices.map((c) => (
              <button key={c.id} type="button" onClick={() => onContinue(c.id)} className="rounded-lg border border-line px-3 py-1.5 text-sm hover:bg-surface-2">
                {c.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
