import { cookies } from "next/headers";
import {
  AUTH_COOKIE_NAME,
  STAFF_SESSION_EXPIRY,
  PLAYER_SESSION_EXPIRY,
} from "./auth.types";
import { Role } from "@prisma/client";

export async function setSessionCookie(token: string, role: Role) {
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
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
}

export async function getSessionToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIE_NAME)?.value;
}
