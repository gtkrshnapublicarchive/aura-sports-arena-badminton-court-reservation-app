"use server";

import { prisma } from "@/core/db/client";
import { requireMarshal } from "@/core/auth/guards";
import { BookingStatus, SlotStatus } from "@prisma/client";
import { ActionResult } from "@/features/auth/login.action";

export async function markNoShowAction(
  bookingId: string
): Promise<ActionResult<{ releasedSlots: number }>> {
  await requireMarshal();

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { slots: true },
  });

  if (!booking) {
    return { success: false, error: "Booking record not found" };
  }

  if (booking.status !== BookingStatus.BOOKED) {
    return {
      success: false,
      error: `Cannot mark no-show on booking with status: ${booking.status}`,
    };
  }

  const slotCount = booking.slots.length;

  await prisma.$transaction(async (tx) => {
    await tx.booking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.NO_SHOW,
      },
    });

    // Free the slots immediately for walk-in players
    await tx.courtSlot.updateMany({
      where: { bookingId },
      data: {
        status: SlotStatus.AVAILABLE,
        bookingId: null,
      },
    });
  });

  return { success: true, data: { releasedSlots: slotCount } };
}
