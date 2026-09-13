import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionToken } from "./core/auth/jwt";
import { AUTH_COOKIE_NAME } from "./core/auth/auth.types";
import { Role } from "@prisma/client";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const session = token ? await verifySessionToken(token) : null;

  const isMarshalLogin = pathname === "/marshal/login";
  const isMarshalRoute = pathname.startsWith("/marshal") && !isMarshalLogin;
  const isPlayerRestrictedRoute =
    pathname.startsWith("/book") ||
    pathname.startsWith("/my-bookings");
  const isProfileRoute = pathname.startsWith("/profile");
  const isAuthRoute = pathname === "/login" || pathname === "/register";

  // 1. Account switch override: if visiting auth route with switch param, clear session
  if (isAuthRoute && request.nextUrl.searchParams.get("switch") === "true") {
    const res = NextResponse.next();
    res.cookies.delete(AUTH_COOKIE_NAME);
    return res;
  }

  // 2. Marshal Route Access Protection (PRD 6.3):
  // Non-staff visitors navigating to /marshal are redirected to /login (not /marshal/login)
  // to avoid leaking the internal staff portal URL to unauthorized users.
  if (isMarshalRoute) {
    if (!session || (session.role !== Role.MARSHAL && session.role !== Role.MANAGER)) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 3. Staff Login Gateway Protection:
  // - If staff already logged in, redirect to /marshal console
  // - If a player is logged in, block access to staff gateway and redirect to /schedule
  if (isMarshalLogin && session) {
    if (session.role === Role.MARSHAL || session.role === Role.MANAGER) {
      return NextResponse.redirect(new URL("/marshal", request.url));
    }
    if (session.role === Role.PLAYER) {
      return NextResponse.redirect(new URL("/schedule", request.url));
    }
  }

  // 4. Profile Route (Players use /profile, Staff redirected to /marshal/settings)
  if (isProfileRoute) {
    if (!session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (session.role === Role.MARSHAL || session.role === Role.MANAGER) {
      return NextResponse.redirect(new URL("/marshal/settings", request.url));
    }
  }

  // 5. Player Restricted Routes (Booking checkout & personal player bookings)
  if (isPlayerRestrictedRoute) {
    if (!session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (session.role === Role.MARSHAL || session.role === Role.MANAGER) {
      return NextResponse.redirect(new URL("/marshal", request.url));
    }
  }

  // 6. Marshal landing redirection
  if (pathname === "/" && session) {
    if (session.role === Role.MARSHAL || session.role === Role.MANAGER) {
      return NextResponse.redirect(new URL("/marshal", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

export default proxy;
