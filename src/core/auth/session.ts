import { getSessionToken } from "./cookies";
import { verifySessionToken } from "./jwt";
import { prisma } from "@/core/db/client";
import { AuthUser } from "./auth.types";

export async function getCurrentUser(): Promise<AuthUser | null> {
  const token = await getSessionToken();
  if (!token) return null;

  const payload = await verifySessionToken(token);
  if (!payload) return null;

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      role: true,
    },
  });

  if (!user) return null;

  return {
    userId: user.id,
    email: user.email,
    name: user.name,
    phone: user.phone,
    role: user.role,
  };
}
