"use server";

import { prisma } from "@/core/db/client";
import { requireMarshal } from "@/core/auth/guards";
import { BookingStatus, SlotStatus } from "@prisma/client";
import { ActionResult } from "@/features/auth/login.action";

export async function checkInBookingAction(
  bookingId: string
): Promise<ActionResult<{ checkedInAt: Date }>> {
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
      error: `Cannot check in reservation with status: ${booking.status}`,
    };
  }

  const now = new Date();

  await prisma.$transaction(async (tx) => {
    await tx.booking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.CHECKED_IN,
        checkedInAt: now,
      },
    });

    await tx.courtSlot.updateMany({
      where: { bookingId },
      data: {
        status: SlotStatus.CHECKED_IN,
      },
    });
  });

  return { success: true, data: { checkedInAt: now } };
}
