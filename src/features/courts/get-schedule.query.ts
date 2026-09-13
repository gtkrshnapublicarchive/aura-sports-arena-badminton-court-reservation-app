import { prisma } from "@/core/db/client";
import { CourtWithSlots } from "./court.types";
import { SlotStatus } from "@prisma/client";

export async function getCourtSchedule(dateStr: string): Promise<CourtWithSlots[]> {
  const courts = await prisma.court.findMany({
    where: { isActive: true },
    orderBy: { courtNumber: "asc" },
  });

  // Ensure slots exist for this date and all active courts
  const operatingHours: number[] = [];
  for (let h = 7; h <= 22; h++) {
    operatingHours.push(h);
  }

  // Pre-seed any missing slots for the requested date seamlessly
  for (const court of courts) {
    for (const startHour of operatingHours) {
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

  // Retrieve courts with ordered slots for the date
  const courtsWithSlots = await prisma.court.findMany({
    where: { isActive: true },
    orderBy: { courtNumber: "asc" },
    include: {
      slots: {
        where: { date: dateStr },
        orderBy: { startHour: "asc" },
      },
    },
  });

  return courtsWithSlots.map((c) => ({
    id: c.id,
    name: c.name,
    courtNumber: c.courtNumber,
    surfaceType: c.surfaceType,
    hourlyRate: c.hourlyRate,
    slots: c.slots.map((s) => ({
      id: s.id,
      courtId: s.courtId,
      date: s.date,
      startHour: s.startHour,
      endHour: s.endHour,
      status: s.status,
      isPeak: s.isPeak,
      maintenanceReason: s.maintenanceReason,
      bookingId: s.bookingId,
    })),
  }));
}
