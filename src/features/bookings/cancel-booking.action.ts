"use server";

import { prisma } from "@/core/db/client";
import { getCurrentUser } from "@/core/auth/session";
import { BookingStatus, SlotStatus, Role } from "@prisma/client";
import { ActionResult } from "@/features/auth/login.action";

export async function cancelBookingAction(
  bookingId: string
): Promise<ActionResult<{ freedSlots: number }>> {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, error: "Please log in to manage reservations" };
  }

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      slots: {
        orderBy: { startHour: "asc" },
      },
    },
  });

  // Anti-IDOR: Return 404 / not found error if booking doesn't exist or belongs to another player
  if (!booking) {
    return { success: false, error: "Booking record not found" };
  }

  if (user.role === Role.PLAYER && booking.userId !== user.userId) {
    return { success: false, error: "Booking record not found" };
  }

  if (booking.status !== BookingStatus.BOOKED) {
    return {
      success: false,
      error: `Cannot cancel booking with status: ${booking.status}`,
    };
  }

  if (booking.slots.length === 0) {
    return { success: false, error: "No court slots linked to this reservation" };
  }

  // Check 2-hour window rule for players (Marshals have desk override)
  if (user.role === Role.PLAYER) {
    const earliestSlot = booking.slots[0];
    const scheduledStartTime = new Date(
      `${earliestSlot.date}T${earliestSlot.startHour.toString().padStart(2, "0")}:00:00`
    );
    const now = new Date();
    const hoursDifference = (scheduledStartTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursDifference < 2) {
      return {
        success: false,
        error:
          "Self-service cancellation closed: Reservations cannot be cancelled within 2 hours of start time. Please contact court marshals at the desk.",
      };
    }
  }

  // Atomically cancel booking and free linked slots
  await prisma.$transaction(async (tx) => {
    await tx.booking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.CANCELLED,
        cancelledAt: new Date(),
      },
    });

    await tx.courtSlot.updateMany({
      where: { bookingId },
      data: {
        status: SlotStatus.AVAILABLE,
        bookingId: null,
      },
    });
  });

  return { success: true, data: { freedSlots: booking.slots.length } };
}
