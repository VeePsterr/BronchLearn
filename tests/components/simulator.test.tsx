import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { NavigationSimulator } from "@/components/sim/NavigationSimulator";

describe("NavigationSimulator", () => {
  it("explore mode: navigates trachea → carina → right main bronchus → RUL → RB1", async () => {
    const user = userEvent.setup();
    render(<NavigationSimulator />);
    await user.click(screen.getByRole("button", { name: /Advance to Carina/ }));
    await user.click(screen.getByRole("button", { name: /Right branch \(patient's right\)/ }));
    await user.click(screen.getByRole("button", { name: /Right superior lobar bronchus/ }));
    await user.click(screen.getByRole("button", { name: /RB1 — Apical segmental bronchus/ }));
    expect(screen.getByRole("heading", { level: 2, name: /RB1\s*Apical segmental bronchus/ })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Back/ }));
    expect(screen.getByRole("heading", { level: 2, name: /Right superior lobar bronchus/ })).toBeInTheDocument();
  });

  it("states that the view is a schematic simulation", () => {
    render(<NavigationSimulator />);
    expect(screen.getByText(/Simulated learning view/)).toBeInTheDocument();
    expect(screen.getByText(/not/, { selector: "strong" })).toBeInTheDocument();
  });

  it("quiz mode gives immediate feedback on a branch choice", async () => {
    const user = userEvent.setup();
    render(<NavigationSimulator />);
    await user.click(screen.getByRole("tab", { name: "Quiz mode" }));
    expect(screen.getByText("Target")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Advance to Carina/ }));
    await user.click(screen.getByRole("button", { name: /Left branch/ }));
    expect(screen.getByRole("status")).toHaveTextContent(/On route|Wrong turn/);
  });
});
