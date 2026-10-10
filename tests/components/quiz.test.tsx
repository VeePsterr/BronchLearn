import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { QuestionCard } from "@/components/quiz/QuestionCard";
import { QuizRunner } from "@/components/quiz/QuizRunner";
import { QUESTION_BANK } from "@/lib/quiz/bank";
import { loadProgress } from "@/lib/progress/store";

describe("Quiz", () => {
  it("answering a question shows feedback and saves anonymous local progress", async () => {
    const user = userEvent.setup();
    render(<QuizRunner />);
    const options = screen.getAllByRole("listitem").filter((li) => li.querySelector("button"));
    await user.click(options[0]!.querySelector("button")!);
    expect(screen.getByText(/✓ Correct\.|✗ Not quite\./)).toBeInTheDocument();
    const p = loadProgress();
    expect(p.quiz.answered).toBe(1);
    expect(JSON.stringify(p)).not.toMatch(/"name"|email|patient|@/i);
  });

  it("renders the tumour scenario before an N-category question", () => {
    const q = QUESTION_BANK.find((x) => x.type === "n-category")!;
    render(<QuestionCard question={q} onAnswered={() => undefined} />);
    expect(screen.getByText(/Scenario: Hypothetical primary tumour/)).toBeInTheDocument();
  });

  it("treats LB7+8 as correct (variant, not a learner error)", async () => {
    const user = userEvent.setup();
    const q = QUESTION_BANK.find((x) => x.id === "name-to-code-lb7")!;
    render(<QuestionCard question={q} onAnswered={() => undefined} />);
    await user.click(screen.getByRole("button", { name: "LB7+8" }));
    expect(screen.getByText("✓ Correct.")).toBeInTheDocument();
    expect(screen.getByText(/recognized combined-branch nomenclature variant/)).toBeInTheDocument();
  });
});
