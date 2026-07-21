import Image from "next/image";
import { DIGIBULL_URL } from "@/app/config";

export default function DigiBullBadge() {
  return (
    <a
      href={DIGIBULL_URL}
      target="_blank"
      rel="noopener"
      className="fixed bottom-3 right-3 z-50 flex items-center gap-2 bg-white border-2 border-ink shadow-brutal-xs px-1.5 py-1.5 rotate-2 no-underline
        transition-transform hover:rotate-0 hover:scale-105 hover:shadow-brutal-sm
        min-[560px]:bottom-4 min-[560px]:right-4 min-[560px]:px-3 min-[560px]:py-2 min-[560px]:shadow-brutal-sm"
    >
      <Image src="/DBAI-Logo.webp" alt="" width={32} height={32} className="h-6 w-6 min-[560px]:h-8 min-[560px]:w-8 object-contain" aria-hidden="true" />
      <span className="hidden min-[560px]:block font-display text-[0.8rem] tracking-[0.08em] text-ink leading-tight">
        Powered by
        <br />
        DigiBull.ai
      </span>
    </a>
  );
}
