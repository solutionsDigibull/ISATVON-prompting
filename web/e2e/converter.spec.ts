import { expect, test, type Page } from "@playwright/test";

const PROMPT = `## I — Instructions
You are a copywriter. Write the email.

## O — Outcome
- **I** — task
- **O** — the email
- **N** — assumptions

## N — Notification
State every assumption.`;

/** Stub the conversion endpoint — the e2e run must never call Groq. */
async function stubConvert(page: Page, body: unknown, status = 200) {
  await page.route("**/api/convert", (route) =>
    route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) })
  );
}

/** The output card — /prompting has other Copy buttons for the templates and examples. */
const output = (page: Page) => page.getByRole("group", { name: "Converted prompt" });

test.describe("converter", () => {
  test("converts a raw prompt and shows the result", async ({ page }) => {
    await stubConvert(page, { prompt: PROMPT });
    await page.goto("/prompting");

    await page.getByLabel("Raw prompt").fill("write a launch email");
    await page.getByRole("button", { name: /convert to isatvon/i }).click();

    await expect(page.getByText("isatvon-prompt.md")).toBeVisible();
    await expect(page.getByText("You are a copywriter.")).toBeVisible();
  });

  test("lets the user edit, regenerate and copy the result", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await stubConvert(page, { prompt: PROMPT });
    await page.goto("/prompting");

    await page.getByLabel("Raw prompt").fill("write a launch email");
    await page.getByRole("button", { name: /convert to isatvon/i }).click();
    await expect(page.getByText("isatvon-prompt.md")).toBeVisible();

    await output(page).getByRole("button", { name: "Edit" }).click();
    const editor = page.getByLabel("Edit converted prompt");
    await expect(editor).toBeVisible();
    await editor.fill("edited prompt");
    await output(page).getByRole("button", { name: "Done" }).click();
    await expect(page.getByText("edited prompt")).toBeVisible();

    await output(page).getByRole("button", { name: "Regenerate" }).click();
    await expect(page.getByText("You are a copywriter.")).toBeVisible();

    await output(page).getByRole("button", { name: "Copy" }).click();
    await expect(output(page).getByRole("button", { name: "Copied!" })).toBeVisible();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toContain("## I —");
  });

  test("downloads the prompt as markdown", async ({ page }) => {
    await stubConvert(page, { prompt: PROMPT });
    await page.goto("/prompting");
    await page.getByLabel("Raw prompt").fill("write a launch email");
    await page.getByRole("button", { name: /convert to isatvon/i }).click();

    const [download] = await Promise.all([
      page.waitForEvent("download"),
      output(page).getByRole("button", { name: "Download" }).click(),
    ]);
    expect(download.suggestedFilename()).toBe("isatvon-prompt.md");
  });

  test("shows a readable error and offers a retry", async ({ page }) => {
    await stubConvert(page, { error: { message: "The conversion service is unavailable." } }, 502);
    await page.goto("/prompting");

    await page.getByLabel("Raw prompt").fill("hello");
    await page.getByRole("button", { name: /convert to isatvon/i }).click();

    // filtered by its heading: the dev server's own overlay also exposes an alert role
    const alert = page.getByRole("alert").filter({ hasText: "Conversion failed" });
    await expect(alert).toContainText("The conversion service is unavailable.");
    await expect(alert.getByRole("button", { name: /try again/i })).toBeVisible();
  });

  test("surfaces the rate limit rather than a bare status code", async ({ page }) => {
    await stubConvert(
      page,
      { error: { message: "Rate limit reached (10 conversions per minute). Try again in 42s." } },
      429
    );
    await page.goto("/prompting");
    await page.getByLabel("Raw prompt").fill("hello");
    await page.getByRole("button", { name: /convert to isatvon/i }).click();
    await expect(page.getByRole("alert").filter({ hasText: "Conversion failed" })).toContainText(
      /rate limit reached/i
    );
  });

  test("collects feedback on a conversion", async ({ page }) => {
    await stubConvert(page, { prompt: PROMPT });
    await page.goto("/prompting");
    await page.getByLabel("Raw prompt").fill("hello");
    await page.getByRole("button", { name: /convert to isatvon/i }).click();

    await page.getByRole("button", { name: /yes, useful/i }).click();
    await expect(page.getByText(/thanks/i)).toBeVisible();
  });
});
