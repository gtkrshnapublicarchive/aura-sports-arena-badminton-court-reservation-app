"use server";

import { prisma } from "@/core/db/client";
import { getCurrentUser } from "@/core/auth/session";
import { deleteTestimonialSchema, DeleteTestimonialInput } from "../testimonials.schemas";
import { revalidatePath } from "next/cache";
import { Role } from "@prisma/client";

export interface DeleteTestimonialResult {
  success: boolean;
  error?: string;
}

export async function deleteTestimonialAction(
  input: DeleteTestimonialInput
): Promise<DeleteTestimonialResult> {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, error: "Authentication required" };
  }

  const validated = deleteTestimonialSchema.safeParse(input);
  if (!validated.success) {
    return { success: false, error: "Invalid testimonial identifier" };
  }

  const { id } = validated.data;
  const testimonial = await prisma.testimonial.findUnique({
    where: { id },
  });

  if (!testimonial) {
    return { success: false, error: "Testimonial not found" };
  }

  // Permission check: Owner or Staff (Marshal/Manager)
  const isOwner = testimonial.userId === user.userId;
  const isStaff = user.role === Role.MARSHAL || user.role === Role.MANAGER;

  if (!isOwner && !isStaff) {
    return { success: false, error: "Unauthorized to delete this testimonial" };
  }

  try {
    await prisma.testimonial.delete({ where: { id } });
    try {
      revalidatePath("/");
      revalidatePath("/profile");
      revalidatePath("/marshal");
    } catch {
      // Safe fallback when invoked in headless/test environments
    }
    return { success: true };
  } catch {
    return { success: false, error: "Failed to delete testimonial" };
  }
}
