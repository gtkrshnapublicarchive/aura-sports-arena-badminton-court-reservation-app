import { z } from "zod";

export const createBookingSchema = z.object({
  courtId: z.string().min(1, "Court ID is required"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in format YYYY-MM-DD"),
  startHours: z
    .array(z.number().int().min(7).max(22))
    .min(1, "At least 1 hour slot must be selected")
    .max(2, "Maximum 2 consecutive hours permitted per day"),
  notes: z.string().max(300).optional(),
  rentals: z
    .array(
      z.object({
        rentalItemId: z.string().min(1),
        quantity: z.number().int().min(1),
      })
    )
    .optional(),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
