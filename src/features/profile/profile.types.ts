import { Role } from "@prisma/client";

export interface UserProfileData {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  createdAt: Date;
  stats: {
    totalBookings?: number;
    upcomingBookings?: number;
    totalHoursBooked?: number;
    checkInsProcessed?: number;
    walkInsCreated?: number;
    courtsActive?: number;
  };
}
