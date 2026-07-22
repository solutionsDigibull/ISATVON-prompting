import type { Metadata } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import DigiBullBadge from "@/components/DigiBullBadge";
import { SITE_URL, GITHUB } from "./config";

// variable names must differ from the @theme font tokens they feed (globals.css)
const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
});
const inter = Inter({
  weight: ["400", "600", "800"],
  subsets: ["latin"],
  variable: "--font-inter",
});

const title = "ISATVON | Structured Prompting Framework for Reliable AI";
const description =
  "The ISATVON framework turns vague requests into structured, verifiable prompts for ChatGPT, Claude, Gemini and other AI tools you already use.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: title,
    template: "%s | ISATVON",
  },
  description,
  keywords: [
    "structured prompting framework",
    "AI prompting framework",
    "ISATVON prompting",
    "prompt engineering framework",
    "structured AI prompts",
    "reliable AI outputs",
    "structured prompts for ChatGPT",
    "prompt framework for Claude",
    "prompt engineering template",
    "AI prompt template",
    "reduce AI hallucinations",
    "cross-platform AI prompting",
    "verifiable AI responses",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title,
    description,
    siteName: "ISATVON",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ISATVON",
  url: SITE_URL,
  sameAs: [GITHUB],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "ISATVON",
  url: SITE_URL,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bebas.variable} ${inter.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <Nav />
        {children}
        <Footer />
        <DigiBullBadge />
      </body>
    </html>
  );
}
