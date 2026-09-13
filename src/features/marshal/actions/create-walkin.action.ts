"use server";

import { prisma } from "@/core/db/client";
import { requireMarshal } from "@/core/auth/guards";
import { generateBookingReference } from "@/features/bookings/generate-reference";
import { SlotStatus, BookingStatus } from "@prisma/client";
import { ActionResult } from "@/features/auth/login.action";

export interface CreateWalkInInput {
  courtId: string;
  date: string;
  startHours: number[];
  guestName: string;
  guestPhone: string;
  notes?: string;
  rentals?: Array<{ rentalItemId: string; quantity: number }>;
}

export async function createWalkInBookingAction(
  input: CreateWalkInInput
): Promise<ActionResult<{ bookingReference: string; totalAmount: number }>> {
  const staff = await requireMarshal();

  const { courtId, date, startHours, guestName, guestPhone, notes, rentals = [] } = input;
  startHours.sort((a, b) => a - b);

  if (startHours.length === 0 || startHours.length > 2) {
    return { success: false, error: "Must select 1 or 2 consecutive hours" };
  }

  if (startHours.length === 2 && startHours[1] !== startHours[0] + 1) {
    return { success: false, error: "Selected hours must be consecutive" };
  }

  if (!guestName.trim()) {
    return { success: false, error: "Player name is required for walk-in reservation" };
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      // Row-level lock
      const lockedSlots: Array<{ id: string; status: SlotStatus }> = await tx.$queryRaw`
        SELECT id, status
        FROM court_slots
        WHERE "courtId" = ${courtId}
          AND date = ${date}
          AND "startHour" = ANY(${startHours}::int[])
        FOR UPDATE
      `;

      if (lockedSlots.length !== startHours.length) {
        throw new Error("Target slots are invalid");
      }

      for (const slot of lockedSlots) {
        if (slot.status !== SlotStatus.AVAILABLE) {
          throw new Error("One or more target slots are not available for booking");
        }
      }

      const court = await tx.court.findUnique({ where: { id: courtId } });
      if (!court) throw new Error("Court not found");

      let totalCost = court.hourlyRate * startHours.length;
      const rentalCreations: Array<{
        rentalItemId: string;
        quantity: number;
        unitRate: number;
        subtotal: number;
      }> = [];

      for (const r of rentals) {
        if (r.quantity <= 0) continue;
        const item = await tx.rentalItem.findUnique({ where: { id: r.rentalItemId } });
        if (!item) continue;
        const subtotal = item.ratePerUnit * r.quantity;
        totalCost += subtotal;
        rentalCreations.push({
          rentalItemId: item.id,
          quantity: r.quantity,
          unitRate: item.ratePerUnit,
          subtotal,
        });
      }

      const bookingReference = generateBookingReference();

      // Create Booking record
      const booking = await tx.booking.create({
        data: {
          bookingReference,
          userId: staff.userId, // Stored with staff creator
          isWalkIn: true,
          guestName,
          guestPhone,
          status: BookingStatus.CHECKED_IN, // Walk-ins are physically present at counter
          checkedInAt: new Date(),
          totalAmount: totalCost,
          notes: notes?.trim() || "Desk walk-in registration",
          rentals: {
            create: rentalCreations,
          },
        },
      });

      await tx.courtSlot.updateMany({
        where: { id: { in: lockedSlots.map((s) => s.id) } },
        data: {
          status: SlotStatus.CHECKED_IN,
          bookingId: booking.id,
        },
      });

      return { bookingReference, totalAmount: totalCost };
    });

    return { success: true, data: result };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create walk-in reservation";
    return { success: false, error: message };
  }
}
