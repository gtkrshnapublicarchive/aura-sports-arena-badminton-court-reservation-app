"use server";

import { prisma } from "@/core/db/client";
import { getCurrentUser } from "@/core/auth/session";
import { createBookingSchema, CreateBookingInput } from "./booking.schemas";
import { generateBookingReference } from "./generate-reference";
import { SlotStatus, BookingStatus, Role } from "@prisma/client";
import { ActionResult } from "@/features/auth/login.action";

export interface BookingReceipt {
  bookingReference: string;
  totalAmount: number;
  courtName: string;
  date: string;
  timeRange: string;
}

export async function createBookingAction(
  input: CreateBookingInput
): Promise<ActionResult<BookingReceipt>> {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, error: "Please log in to reserve a court" };
  }

  const validated = createBookingSchema.safeParse(input);
  if (!validated.success) {
    return {
      success: false,
      error: validated.error.issues[0]?.message || "Invalid booking data",
    };
  }

  const { courtId, date, startHours, notes, rentals = [] } = validated.data;
  startHours.sort((a, b) => a - b);

  // Consecutive hours check
  if (startHours.length === 2 && startHours[1] !== startHours[0] + 1) {
    return {
      success: false,
      error: "Booked hours must be adjacent consecutive time slots",
    };
  }

  // Daily quota check: Max 2 hours per day per player
  if (user.role === Role.PLAYER) {
    const existingPlayerSlotsToday = await prisma.courtSlot.count({
      where: {
        date,
        status: { in: [SlotStatus.BOOKED, SlotStatus.CHECKED_IN] },
        booking: {
          userId: user.userId,
          status: { in: [BookingStatus.BOOKED, BookingStatus.CHECKED_IN] },
        },
      },
    });

    if (existingPlayerSlotsToday + startHours.length > 2) {
      return {
        success: false,
        error: `Daily limit exceeded: Players may book a maximum of 2 hours per day (already booked: ${existingPlayerSlotsToday} hr)`,
      };
    }
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Concurrency Control: PostgreSQL row-level lock
      // Query target slots with FOR UPDATE to prevent race conditions
      const lockedSlots: Array<{
        id: string;
        courtId: string;
        status: SlotStatus;
        startHour: number;
      }> = await tx.$queryRaw`
        SELECT id, "courtId", status, "startHour"
        FROM court_slots
        WHERE "courtId" = ${courtId}
          AND date = ${date}
          AND "startHour" = ANY(${startHours}::int[])
        FOR UPDATE
      `;

      if (lockedSlots.length !== startHours.length) {
        throw new Error("One or more selected slots are invalid or unconfigured");
      }

      for (const slot of lockedSlots) {
        if (slot.status !== SlotStatus.AVAILABLE) {
          throw new Error(
            `Court slot ${slot.startHour}:00 - ${slot.startHour + 1}:00 was just reserved or locked for maintenance`
          );
        }
      }

      // 2. Fetch court info for rate calculation
      const court = await tx.court.findUnique({
        where: { id: courtId },
      });
      if (!court) {
        throw new Error("Court not found");
      }

      const courtSubtotal = court.hourlyRate * startHours.length;

      // 3. Process Rental Items
      let rentalsSubtotal = 0;
      const rentalCreations: Array<{
        rentalItemId: string;
        quantity: number;
        unitRate: number;
        subtotal: number;
      }> = [];

      for (const r of rentals) {
        if (r.quantity <= 0) continue;
        const item = await tx.rentalItem.findUnique({
          where: { id: r.rentalItemId },
        });
        if (!item || !item.isActive) {
          throw new Error("One of the selected rental items is unavailable");
        }
        if (r.quantity > item.maxQuantityPerBooking) {
          throw new Error(
            `Exceeded limit for ${item.name}: maximum ${item.maxQuantityPerBooking} allowed per booking`
          );
        }
        const itemSubtotal = item.ratePerUnit * r.quantity;
        rentalsSubtotal += itemSubtotal;
        rentalCreations.push({
          rentalItemId: item.id,
          quantity: r.quantity,
          unitRate: item.ratePerUnit,
          subtotal: itemSubtotal,
        });
      }

      const totalAmount = courtSubtotal + rentalsSubtotal;
      const bookingReference = generateBookingReference();

      // 4. Create Booking record
      const booking = await tx.booking.create({
        data: {
          bookingReference,
          userId: user.userId,
          status: BookingStatus.BOOKED,
          totalAmount,
          notes,
          rentals: {
            create: rentalCreations,
          },
        },
      });

      // 5. Update slot states to BOOKED
      await tx.courtSlot.updateMany({
        where: {
          id: { in: lockedSlots.map((s) => s.id) },
        },
        data: {
          status: SlotStatus.BOOKED,
          bookingId: booking.id,
        },
      });

      const startHourMin = Math.min(...startHours);
      const endHourMax = Math.max(...startHours) + 1;
      const timeRange = `${startHourMin.toString().padStart(2, "0")}:00 - ${endHourMax
        .toString()
        .padStart(2, "0")}:00`;

      return {
        bookingReference,
        totalAmount,
        courtName: court.name,
        date,
        timeRange,
      };
    });

    return { success: true, data: result };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Reservation conflict occurred";
    return { success: false, error: message };
  }
}
