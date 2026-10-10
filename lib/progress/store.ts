"use client";

import { useCallback, useEffect, useState } from "react";
import { siteConfig } from "@/config/site";

/**
 * Anonymous, local-only learner progress. Contains no identity, no free text and no patient data.
 * Stored under a single versioned key in localStorage.
 */
export interface Progress {
  version: 1;
  visitedAirways: string[];
  visitedStations: string[];
  completedRoutes: string[];
  stagingAnswered: number;
  stagingCorrect: number;
  quiz: { answered: number; correct: number; byType: Record<string, { answered: number; correct: number }> };
}

export const PROGRESS_KEY = `${siteConfig.storagePrefix}.progress.v1`;

export function emptyProgress(): Progress {
  return {
    version: 1,
    visitedAirways: [],
    visitedStations: [],
    completedRoutes: [],
    stagingAnswered: 0,
    stagingCorrect: 0,
    quiz: { answered: 0, correct: 0, byType: {} },
  };
}

export function loadProgress(storage: Storage | undefined = safeStorage()): Progress {
  if (!storage) return emptyProgress();
  try {
    const raw = storage.getItem(PROGRESS_KEY);
    if (!raw) return emptyProgress();
    const parsed = JSON.parse(raw) as Partial<Progress>;
    if (parsed.version !== 1) return emptyProgress();
    return { ...emptyProgress(), ...parsed, quiz: { ...emptyProgress().quiz, ...parsed.quiz } };
  } catch {
    return emptyProgress();
  }
}

export function saveProgress(p: Progress, storage: Storage | undefined = safeStorage()): void {
  if (!storage) return;
  try {
    storage.setItem(PROGRESS_KEY, JSON.stringify(p));
    window.dispatchEvent(new Event("bronchlearn-progress"));
  } catch {
    /* storage full or blocked: progress is a convenience only */
  }
}

function safeStorage(): Storage | undefined {
  try {
    return typeof window === "undefined" ? undefined : window.localStorage;
  } catch {
    return undefined;
  }
}

function addUnique(list: string[], item: string): string[] {
  return list.includes(item) ? list : [...list, item];
}

export const progressActions = {
  visitAirway: (p: Progress, id: string): Progress => ({ ...p, visitedAirways: addUnique(p.visitedAirways, id) }),
  visitStation: (p: Progress, code: string): Progress => ({ ...p, visitedStations: addUnique(p.visitedStations, code) }),
  completeRoute: (p: Progress, id: string): Progress => ({ ...p, completedRoutes: addUnique(p.completedRoutes, id) }),
  recordStaging: (p: Progress, correct: boolean): Progress => ({
    ...p,
    stagingAnswered: p.stagingAnswered + 1,
    stagingCorrect: p.stagingCorrect + (correct ? 1 : 0),
  }),
  recordQuiz: (p: Progress, type: string, correct: boolean): Progress => {
    const prev = p.quiz.byType[type] ?? { answered: 0, correct: 0 };
    return {
      ...p,
      quiz: {
        answered: p.quiz.answered + 1,
        correct: p.quiz.correct + (correct ? 1 : 0),
        byType: { ...p.quiz.byType, [type]: { answered: prev.answered + 1, correct: prev.correct + (correct ? 1 : 0) } },
      },
    };
  },
};

/** React hook: current progress plus an `update` function that persists. */
export function useProgress() {
  const [progress, setProgress] = useState<Progress>(emptyProgress);
  useEffect(() => {
    setProgress(loadProgress());
    const onChange = () => setProgress(loadProgress());
    window.addEventListener("bronchlearn-progress", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("bronchlearn-progress", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);
  const update = useCallback((fn: (p: Progress) => Progress) => {
    const next = fn(loadProgress());
    saveProgress(next);
    setProgress(next);
  }, []);
  const reset = useCallback(() => {
    saveProgress(emptyProgress());
    setProgress(emptyProgress());
  }, []);
  return { progress, update, reset };
}
