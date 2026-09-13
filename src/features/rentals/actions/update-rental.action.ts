"use server";

import { requireMarshal } from "@/core/auth/guards";
import { prisma } from "@/core/db/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const updateRentalSchema = z.object({
  id: z.string().min(1),
  isActive: z.boolean().optional(),
  ratePerUnit: z.number().int().min(1).max(500).optional(),
  maxQuantityPerBooking: z.number().int().min(1).max(20).optional(),
});

export type UpdateRentalInput = z.infer<typeof updateRentalSchema>;

export async function updateRentalItemAction(input: UpdateRentalInput) {
  try {
    await requireMarshal();

    const parsed = updateRentalSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: "Invalid equipment configuration." };
    }

    const { id, isActive, ratePerUnit, maxQuantityPerBooking } = parsed.data;

    const dataToUpdate: Record<string, unknown> = {};
    if (typeof isActive === "boolean") dataToUpdate.isActive = isActive;
    if (typeof ratePerUnit === "number") dataToUpdate.ratePerUnit = ratePerUnit;
    if (typeof maxQuantityPerBooking === "number") {
      dataToUpdate.maxQuantityPerBooking = maxQuantityPerBooking;
    }

    await prisma.rentalItem.update({
      where: { id },
      data: dataToUpdate,
    });

    try {
      revalidatePath("/marshal/rentals");
      revalidatePath("/marshal");
      revalidatePath("/schedule");
      revalidatePath("/");
    } catch {
      // Invariant safe for headless test runs
    }

    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update equipment item";
    return { success: false, error: message };
  }
}
