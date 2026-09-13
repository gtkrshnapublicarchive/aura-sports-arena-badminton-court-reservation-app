import { cookies } from "next/headers";
import {
  AUTH_COOKIE_NAME,
  STAFF_SESSION_EXPIRY,
  PLAYER_SESSION_EXPIRY,
} from "./auth.types";
import { Role } from "@prisma/client";

// In-memory test store for CLI test runners outside HTTP context
const testCookieStore = new Map<string, string>();

export function setTestCookie(name: string, value: string) {
  testCookieStore.set(name, value);
}

export function clearTestCookies() {
  testCookieStore.clear();
}

export async function setSessionCookie(token: string, role: Role) {
  try {
    const cookieStore = await cookies();
    const maxAge =
      role === Role.MARSHAL || role === Role.MANAGER
        ? STAFF_SESSION_EXPIRY
        : PLAYER_SESSION_EXPIRY;

    cookieStore.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge,
    });
  } catch {
    testCookieStore.set(AUTH_COOKIE_NAME, token);
  }
}

export async function clearSessionCookie() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(AUTH_COOKIE_NAME);
  } catch {
    testCookieStore.delete(AUTH_COOKIE_NAME);
  }
}

export async function getSessionToken(): Promise<string | undefined> {
  try {
    const cookieStore = await cookies();
    return cookieStore.get(AUTH_COOKIE_NAME)?.value ?? testCookieStore.get(AUTH_COOKIE_NAME);
  } catch {
    return testCookieStore.get(AUTH_COOKIE_NAME);
  }
}
