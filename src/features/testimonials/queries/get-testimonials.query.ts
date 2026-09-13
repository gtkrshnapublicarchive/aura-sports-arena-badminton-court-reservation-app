import { prisma } from "@/core/db/client";
import { TestimonialItem } from "../testimonials.types";

export async function getPublishedTestimonials(): Promise<TestimonialItem[]> {
  const testimonials = await prisma.testimonial.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
    take: 9,
  });

  return testimonials;
}

export async function getUserTestimonial(
  userId: string
): Promise<TestimonialItem | null> {
  const testimonial = await prisma.testimonial.findFirst({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });

  return testimonial;
}

export async function getAllTestimonials(): Promise<TestimonialItem[]> {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: { createdAt: "desc" },
  });

  return testimonials;
}
