// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Converter from "@/components/Converter";

vi.mock("@vercel/analytics", () => ({ track: vi.fn() }));
vi.mock("@/components/Confetti", () => ({ fireConfetti: vi.fn() }));

const PROMPT =
  "## I — Instructions\nDo it.\n\n## O — Outcome\nA thing.\n\n## N — Notification\nAssumptions.";

const ok = (prompt = PROMPT) =>
  vi.fn().mockResolvedValue(new Response(JSON.stringify({ prompt }), { status: 200 }));

const failing = (message: string, status = 502) =>
  vi.fn().mockResolvedValue(new Response(JSON.stringify({ error: { message } }), { status }));

beforeEach(() => {
  vi.stubGlobal("fetch", ok());
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

async function convert(text = "write me an email") {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText("Raw prompt"), text);
  await user.click(screen.getByRole("button", { name: /convert to isatvon/i }));
  return user;
}

describe("Converter", () => {
  it("disables the button until there is a prompt", async () => {
    render(<Converter />);
    const button = screen.getByRole("button", { name: /convert to isatvon/i });
    expect(button).toBeDisabled();
    await userEvent.setup().type(screen.getByLabelText("Raw prompt"), "hi");
    expect(button).toBeEnabled();
  });

  it("does not submit whitespace", async () => {
    render(<Converter />);
    await userEvent.setup().type(screen.getByLabelText("Raw prompt"), "   ");
    expect(screen.getByRole("button", { name: /convert to isatvon/i })).toBeDisabled();
    expect(fetch).not.toHaveBeenCalled();
  });

  it("renders the converted prompt", async () => {
    render(<Converter />);
    await convert();
    expect(await screen.findByText(/isatvon-prompt\.md/)).toBeInTheDocument();
    expect(screen.getByText(/Do it\./)).toBeInTheDocument();
  });

  it("posts the raw prompt to /api/convert", async () => {
    render(<Converter />);
    await convert("summarize this");
    const [url, init] = (fetch as unknown as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toBe("/api/convert");
    expect(JSON.parse(init.body)).toEqual({ raw: "summarize this" });
  });

  it("shows the server's message in an alert when the call fails", async () => {
    vi.stubGlobal("fetch", failing("The conversion service is unavailable."));
    render(<Converter />);
    await convert();
    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("The conversion service is unavailable.");
  });

  it("shows the rate-limit message rather than a bare status", async () => {
    vi.stubGlobal("fetch", failing("Rate limit reached (10 conversions per minute).", 429));
    render(<Converter />);
    await convert();
    expect(await screen.findByRole("alert")).toHaveTextContent(/rate limit reached/i);
  });

  it("offers a retry after a failure", async () => {
    vi.stubGlobal("fetch", failing("nope"));
    render(<Converter />);
    const user = await convert();
    await user.click(await screen.findByRole("button", { name: /try again/i }));
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  // A 200 whose body is not the shape we expect used to blow up as a TypeError.
  it("reports a malformed success body as an error, not a crash", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(JSON.stringify({ nope: true }), { status: 200 }))
    );
    render(<Converter />);
    await convert();
    expect(await screen.findByRole("alert")).toBeInTheDocument();
  });

  it("toggles the editor", async () => {
    render(<Converter />);
    const user = await convert();
    await user.click(await screen.findByRole("button", { name: "Edit" }));
    expect(screen.getByLabelText("Edit converted prompt")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Done" }));
    expect(screen.queryByLabelText("Edit converted prompt")).not.toBeInTheDocument();
  });

  it("copies the prompt to the clipboard", async () => {
    render(<Converter />);
    // user-event installs its own clipboard stub during setup(), so spy after it
    const user = await convert();
    const writeText = vi.spyOn(navigator.clipboard, "writeText");
    await user.click(await screen.findByRole("button", { name: "Copy" }));
    expect(writeText).toHaveBeenCalledWith(PROMPT);
    expect(await screen.findByRole("button", { name: "Copied!" })).toBeInTheDocument();
  });

  it("falls back to selecting the text when the clipboard is blocked", async () => {
    render(<Converter />);
    const user = await convert();
    vi.spyOn(navigator.clipboard, "writeText").mockRejectedValue(new Error("insecure context"));
    await user.click(await screen.findByRole("button", { name: "Copy" }));
    expect(await screen.findByRole("button", { name: /select \+ ctrl/i })).toBeInTheDocument();
  });

  it("copies the prompt as JSON keyed by section", async () => {
    render(<Converter />);
    const user = await convert();
    const writeText = vi.spyOn(navigator.clipboard, "writeText");
    await user.click(await screen.findByRole("button", { name: "JSON" }));
    await waitFor(() => expect(writeText).toHaveBeenCalled());
    expect(JSON.parse(writeText.mock.calls[0][0])).toEqual({
      I: "Do it.",
      O: "A thing.",
      N: "Assumptions.",
    });
  });

  it("records feedback once and then thanks the user", async () => {
    render(<Converter />);
    const user = await convert();
    await user.click(await screen.findByRole("button", { name: /yes, useful/i }));
    expect(screen.getByText(/thanks/i)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /yes, useful/i })).not.toBeInTheDocument();
  });

  it("reports metrics without sending the prompt text", async () => {
    const { track } = await import("@vercel/analytics");
    render(<Converter />);
    await convert("write me a Claude prompt");
    await waitFor(() => expect(track).toHaveBeenCalledWith("convert_success", expect.anything()));
    const payload = JSON.stringify((track as ReturnType<typeof vi.fn>).mock.calls);
    expect(payload).toContain("claude");
    expect(payload).not.toContain("write me a Claude prompt");
  });
});
