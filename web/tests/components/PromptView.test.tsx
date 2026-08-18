// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PromptView from "@/components/PromptView";

const PROMPT = `## I — Instructions
You are [ROLE]. Do the thing.

## O — Outcome
- **I** — task

## N — Notification
State assumptions.`;

afterEach(cleanup);

describe("PromptView", () => {
  it("lists every section in the rail", () => {
    render(<PromptView text={PROMPT} />);
    const rail = screen.getByRole("navigation", { name: /prompt sections/i });
    expect(rail).toHaveTextContent("Instructions");
    expect(rail).toHaveTextContent("Outcome");
    expect(rail).toHaveTextContent("Notification");
  });

  it("highlights placeholders so they are visibly unfilled", () => {
    render(<PromptView text={PROMPT} />);
    expect(screen.getByText("[ROLE]").tagName).toBe("MARK");
  });

  it("marks a section active when its rail entry is clicked", async () => {
    render(<PromptView text={PROMPT} />);
    const user = userEvent.setup();
    const entry = screen.getByRole("navigation").querySelector("button")!;
    await user.click(entry);
    expect(entry).toHaveAttribute("data-active", "true");
    await user.click(entry);
    expect(entry).toHaveAttribute("data-active", "false");
  });

  it("falls back to plain text when nothing parses", () => {
    render(<PromptView text="just some prose" />);
    expect(screen.getByText("just some prose")).toBeInTheDocument();
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });
});
