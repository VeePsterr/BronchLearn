import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { AirwayAtlas } from "@/components/anatomy/AirwayAtlas";

describe("AirwayAtlas", () => {
  it("clicking RB1 shows its name, side, lobe, path, source and review status", async () => {
    const user = userEvent.setup();
    render(<AirwayAtlas />);
    await user.click(screen.getByRole("button", { name: /^RB1, Apical segmental bronchus/ }));
    const card = screen.getByRole("article");
    expect(within(card).getByRole("heading", { name: "Apical segmental bronchus" })).toBeInTheDocument();
    expect(within(card).getByText("Right")).toBeInTheDocument();
    expect(within(card).getByText("Right upper lobe")).toBeInTheDocument();
    const path = within(card).getByRole("navigation", { name: "Path from the trachea" });
    expect(path).toHaveTextContent("Trachea→Right main bronchus→Right superior lobar bronchus→RB1");
    expect(within(card).getByText(/FIPAT Terminologia Anatomica/)).toBeInTheDocument();
    expect(within(card).getAllByText("Source-verified").length).toBeGreaterThan(0);
  });

  it("toggles labels off and on", async () => {
    const user = userEvent.setup();
    const { container } = render(<AirwayAtlas />);
    const count = () => container.querySelectorAll("svg text").length;
    const withLabels = count();
    await user.click(screen.getByRole("switch", { name: /Labels/ }));
    expect(count()).toBeLessThan(withLabels);
    await user.click(screen.getByRole("switch", { name: /Labels/ }));
    expect(count()).toBe(withLabels);
  });

  it("search finds a structure by code and selects it", async () => {
    const user = userEvent.setup();
    render(<AirwayAtlas />);
    await user.type(screen.getByRole("searchbox"), "LB1+2");
    await user.click(screen.getByRole("button", { name: /LB1\+2\s*Apicoposterior/ }));
    expect(screen.getByRole("heading", { name: "Apicoposterior segmental bronchus" })).toBeInTheDocument();
  });

  it("variant toggle swaps LB7 and LB8 for LB7+8", async () => {
    const user = userEvent.setup();
    const { container } = render(<AirwayAtlas />);
    expect(container.querySelector('[data-airway-id="LB7"]')).not.toBeNull();
    expect(container.querySelector('[data-airway-id="LB7+8"]')).toBeNull();
    await user.click(screen.getByRole("radio", { name: "Variants" }));
    expect(container.querySelector('[data-airway-id="LB7+8"]')).not.toBeNull();
    expect(container.querySelector('[data-airway-id="LB7"]')).toBeNull();
  });

  it("supports keyboard selection", async () => {
    const user = userEvent.setup();
    render(<AirwayAtlas />);
    const rb6 = screen.getByRole("button", { name: /^RB6,/ });
    rb6.focus();
    await user.keyboard("{Enter}");
    expect(screen.getByRole("heading", { name: "Superior segmental bronchus" })).toBeInTheDocument();
  });
});
