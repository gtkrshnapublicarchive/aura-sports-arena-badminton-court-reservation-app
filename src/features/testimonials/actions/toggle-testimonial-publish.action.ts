"use server";

import { prisma } from "@/core/db/client";
import { getCurrentUser } from "@/core/auth/session";
import { togglePublishSchema, TogglePublishInput } from "../testimonials.schemas";
import { revalidatePath } from "next/cache";
import { Role } from "@prisma/client";

export interface TogglePublishResult {
  success: boolean;
  error?: string;
}

export async function toggleTestimonialPublishAction(
  input: TogglePublishInput
): Promise<TogglePublishResult> {
  const user = await getCurrentUser();
  if (!user || (user.role !== Role.MARSHAL && user.role !== Role.MANAGER)) {
    return { success: false, error: "Staff authorization required" };
  }

  const validated = togglePublishSchema.safeParse(input);
  if (!validated.success) {
    return { success: false, error: "Invalid parameters" };
  }

  const { id, isPublished } = validated.data;

  try {
    await prisma.testimonial.update({
      where: { id },
      data: { isPublished },
    });

    try {
      revalidatePath("/");
      revalidatePath("/marshal");
    } catch {
      // Safe fallback when invoked in headless/test environments
    }
    return { success: true };
  } catch {
    return { success: false, error: "Failed to update publication status" };
  }
}
