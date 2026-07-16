import type { Metadata } from "next";
import Library from "@/components/Library";

const title = "Prompt Converter & Library";
const description =
  "Convert raw prompts into ISATVON structure and browse copy-paste templates with before/after conversions for ChatGPT, Claude, Gemini and more.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/prompting" },
  openGraph: { title, description, type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

export default function PromptingPage() {
  return <Library />;
}
