import { z } from "zod";

export const updatePlayerProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(8, "Phone number is required for booking contact"),
  skillLevel: z.string().optional(),
  dominantHand: z.string().optional(),
  emergencyContact: z.string().optional(),
});

export const updateStaffProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(8, "Phone number is required"),
  shiftPreference: z.string().optional(),
  radioChannel: z.string().optional(),
  emergencyContact: z.string().optional(),
});

export const updateManagerProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(8, "Direct contact phone is required"),
  facilityAnnouncement: z.string().max(250).optional(),
  escalationPhone: z.string().optional(),
});

export type UpdatePlayerProfileInput = z.infer<typeof updatePlayerProfileSchema>;
export type UpdateStaffProfileInput = z.infer<typeof updateStaffProfileSchema>;
export type UpdateManagerProfileInput = z.infer<typeof updateManagerProfileSchema>;
