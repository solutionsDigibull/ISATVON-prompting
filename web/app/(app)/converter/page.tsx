import type { Metadata } from "next";
import Library from "@/components/Library";

// Internal target of the app.isatvon.ai middleware rewrite ("/" and
// "/prompting" on that host land here). Middleware bounces direct
// www/localhost traffic for /converter back to /prompting, so this URL is
// never publicly reachable on www. noindex: the canonical prompting page
// for crawlers is www.isatvon.ai/prompting.
export const metadata: Metadata = {
  title: "Convert Your Prompt",
  description: "Convert raw prompts into ISATVON structure. Edit, copy, regenerate.",
  robots: { index: false, follow: false },
};

export default function ConverterPage() {
  return <Library />;
}
