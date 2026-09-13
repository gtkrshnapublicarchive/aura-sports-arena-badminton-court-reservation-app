"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/core/db/client";
import { signSessionToken } from "@/core/auth/jwt";
import { setSessionCookie } from "@/core/auth/cookies";
import { registerSchema, RegisterInput } from "./auth.schemas";
import { ActionResult } from "./login.action";
import { Role } from "@prisma/client";

export async function registerAction(
  input: RegisterInput
): Promise<ActionResult<{ redirectUrl: string }>> {
  const validated = registerSchema.safeParse(input);
  if (!validated.success) {
    return {
      success: false,
      error: validated.error.issues[0]?.message || "Invalid registration input",
    };
  }

  const { name, email, phone, password } = validated.data;
  const existingUser = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (existingUser) {
    return {
      success: false,
      error: "An account with this email already exists",
    };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      name,
      email: email.toLowerCase(),
      phone,
      passwordHash,
      role: Role.PLAYER,
    },
  });

  const token = await signSessionToken({
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });

  await setSessionCookie(token, user.role);

  return { success: true, data: { redirectUrl: "/schedule" } };
}
