import { redirect } from "next/navigation";
import { getCurrentUser } from "./session";
import { AuthUser } from "./auth.types";
import { Role } from "@prisma/client";

export async function requireAuth(): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}

export async function requirePlayer(): Promise<AuthUser> {
  const user = await requireAuth();
  if (user.role !== Role.PLAYER) {
    // If staff accidentally lands on player checkout, redirect to marshal dashboard
    redirect("/marshal");
  }
  return user;
}

export async function requireMarshal(): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user || (user.role !== Role.MARSHAL && user.role !== Role.MANAGER)) {
    redirect("/login?staff=true");
  }
  return user;
}
