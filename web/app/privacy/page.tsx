import type { Metadata } from "next";
import { pageMeta, GITHUB, DIGIBULL_URL } from "../config";

const title = "Privacy Policy";
const description = "Privacy policy for the ISATVON website by DigiBull AI.";

export const metadata: Metadata = pageMeta(title, description, "/privacy");

export default function PrivacyPage() {
  return (
    <section className="section">
      <div className="container max-w-[760px]">
        <h1 className="section-title !text-left">Privacy Policy</h1>
        <p className="section-sub !text-left !mx-0 mb-5">
          The ISATVON website is a static informational site by DigiBull AI.
          It does not require an account and does not set tracking cookies.
        </p>
        <p className="section-sub !text-left !mx-0 mb-5">
          When you use the Prompt Converter, the text you submit is sent to
          our conversion endpoint and forwarded to a third-party AI provider
          solely to generate the converted prompt. It is not stored by this
          site. Do not submit confidential or personal data.
        </p>
        <p className="section-sub !text-left !mx-0">
          Questions about this policy can be raised via{" "}
          <a className="underline" href={`${GITHUB}/issues`}>GitHub issues</a> or{" "}
          <a className="underline" href={DIGIBULL_URL}>digibull.ai</a>.
        </p>
      </div>
    </section>
  );
}
