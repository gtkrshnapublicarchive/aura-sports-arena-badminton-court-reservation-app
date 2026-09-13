import { prisma } from "@/core/db/client";
import { BookingStatus, SlotStatus, ItemType } from "@prisma/client";

export interface MyBookingRental {
  name: string;
  itemType: ItemType;
  quantity: number;
  unitRate: number;
  subtotal: number;
}

export interface MyBookingItem {
  id: string;
  bookingReference: string;
  courtName: string;
  courtNumber: number;
  date: string;
  timeRange: string;
  status: BookingStatus;
  totalAmount: number;
  createdAt: Date;
  notes?: string | null;
  canCancel: boolean;
  rentals: MyBookingRental[];
}

export async function getPlayerBookings(userId: string): Promise<MyBookingItem[]> {
  const bookings = await prisma.booking.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      slots: {
        include: {
          court: true,
        },
        orderBy: { startHour: "asc" },
      },
      rentals: {
        include: {
          rentalItem: true,
        },
      },
    },
  });

  const now = new Date();

  return bookings.map((b) => {
    const earliestSlot = b.slots[0];
    const courtName = earliestSlot?.court.name || "Court";
    const courtNumber = earliestSlot?.court.courtNumber || 1;
    const date = earliestSlot?.date || "";

    let timeRange = "";
    if (b.slots.length > 0) {
      const startHour = b.slots[0].startHour;
      const endHour = b.slots[b.slots.length - 1].endHour;
      timeRange = `${startHour.toString().padStart(2, "0")}:00 - ${endHour
        .toString()
        .padStart(2, "0")}:00`;
    }

    let canCancel = false;
    if (b.status === BookingStatus.BOOKED && earliestSlot) {
      const startTime = new Date(
        `${earliestSlot.date}T${earliestSlot.startHour.toString().padStart(2, "0")}:00:00`
      );
      const diffHours = (startTime.getTime() - now.getTime()) / (1000 * 60 * 60);
      canCancel = diffHours >= 2;
    }

    return {
      id: b.id,
      bookingReference: b.bookingReference,
      courtName,
      courtNumber,
      date,
      timeRange,
      status: b.status,
      totalAmount: b.totalAmount,
      createdAt: b.createdAt,
      notes: b.notes,
      canCancel,
      rentals: b.rentals.map((r) => ({
        name: r.rentalItem.name,
        itemType: r.rentalItem.itemType,
        quantity: r.quantity,
        unitRate: r.unitRate,
        subtotal: r.subtotal,
      })),
    };
  });
}
