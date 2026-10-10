import type { Metadata } from "next";
import { QuizRunner } from "@/components/quiz/QuizRunner";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = { title: "Quiz centre" };

export default function QuizPage() {
  return (
    <>
      <PageHeader
        title="Quiz centre"
        intro="Ten questions per round. Recognized nomenclature variants are accepted as correct answers. Scores are saved only in this browser."
      />
      <QuizRunner />
    </>
  );
}
