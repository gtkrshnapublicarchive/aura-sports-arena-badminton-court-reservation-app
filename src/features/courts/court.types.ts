import { SlotStatus } from "@prisma/client";

export interface CourtSlotItem {
  id: string;
  courtId: string;
  date: string;
  startHour: number;
  endHour: number;
  status: SlotStatus;
  isPeak: boolean;
  maintenanceReason?: string | null;
  bookingId?: string | null;
}

export interface CourtWithSlots {
  id: string;
  name: string;
  courtNumber: number;
  surfaceType: string;
  hourlyRate: number;
  slots: CourtSlotItem[];
}

export interface ScheduleDaySummary {
  date: string;
  dayName: string;
  displayDate: string;
  isToday: boolean;
}
