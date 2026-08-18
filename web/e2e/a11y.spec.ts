import { expect, test } from "@playwright/test";

test.describe("accessibility basics", () => {
  test("every page has one h1 and a main landmark", async ({ page }) => {
    for (const path of ["/", "/prompting", "/how-it-works", "/isatvon-vs-costar"]) {
      await page.goto(path);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("main, nav").first()).toBeVisible();
    }
  });

  test("the converter is reachable and operable by keyboard", async ({ page }) => {
    await page.route("**/api/convert", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ prompt: "## I — Instructions\nDone." }),
      })
    );
    await page.goto("/prompting");

    await page.getByLabel("Raw prompt").focus();
    await page.keyboard.type("hello");
    await page.keyboard.press("Tab");
    await expect(page.getByRole("button", { name: /convert to isatvon/i })).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.getByText("isatvon-prompt.md")).toBeVisible();
  });

  test("images carry alt text", async ({ page }) => {
    await page.goto("/");
    for (const img of await page.locator("img").all()) {
      expect(await img.getAttribute("alt")).not.toBeNull();
    }
  });
});
