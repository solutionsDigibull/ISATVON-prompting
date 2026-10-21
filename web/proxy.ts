import { NextRequest, NextResponse } from "next/server";

/**
 * app.isatvon.ai is the converter-only host: its root (and the legacy
 * /prompting path) serve the prompting interface without the marketing
 * chrome, and marketing pages bounce to the root. www.isatvon.ai is
 * untouched; its /converter alias redirects to /prompting so the internal
 * route never becomes a public www URL. /api/convert, /_next and static
 * assets are outside the matcher and always pass through.
 */
const APP_HOST = "app.isatvon.ai";

const MARKETING_PATHS = ["/how-it-works", "/use-cases", "/isatvon-vs-costar", "/privacy", "/terms"];

export function proxy(request: NextRequest) {
  const host = request.headers.get("host")?.split(":")[0];
  const { pathname } = request.nextUrl;

  if (host === APP_HOST) {
    if (pathname === "/" || pathname === "/prompting") {
      const url = request.nextUrl.clone();
      url.pathname = "/converter";
      return NextResponse.rewrite(url);
    }
    if (MARKETING_PATHS.includes(pathname)) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url, 307);
    }
    return NextResponse.next();
  }

  if (pathname === "/converter") {
    const url = request.nextUrl.clone();
    url.pathname = "/prompting";
    return NextResponse.redirect(url, 307);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/prompting",
    "/converter",
    "/how-it-works",
    "/use-cases",
    "/isatvon-vs-costar",
    "/privacy",
    "/terms",
  ],
};
