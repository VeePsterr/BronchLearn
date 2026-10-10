import { HANDWRITTEN_QUESTIONS } from "@/content/quiz/questions";
import type { QuestionType, QuizQuestion } from "@/lib/contentSchemas";
import { generateAirwayQuestions } from "./generate";

export const QUESTION_BANK: QuizQuestion[] = [...generateAirwayQuestions(), ...HANDWRITTEN_QUESTIONS];

export const TYPE_LABELS: Record<QuestionType, string> = {
  "code-to-name": "Code → anatomical name",
  "name-to-code": "Anatomical name → code",
  "next-branch": "Identify the next branch",
  "navigate-to-segment": "Navigate from the trachea",
  "station-from-landmarks": "Station from landmarks",
  "modality-access": "EBUS vs EUS-B access",
  "n-category": "N category (tumour side given)",
  "variant-recognition": "Variant recognition",
};

export function gradeAnswer(q: QuizQuestion, optionId: string): { correct: boolean; viaVariant: boolean } {
  const correct = q.acceptedOptionIds.includes(optionId);
  return { correct, viaVariant: correct && optionId !== q.acceptedOptionIds[0] };
}

export function filterBank(bank: QuizQuestion[], opts: { types: QuestionType[] | "all"; includeDraft: boolean }): QuizQuestion[] {
  return bank.filter(
    (q) => (opts.types === "all" || opts.types.includes(q.type)) && (opts.includeDraft || q.meta.reviewStatus !== "draft-unverified"),
  );
}
