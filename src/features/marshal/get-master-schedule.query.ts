import { prisma } from "@/core/db/client";
import { MarshalCourtMatrix, MarshalSlotDetail } from "./marshal.types";
import { SlotStatus, BookingStatus } from "@prisma/client";

export async function getMasterSchedule(dateStr: string): Promise<MarshalCourtMatrix[]> {
  const courts = await prisma.court.findMany({
    where: { isActive: true },
    orderBy: { courtNumber: "asc" },
  });

  // Ensure all slots exist for this date
  for (const court of courts) {
    for (let startHour = 7; startHour <= 22; startHour++) {
      const isPeak = startHour >= 18 && startHour < 22;
      await prisma.courtSlot.upsert({
        where: {
          courtId_date_startHour: {
            courtId: court.id,
            date: dateStr,
            startHour,
          },
        },
        update: {},
        create: {
          courtId: court.id,
          date: dateStr,
          startHour,
          endHour: startHour + 1,
          status: SlotStatus.AVAILABLE,
          isPeak,
        },
      });
    }
  }

  const courtsWithSlots = await prisma.court.findMany({
    where: { isActive: true },
    orderBy: { courtNumber: "asc" },
    include: {
      slots: {
        where: { date: dateStr },
        orderBy: { startHour: "asc" },
        include: {
          booking: {
            include: {
              user: true,
              rentals: {
                include: {
                  rentalItem: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const now = new Date();

  return courtsWithSlots.map((c) => ({
    id: c.id,
    name: c.name,
    courtNumber: c.courtNumber,
    surfaceType: c.surfaceType,
    hourlyRate: c.hourlyRate,
    slots: c.slots.map((s): MarshalSlotDetail => {
      let bookingDetail = null;

      if (s.booking) {
        const slotStartTime = new Date(
          `${s.date}T${s.startHour.toString().padStart(2, "0")}:00:00`
        );
        // 15-minute grace period check for No-Show button enablement
        const diffMinutes = (now.getTime() - slotStartTime.getTime()) / (1000 * 60);
        const canMarkNoShow =
          s.booking.status === BookingStatus.BOOKED && diffMinutes >= 15;

        bookingDetail = {
          id: s.booking.id,
          bookingReference: s.booking.bookingReference,
          status: s.booking.status,
          totalAmount: s.booking.totalAmount,
          notes: s.booking.notes,
          isWalkIn: s.booking.isWalkIn,
          playerName: s.booking.isWalkIn
            ? s.booking.guestName || "Walk-in Player"
            : s.booking.user.name,
          playerPhone: s.booking.isWalkIn
            ? s.booking.guestPhone || "Counter walk-in"
            : s.booking.user.phone,
          playerEmail: s.booking.isWalkIn ? "Walk-in" : s.booking.user.email,
          rentals: s.booking.rentals.map((r) => ({
            name: r.rentalItem.name,
            itemType: r.rentalItem.itemType,
            quantity: r.quantity,
          })),
          canMarkNoShow,
        };
      }

      return {
        id: s.id,
        courtId: s.courtId,
        courtName: c.name,
        courtNumber: c.courtNumber,
        date: s.date,
        startHour: s.startHour,
        endHour: s.endHour,
        status: s.status,
        isPeak: s.isPeak,
        maintenanceReason: s.maintenanceReason,
        booking: bookingDetail,
      };
    }),
  }));
}
