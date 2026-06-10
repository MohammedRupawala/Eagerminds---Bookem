import { NextResponse, type NextRequest } from "next/server";

import { getSessionFromRequest } from "@/lib/auth";

const GUEST_ONLY = ["/login", "/signup"];
const AUTH_ONLY = ["/dashboard"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await getSessionFromRequest(request);

  // Logged-in users cannot visit login/signup — send them to dashboard
  if (session && GUEST_ONLY.some((p) => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Guests cannot visit protected routes — send them to login
  if (!session && AUTH_ONLY.some((p) => pathname.startsWith(p))) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
};
