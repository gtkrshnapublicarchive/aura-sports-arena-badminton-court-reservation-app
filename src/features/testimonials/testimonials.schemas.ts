import { z } from "zod";

export const testimonialSchema = z.object({
  author: z
    .string()
    .trim()
    .min(2, "Author name must be at least 2 characters")
    .max(80, "Author name must not exceed 80 characters")
    .optional(),
  role: z
    .string()
    .trim()
    .min(2, "Role / Title must be at least 2 characters")
    .max(60, "Role must not exceed 60 characters"),
  tag: z
    .string()
    .trim()
    .min(2, "Tag must be at least 2 characters")
    .max(40, "Tag must not exceed 40 characters"),
  quote: z
    .string()
    .trim()
    .min(10, "Testimonial quote must be at least 10 characters")
    .max(600, "Testimonial quote must not exceed 600 characters"),
  rating: z
    .number()
    .int()
    .min(1, "Rating must be between 1 and 5")
    .max(5, "Rating must be between 1 and 5")
    .default(5),
  isPublished: z.boolean().default(true),
});

export const togglePublishSchema = z.object({
  id: z.string().min(1, "Testimonial ID is required"),
  isPublished: z.boolean(),
});

export const deleteTestimonialSchema = z.object({
  id: z.string().min(1, "Testimonial ID is required"),
});

export type TestimonialInput = z.infer<typeof testimonialSchema>;
export type TogglePublishInput = z.infer<typeof togglePublishSchema>;
export type DeleteTestimonialInput = z.infer<typeof deleteTestimonialSchema>;
