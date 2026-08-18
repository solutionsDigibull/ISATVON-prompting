import { expect, test } from "@playwright/test";

test.describe("prompt library", () => {
  test("switches between the full and lite templates", async ({ page }) => {
    await page.goto("/prompting");

    await expect(page.getByText("prompt-template.md")).toBeVisible();
    await page.getByRole("button", { name: /lite \(i \+ o \+ n\)/i }).click();
    await expect(page.getByText("prompt-template-lite.md")).toBeVisible();
    await expect(page.getByText("When to use Lite")).toBeVisible();
  });

  test("shows the section structure of a template", async ({ page }) => {
    await page.goto("/prompting");
    const rail = page.getByRole("navigation", { name: /prompt sections/i }).first();
    for (const name of ["Instructions", "Source", "Automation", "Tech stack"]) {
      await expect(rail).toContainText(name);
    }
  });

  test("opens an example conversion from the sidebar", async ({ page }) => {
    await page.goto("/prompting");
    await page.getByRole("button", { name: "Claude: Code review" }).click();
    await expect(page.getByRole("heading", { name: /claude .* code review/i })).toBeVisible();
    await expect(page.getByText("Can you review this code")).toBeVisible();
    // every example panel is in the DOM; only the active one is visible
    await expect(
      page.getByRole("heading", { name: /why it.s better/i }).filter({ visible: true })
    ).toBeVisible();
  });

  test("groups the sidebar by difficulty", async ({ page }) => {
    await page.goto("/prompting");
    for (const level of ["beginner examples", "intermediate examples", "advanced examples"]) {
      await expect(page.getByRole("heading", { name: level, exact: false })).toBeVisible();
    }
  });

  test("serves the framework as JSON", async ({ request }) => {
    const res = await request.get("/api/templates");
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.templates).toHaveLength(2);
    expect(body.examples.length).toBeGreaterThan(0);
  });
});
