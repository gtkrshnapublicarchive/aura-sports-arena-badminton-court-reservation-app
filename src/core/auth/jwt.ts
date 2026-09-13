import { SignJWT, jwtVerify } from "jose";
import {
  SessionPayload,
  STAFF_SESSION_EXPIRY,
  PLAYER_SESSION_EXPIRY,
} from "./auth.types";
import { Role } from "@prisma/client";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "aura-sports-arena-jwt-secret-key-2026-production"
);

export async function signSessionToken(payload: SessionPayload): Promise<string> {
  const expirySeconds =
    payload.role === Role.MARSHAL || payload.role === Role.MANAGER
      ? STAFF_SESSION_EXPIRY
      : PLAYER_SESSION_EXPIRY;

  return new SignJWT({
    userId: payload.userId,
    email: payload.email,
    name: payload.name,
    role: payload.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${expirySeconds}s`)
    .sign(JWT_SECRET);
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      name: payload.name as string,
      role: payload.role as Role,
    };
  } catch {
    return null;
  }
}
