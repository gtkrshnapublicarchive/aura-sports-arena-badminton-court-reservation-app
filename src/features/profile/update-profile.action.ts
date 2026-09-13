"use server";

import { prisma } from "@/core/db/client";
import { getCurrentUser } from "@/core/auth/session";
import { signSessionToken } from "@/core/auth/jwt";
import { setSessionCookie } from "@/core/auth/cookies";
import {
  updatePlayerProfileSchema,
  updateStaffProfileSchema,
  updateManagerProfileSchema,
} from "./profile.schemas";
import { Role } from "@prisma/client";
import { ActionResult } from "@/features/auth/login.action";

export async function updateProfileAction(
  data: Record<string, unknown>
): Promise<ActionResult<{ name: string; phone: string }>> {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, error: "Please log in to update your profile" };
  }

  let updatedName = user.name;
  let updatedPhone = user.phone;

  if (user.role === Role.PLAYER) {
    const validated = updatePlayerProfileSchema.safeParse(data);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues[0]?.message || "Invalid player profile input",
      };
    }
    updatedName = validated.data.name;
    updatedPhone = validated.data.phone;
  } else if (user.role === Role.MARSHAL) {
    const validated = updateStaffProfileSchema.safeParse(data);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues[0]?.message || "Invalid staff profile input",
      };
    }
    updatedName = validated.data.name;
    updatedPhone = validated.data.phone;
  } else if (user.role === Role.MANAGER) {
    const validated = updateManagerProfileSchema.safeParse(data);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues[0]?.message || "Invalid manager profile input",
      };
    }
    updatedName = validated.data.name;
    updatedPhone = validated.data.phone;
  }

  await prisma.user.update({
    where: { id: user.userId },
    data: {
      name: updatedName,
      phone: updatedPhone,
    },
  });

  // Re-sign session token with updated name
  const token = await signSessionToken({
    userId: user.userId,
    email: user.email,
    name: updatedName,
    role: user.role,
  });
  await setSessionCookie(token, user.role);

  return { success: true, data: { name: updatedName, phone: updatedPhone } };
}
