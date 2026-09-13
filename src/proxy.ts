import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionToken } from "./core/auth/jwt";
import { AUTH_COOKIE_NAME } from "./core/auth/auth.types";
import { Role } from "@prisma/client";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const session = token ? await verifySessionToken(token) : null;

  const isMarshalRoute = pathname.startsWith("/marshal");
  const isPlayerRestrictedRoute =
    pathname.startsWith("/book") ||
    pathname.startsWith("/my-bookings") ||
    pathname.startsWith("/profile");
  const isAuthRoute = pathname === "/login" || pathname === "/register";

  // 1. Marshal Portal Access Protection
  if (isMarshalRoute) {
    if (!session || (session.role !== Role.MARSHAL && session.role !== Role.MANAGER)) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("staff", "true");
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Player Restricted Routes
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

  // 3. Prevent logged-in users from seeing login/register
  if (isAuthRoute && session) {
    if (session.role === Role.MARSHAL || session.role === Role.MANAGER) {
      return NextResponse.redirect(new URL("/marshal", request.url));
    }
    return NextResponse.redirect(new URL("/schedule", request.url));
  }

  // 4. Marshal landing redirection
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
