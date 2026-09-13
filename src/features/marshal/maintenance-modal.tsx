"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toggleMaintenanceAction } from "./actions/toggle-maintenance.action";
import { MarshalSlotDetail } from "./marshal.types";
import { Button } from "@/components/ui/button";

export interface MaintenanceModalProps {
  slot: MarshalSlotDetail;
  isOpen: boolean;
  onClose: () => void;
}

export function MaintenanceModal({ slot, isOpen, onClose }: MaintenanceModalProps) {
  const router = useRouter();
  const [reason, setReason] = useState(slot.maintenanceReason || "Mat Cleaning / Polishing");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const isLocked = slot.status === "MAINTENANCE";

  const handleToggle = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const res = await toggleMaintenanceAction({
        slotId: slot.id,
        reason: isLocked ? undefined : reason,
      });

      if (!res.success) {
        setError(res.error || "Failed to update maintenance state");
        setIsLoading(false);
        return;
      }

      router.refresh();
      onClose();
    } catch {
      setError("An unexpected network error occurred");
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-black/10 max-w-sm w-full p-6 shadow-xl">
        <h3 className="text-xl font-serif font-semibold text-[#252724] mb-1">
          {isLocked ? "Unlock Court Slot" : "Lock for Maintenance"}
        </h3>
        <p className="text-xs text-neutral-500 mb-4">
          {slot.courtName} at {slot.startHour}:00 - {slot.endHour}:00 ({slot.date})
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
            {error}
          </div>
        )}

        {!isLocked && (
          <div className="mb-4">
            <label className="block text-xs font-medium text-[#252724] mb-1.5">
              Reason / Work Order
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full rounded-xl bg-white px-3 py-2 text-xs border border-black/10 focus:outline-none focus:ring-2 focus:ring-[#668c63]"
            >
              <option value="Mat Cleaning & Disinfection">Mat Cleaning & Disinfection</option>
              <option value="LED Lighting Calibration & Replacement">LED Lighting Calibration & Replacement</option>
              <option value="Net Tension Adjustment">Net Tension Adjustment</option>
              <option value="Arena Event / League Reserved">Arena Event / League Reserved</option>
            </select>
          </div>
        )}

        <p className="text-xs text-neutral-600 mb-6">
          {isLocked
            ? "Releasing this court slot will make it immediately available for player reservations."
            : "Locking this slot prevents players from reserving this hour."}
        </p>

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant={isLocked ? "primary" : "danger"}
            className="flex-1"
            onClick={handleToggle}
            isLoading={isLoading}
          >
            {isLocked ? "Restore Slot" : "Lock Court Slot"}
          </Button>
        </div>
      </div>
    </div>
  );
}
