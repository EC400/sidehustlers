import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC = ["/", "/login", "/register", "/services"];

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/api")
  ) {
    return NextResponse.next();
  }

  if (PUBLIC.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return NextResponse.next();
  }

  // Konsistenter Cookie-Name
  const hasSession = req.cookies.has("firebase-auth-token");
  if (!hasSession) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("callback", pathname + search);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/account/:path*", 
    "/orders/:path*",
    "/chat/:path*",
    "/admin/:path*",
  ],
};