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

  it("states that the view is a computer-generated simulation, not a patient image", () => {
    render(<NavigationSimulator />);
    expect(screen.getByText(/Simulated learning view \(original computer-generated rendering, not a patient image\)/)).toBeInTheDocument();
  });

  it("at the main carina shows the left main bronchus on the left of the screen and lists it first", async () => {
    const user = userEvent.setup();
    const { container } = render(<NavigationSimulator />);
    await user.click(screen.getByRole("button", { name: /Advance to Carina/ }));
    const view = screen.getByRole("img", { name: /Simulated learning view at Carina of trachea/ });
    expect(view).toHaveAccessibleName(/Openings: LMB \(left\), RMB \(right\)/);
    const buttons = screen.getAllByRole("button", { name: /branch \(patient's/ });
    expect(buttons[0]).toHaveAccessibleName(/Left branch/);
    expect(buttons[1]).toHaveAccessibleName(/Right branch/);
    const lmb = container.querySelector('[data-opening="lmb"] ellipse:nth-of-type(2)')!;
    const rmb = container.querySelector('[data-opening="rmb"] ellipse:nth-of-type(2)')!;
    expect(Number(lmb.getAttribute("cx"))).toBeLessThan(Number(rmb.getAttribute("cx")));
    expect(container.querySelector('[data-carina="main-carina"]')).not.toBeNull();
  });

  it("labels secondary carina RC1 in the right main bronchus view", async () => {
    const user = userEvent.setup();
    const { container } = render(<NavigationSimulator />);
    await user.click(screen.getByRole("button", { name: /Advance to Carina/ }));
    await user.click(screen.getByRole("button", { name: /Right branch/ }));
    expect(container.querySelector('[data-carina="RC1"]')).toHaveTextContent("RC1");
    expect(screen.getByTestId("carina-note")).toHaveTextContent(/RC1.*right upper lobe bronchus from the bronchus intermedius/);
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
