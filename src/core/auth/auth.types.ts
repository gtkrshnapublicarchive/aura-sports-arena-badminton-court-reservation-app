import { Role } from "@prisma/client";

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  role: Role;
}

export interface AuthUser extends SessionPayload {
  phone: string;
}

export const AUTH_COOKIE_NAME = "aura_session_token";
export const STAFF_SESSION_EXPIRY = 8 * 60 * 60; // 8 hours in seconds
export const PLAYER_SESSION_EXPIRY = 30 * 24 * 60 * 60; // 30 days in seconds
