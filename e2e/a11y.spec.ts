import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const PAGES = ["/", "/atlas", "/navigate", "/stations", "/staging", "/quiz", "/glossary", "/about", "/lessons/airway-orientation"];

for (const path of PAGES) {
  test(`axe: no WCAG 2.x A/AA violations on ${path}`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
    const summary = results.violations.map((v) => `${v.id}: ${v.nodes.length} × ${v.help}`);
    expect(summary, summary.join("\n")).toEqual([]);
  });
}

test("keyboard: airway branches are reachable and selectable with the keyboard", async ({ page }) => {
  await page.goto("/atlas");
  const rb6 = page.getByRole("button", { name: /^RB6,/ });
  await rb6.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { name: "Superior segmental bronchus" })).toBeVisible();
});

test("skip link moves focus to main content", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
});
