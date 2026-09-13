"use server";

import { prisma } from "@/core/db/client";
import { requireMarshal } from "@/core/auth/guards";
import { SlotStatus } from "@prisma/client";
import { ActionResult } from "@/features/auth/login.action";

export interface ToggleMaintenanceInput {
  slotId: string;
  reason?: string;
}

export async function toggleMaintenanceAction(
  input: ToggleMaintenanceInput
): Promise<ActionResult<{ newStatus: SlotStatus }>> {
  await requireMarshal();

  const slot = await prisma.courtSlot.findUnique({
    where: { id: input.slotId },
  });

  if (!slot) {
    return { success: false, error: "Target court slot not found" };
  }

  if (slot.status === SlotStatus.BOOKED || slot.status === SlotStatus.CHECKED_IN) {
    return {
      success: false,
      error: "Cannot lock an actively reserved slot for maintenance. Cancel or reassign the booking first.",
    };
  }

  const isCurrentlyMaintenance = slot.status === SlotStatus.MAINTENANCE;
  const newStatus = isCurrentlyMaintenance ? SlotStatus.AVAILABLE : SlotStatus.MAINTENANCE;
  const maintenanceReason = isCurrentlyMaintenance ? null : input.reason || "Routine Cleaning / Maintenance";

  await prisma.courtSlot.update({
    where: { id: input.slotId },
    data: {
      status: newStatus,
      maintenanceReason,
    },
  });

  return { success: true, data: { newStatus } };
}
