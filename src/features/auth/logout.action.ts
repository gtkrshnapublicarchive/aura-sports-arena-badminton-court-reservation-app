"use server";

import { clearSessionCookie } from "@/core/auth/cookies";
import { redirect } from "next/navigation";

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/login");
}
