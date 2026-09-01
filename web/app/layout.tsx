import type { Metadata } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import DigiBullBadge from "@/components/DigiBullBadge";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import {
  SITE_URL,
  GITHUB,
  DIGIBULL_URL,
  GOOGLE_SITE_VERIFICATION,
  GA_MEASUREMENT_ID,
} from "./config";

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
  icons: { icon: "/icon.png" },
  verification: { google: GOOGLE_SITE_VERIFICATION },
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
    url: "/",
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
  "@id": `${SITE_URL}/#organization`,
  name: "ISATVON",
  url: SITE_URL,
  logo: `${SITE_URL}/DBAI-Logo.webp`,
  description,
  sameAs: [GITHUB, DIGIBULL_URL],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: "ISATVON",
  url: SITE_URL,
  description,
  inLanguage: "en",
  publisher: { "@id": `${SITE_URL}/#organization` },
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
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');`}
        </Script>
        <Nav />
        {children}
        <Footer />
        <DigiBullBadge />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
