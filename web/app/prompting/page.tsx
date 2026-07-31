import type { Metadata } from "next";
import Library from "@/components/Library";
import { pageMeta } from "../config";

const title = "Prompt Converter & Library";
const description =
  "Convert raw prompts into ISATVON structure and browse copy-paste templates with before/after conversions for ChatGPT, Claude, Gemini and more.";

export const metadata: Metadata = pageMeta(title, description, "/prompting");

export default function PromptingPage() {
  return <Library />;
}
