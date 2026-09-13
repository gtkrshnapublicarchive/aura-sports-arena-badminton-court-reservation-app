import { SlotStatus, BookingStatus, ItemType } from "@prisma/client";

export interface MarshalSlotRental {
  name: string;
  itemType: ItemType;
  quantity: number;
}

export interface MarshalSlotDetail {
  id: string;
  courtId: string;
  courtName: string;
  courtNumber: number;
  date: string;
  startHour: number;
  endHour: number;
  status: SlotStatus;
  isPeak: boolean;
  maintenanceReason?: string | null;
  booking?: {
    id: string;
    bookingReference: string;
    status: BookingStatus;
    totalAmount: number;
    notes?: string | null;
    isWalkIn: boolean;
    playerName: string;
    playerPhone: string;
    playerEmail: string;
    rentals: MarshalSlotRental[];
    canMarkNoShow: boolean;
  } | null;
}

export interface MarshalCourtMatrix {
  id: string;
  name: string;
  courtNumber: number;
  surfaceType: string;
  hourlyRate: number;
  slots: MarshalSlotDetail[];
}
