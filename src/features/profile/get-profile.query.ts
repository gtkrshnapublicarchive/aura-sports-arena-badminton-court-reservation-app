import { prisma } from "@/core/db/client";
import { UserProfileData } from "./profile.types";
import { BookingStatus, Role } from "@prisma/client";

export async function getUserProfile(userId: string): Promise<UserProfileData | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      createdAt: true,
    },
  });

  if (!user) return null;

  const stats: UserProfileData["stats"] = {};

  if (user.role === Role.PLAYER) {
    const [total, upcoming, slotsCount] = await Promise.all([
      prisma.booking.count({ where: { userId } }),
      prisma.booking.count({
        where: { userId, status: BookingStatus.BOOKED },
      }),
      prisma.courtSlot.count({
        where: { booking: { userId } },
      }),
    ]);
    stats.totalBookings = total;
    stats.upcomingBookings = upcoming;
    stats.totalHoursBooked = slotsCount;
  } else if (user.role === Role.MARSHAL) {
    const [checkedIn, walkIns, totalArenaBookings] = await Promise.all([
      prisma.booking.count({ where: { status: BookingStatus.CHECKED_IN } }),
      prisma.booking.count({ where: { isWalkIn: true } }),
      prisma.booking.count(),
    ]);
    stats.checkInsProcessed = checkedIn;
    stats.walkInsCreated = walkIns;
    stats.totalBookings = totalArenaBookings;
  } else if (user.role === Role.MANAGER) {
    const [courtsCount, totalBookings, checkedIn] = await Promise.all([
      prisma.court.count({ where: { isActive: true } }),
      prisma.booking.count(),
      prisma.booking.count({ where: { status: BookingStatus.CHECKED_IN } }),
    ]);
    stats.courtsActive = courtsCount;
    stats.totalBookings = totalBookings;
    stats.checkInsProcessed = checkedIn;
  }

  return {
    ...user,
    stats,
  };
}
