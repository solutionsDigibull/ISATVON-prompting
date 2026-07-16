import type { Metadata } from "next";

const title = "Terms of Use";
const description = "Terms of use for the ISATVON website by DigiBull AI.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/terms" },
  openGraph: { title, description, type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

export default function TermsPage() {
  return (
    <section className="section">
      <div className="container max-w-[760px]">
        <h1 className="section-title !text-left">Terms of Use</h1>
        <p className="section-sub !text-left !mx-0 mb-5">
          The ISATVON framework and this website&rsquo;s content are provided
          by DigiBull AI under the{" "}
          <a className="underline" href="https://github.com/isatvon/isatvon-prompting/blob/main/LICENSE">Apache 2.0 Licence</a>,
          free to use, adapt and share.
        </p>
        <p className="section-sub !text-left !mx-0 mb-5">
          The site, including the Prompt Converter, is provided &ldquo;as
          is&rdquo; without warranties of any kind. AI-generated output can be
          wrong; review it before relying on it. ISATVON improves transparency
          but does not replace legal, medical, financial, security or other
          professional judgement.
        </p>
        <p className="section-sub !text-left !mx-0">
          Questions can be raised via{" "}
          <a className="underline" href="https://github.com/isatvon/isatvon-prompting/issues">GitHub issues</a> or{" "}
          <a className="underline" href="https://digibull.ai">digibull.ai</a>.
        </p>
      </div>
    </section>
  );
}
