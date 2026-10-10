import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { StagingExercise } from "@/components/ebus/StagingExercise";
import { StationAtlas } from "@/components/ebus/StationAtlas";
import { StationCard } from "@/components/ebus/StationCard";
import { STATIONS } from "@/content/stations/stations";

describe("StationAtlas", () => {
  it("selecting a station shows a card separating anatomy, access and procedural details", async () => {
    const user = userEvent.setup();
    render(<StationAtlas />);
    await user.click(screen.getByRole("button", { name: /Station 7, Subcarinal/ }));
    const card = screen.getByRole("article");
    expect(within(card).getByRole("heading", { name: "Subcarinal nodes" })).toBeInTheDocument();
    expect(within(card).getByRole("heading", { name: /Station anatomy/ })).toBeInTheDocument();
    expect(within(card).getByRole("heading", { name: /Modality access \(separate from anatomy\)/ })).toBeInTheDocument();
    expect(within(card).getByText("The carina of the trachea.")).toBeInTheDocument();
  });

  it("filters by side", async () => {
    const user = userEvent.setup();
    render(<StationAtlas />);
    await user.click(screen.getByRole("radio", { name: "L · Left" }));
    const list = screen.getByRole("list", { name: "Station list" });
    expect(within(list).queryByRole("button", { name: "4R" })).toBeNull();
    expect(within(list).getByRole("button", { name: "4L" })).toBeInTheDocument();
  });
});

describe("StationCard draft and sensitive content", () => {
  it.each(STATIONS.map((s) => [s.stationCode, s] as const))("station %s never renders sampling text and flags draft access", (_code, s) => {
    const { container } = render(<StationCard station={s} />);
    expect(container.querySelectorAll("[data-sensitive-hidden]")).toHaveLength(3);
    if (s.accessibleBy.meta.reviewStatus === "draft-unverified") {
      expect(within(container).getAllByText(/Draft – unverified/).length).toBeGreaterThan(0);
    }
  });
});

describe("StagingExercise", () => {
  it("shows no N category until a tumour side is chosen", async () => {
    const user = userEvent.setup();
    render(<StagingExercise />);
    expect(screen.getByTestId("no-context")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /^N1/ })).toBeNull();
    await user.click(screen.getByRole("radio", { name: /right lung/ }));
    expect(screen.getByRole("button", { name: /^N1/ })).toBeInTheDocument();
  });

  it("gives reasoning after an answer", async () => {
    const user = userEvent.setup();
    render(<StagingExercise />);
    await user.click(screen.getByRole("radio", { name: /left lung/ }));
    await user.click(screen.getByRole("button", { name: /^N3/ }));
    expect(screen.getByText(/Station 1 nodes are low cervical/, { selector: "p" })).toBeInTheDocument();
  });
});
