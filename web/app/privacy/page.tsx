import type { Metadata } from "next";
import { pageMeta, GITHUB, DIGIBULL_URL } from "../config";

const title = "Privacy Policy";
const description = "Privacy policy for the ISATVON website by DigiBull AI.";

export const metadata: Metadata = pageMeta(title, description, "/privacy");

const para = "section-sub !text-left !mx-0 mb-5";

export default function PrivacyPage() {
  return (
    <section className="section">
      <div className="container max-w-[760px]">
        <h1 className="section-title !text-left">Privacy Policy</h1>
        <p className={para}>
          The ISATVON website is an informational site by DigiBull AI. It does not require an
          account, has nothing to log into, and does not set tracking cookies.
        </p>

        <h2 className="text-[1.6rem] mt-8 mb-3">Prompts you submit</h2>
        <p className={para}>
          When you use the Prompt Converter, the text you submit is sent to our conversion endpoint
          and forwarded to a third-party AI provider (Groq) solely to generate the converted prompt.
          It is not stored by this site, and it is never included in analytics. Do not submit
          confidential or personal data.
        </p>

        <h2 className="text-[1.6rem] mt-8 mb-3">Analytics</h2>
        <p className={para}>
          We use Vercel Analytics and Vercel Speed Insights to understand which pages get used and
          whether the converter is working. Both are cookieless and do not build a profile of you
          across sites.
        </p>
        <p className={para}>
          Alongside page views, the converter records a small number of events so we can tell a
          working feature from a broken one. Every value is a bucket, never your text:
        </p>
        <ul className={`${para} list-disc pl-6`}>
          <li>
            whether a conversion succeeded or failed, and a coarse failure class
            (&ldquo;rate-limited&rdquo;, &ldquo;upstream&rdquo;)
          </li>
          <li>
            how long it took and how long the input and output were, as ranges (&ldquo;1–3s&rdquo;,
            &ldquo;300–1k&rdquo;)
          </li>
          <li>which AI platform your prompt mentioned, if it mentioned one</li>
          <li>
            whether you pressed the thumbs-up or thumbs-down button, and whether you exported the
            result
          </li>
        </ul>
        <p className={para}>
          The prompt itself, the converted output, and the text of any error are never sent to
          analytics. The code that shapes these events is public:{" "}
          <a className="underline" href={`${GITHUB}/blob/main/web/lib/analytics.ts`}>
            web/lib/analytics.ts
          </a>
          .
        </p>

        <h2 className="text-[1.6rem] mt-8 mb-3">Server logs</h2>
        <p className={para}>
          Our hosting provider keeps standard request logs, which include IP addresses, for
          operational purposes. The converter is rate limited per client, which means an IP address
          is held in server memory for up to a minute. Neither is used to identify you, and failures
          are logged without your prompt text.
        </p>

        <h2 className="text-[1.6rem] mt-8 mb-3">Questions</h2>
        <p className="section-sub !text-left !mx-0">
          Raise them via{" "}
          <a className="underline" href={`${GITHUB}/issues`}>
            GitHub issues
          </a>{" "}
          or{" "}
          <a className="underline" href={DIGIBULL_URL}>
            digibull.ai
          </a>
          . Security reports go to security@digibull.ai — see{" "}
          <a className="underline" href={`${GITHUB}/blob/main/SECURITY.md`}>
            SECURITY.md
          </a>
          .
        </p>
      </div>
    </section>
  );
}
