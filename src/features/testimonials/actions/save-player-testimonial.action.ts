"use server";

import { prisma } from "@/core/db/client";
import { getCurrentUser } from "@/core/auth/session";
import { testimonialSchema, TestimonialInput } from "../testimonials.schemas";
import { revalidatePath } from "next/cache";

export interface SaveTestimonialResult {
  success: boolean;
  error?: string;
  testimonialId?: string;
}

export async function savePlayerTestimonialAction(
  input: TestimonialInput
): Promise<SaveTestimonialResult> {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, error: "Authentication required to share experience" };
  }

  const validated = testimonialSchema.safeParse(input);
  if (!validated.success) {
    return {
      success: false,
      error: validated.error.issues[0]?.message || "Validation failed",
    };
  }

  const { role, tag, quote, rating, isPublished } = validated.data;
  const authorName = validated.data.author || user.name;

  try {
    const existing = await prisma.testimonial.findFirst({
      where: { userId: user.userId },
    });

    let savedId: string;
    if (existing) {
      const updated = await prisma.testimonial.update({
        where: { id: existing.id },
        data: {
          author: authorName,
          role,
          tag,
          quote,
          rating,
          isPublished,
        },
      });
      savedId = updated.id;
    } else {
      const created = await prisma.testimonial.create({
        data: {
          userId: user.userId,
          author: authorName,
          role,
          tag,
          quote,
          rating,
          isPublished,
        },
      });
      savedId = created.id;
    }

    try {
      revalidatePath("/");
      revalidatePath("/profile");
    } catch {
      // Safe fallback when invoked in headless/test environments
    }

    return { success: true, testimonialId: savedId };
  } catch {
    return { success: false, error: "Failed to save testimonial" };
  }
}
