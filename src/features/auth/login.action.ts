"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/core/db/client";
import { signSessionToken } from "@/core/auth/jwt";
import { setSessionCookie } from "@/core/auth/cookies";
import { loginSchema, LoginInput } from "./auth.schemas";
import { Role } from "@prisma/client";

export interface ActionResult<T = unknown> {
  success: boolean;
  error?: string;
  data?: T;
}

export async function loginAction(
  input: LoginInput
): Promise<ActionResult<{ role: Role; redirectUrl: string }>> {
  const validated = loginSchema.safeParse(input);
  if (!validated.success) {
    return {
      success: false,
      error: validated.error.issues[0]?.message || "Invalid input",
    };
  }

  const { email, password, isStaff } = validated.data;
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) {
    return { success: false, error: "Invalid email or password" };
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    return { success: false, error: "Invalid email or password" };
  }

  // Security Hardening: Block staff accounts from logging in through the public player form
  if (!isStaff && user.role !== Role.PLAYER) {
    return {
      success: false,
      error: "Invalid email or password",
    };
  }

  // Enforce staff role check if attempting staff login
  if (isStaff && user.role === Role.PLAYER) {
    return {
      success: false,
      error: "Unauthorized: Staff credentials required for Marshal console",
    };
  }

  const token = await signSessionToken({
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });

  await setSessionCookie(token, user.role);

  const redirectUrl = user.role === Role.PLAYER ? "/schedule" : "/marshal";
  return { success: true, data: { role: user.role, redirectUrl } };
}
