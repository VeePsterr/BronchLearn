import { expect, test } from "@playwright/test";

const NOTICE = "For education only. Not for patient-specific decision-making or unsupervised procedural use.";

test("home dashboard shows learning paths and the education notice", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Welcome to");
  await expect(page.getByText(NOTICE).first()).toBeVisible();
  await expect(page.getByRole("link", { name: /Start with airway anatomy/ }).first()).toBeVisible();
});

test("every main page renders with the persistent notice", async ({ page }) => {
  for (const path of ["/atlas", "/navigate", "/stations", "/staging", "/quiz", "/glossary", "/about", "/lessons/airway-orientation"]) {
    await page.goto(path);
    await expect(page.getByRole("note", { name: "Educational notice" })).toContainText(NOTICE);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  }
});

test("atlas: selecting RB1 shows its name, side, lobe, path and review status", async ({ page }) => {
  await page.goto("/atlas");
  // Click the branch end point, as a learner would.
  await page.getByRole("button", { name: /^RB1, Apical segmental bronchus/ }).locator('[data-hit="endpoint"]').click();
  const card = page.getByRole("article");
  await expect(card.getByRole("heading", { name: "Apical segmental bronchus" })).toBeVisible();
  await expect(card.getByText("Right upper lobe", { exact: true })).toBeVisible();
  await expect(card.getByRole("navigation", { name: "Path from the trachea" })).toContainText("Right superior lobar bronchus");
  await expect(card.getByText("Source-verified").first()).toBeVisible();
});

test("simulator: navigate trachea → LB9 and back", async ({ page }) => {
  await page.goto("/navigate");
  await page.getByRole("button", { name: /Advance to Carina/ }).click();
  await page.getByRole("button", { name: /Left branch/ }).click();
  await page.getByRole("button", { name: /Left inferior lobar bronchus/ }).click();
  await page.getByRole("button", { name: /LB9/ }).click();
  await expect(page.getByRole("heading", { level: 2, name: /LB9/ })).toBeVisible();
});

test("stations: card separates anatomy from access and hides sampling notes", async ({ page }) => {
  await page.goto("/stations");
  await page.getByRole("button", { name: /^Station 7,/ }).click();
  const card = page.getByRole("article");
  await expect(card.getByRole("heading", { name: /Station anatomy/ })).toBeVisible();
  await expect(card.getByRole("heading", { name: /Modality access/ })).toBeVisible();
  await expect(card.getByText(/Awaiting review by an appropriately qualified bronchoscopist/).first()).toBeVisible();
});

test("staging: requires a tumour side before showing N categories", async ({ page }) => {
  await page.goto("/staging");
  await expect(page.getByRole("button", { name: /^N1/ })).toHaveCount(0);
  await page.getByRole("radio", { name: /right lung/ }).check();
  await expect(page.getByRole("button", { name: /^N1/ })).toBeVisible();
});

test("quiz: progress persists locally across reloads", async ({ page }) => {
  await page.goto("/quiz");
  await page.getByRole("article").getByRole("button").first().click();
  await expect(page.getByText(/✓ Correct\.|✗ Not quite\./)).toBeVisible();
  await page.goto("/");
  await expect(page.getByText(/Quiz answers correct/)).toBeVisible();
  await expect(page.getByText(/\d+ \/ 1 \(/)).toBeVisible();
});
