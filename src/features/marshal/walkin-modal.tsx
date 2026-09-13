"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createWalkInBookingAction } from "./actions/create-walkin.action";
import { MarshalSlotDetail } from "./marshal.types";
import { RentalCatalogItem } from "@/features/rentals/get-rentals.query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface WalkInModalProps {
  slot: MarshalSlotDetail;
  rentalCatalog: RentalCatalogItem[];
  isOpen: boolean;
  onClose: () => void;
}

export function WalkInModal({ slot, rentalCatalog, isOpen, onClose }: WalkInModalProps) {
  const router = useRouter();
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [rentals, setRentals] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRentalChange = (itemId: string, delta: number, maxQty: number) => {
    const current = rentals[itemId] || 0;
    const next = Math.max(0, Math.min(maxQty, current + delta));
    setRentals((prev) => ({ ...prev, [itemId]: next }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const rentalPayload = Object.entries(rentals)
      .filter(([_, qty]) => qty > 0)
      .map(([rentalItemId, quantity]) => ({ rentalItemId, quantity }));

    try {
      const res = await createWalkInBookingAction({
        courtId: slot.courtId,
        date: slot.date,
        startHours: [slot.startHour],
        guestName,
        guestPhone,
        notes,
        rentals: rentalPayload,
      });

      if (!res.success) {
        setError(res.error || "Failed to create walk-in reservation");
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
      <div className="bg-white rounded-2xl border border-black/10 max-w-md w-full p-6 shadow-xl">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-serif font-semibold text-[#252724]">
              Walk-In Court Check-In
            </h3>
            <p className="text-xs text-neutral-500">
              {slot.courtName} - {slot.startHour}:00 to {slot.endHour}:00
            </p>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-[#252724] cursor-pointer">
            x
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Player / Party Name"
            placeholder="e.g. Alex Tan"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            required
          />
          <Input
            label="Contact Mobile"
            placeholder="e.g. +1-555-0199"
            value={guestPhone}
            onChange={(e) => setGuestPhone(e.target.value)}
            required
          />

          <div>
            <label className="block text-xs font-medium text-[#252724] mb-1.5">
              Equipment Handed Over at Desk
            </label>
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {rentalCatalog.map((item) => {
                const qty = rentals[item.id] || 0;
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2 rounded-lg border border-black/6 bg-[#fbfbfa] text-xs"
                  >
                    <span>{item.name}</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleRentalChange(item.id, -1, item.maxQuantityPerBooking)}
                        className="w-6 h-6 rounded border border-black/10 flex items-center justify-center font-bold"
                      >
                        -
                      </button>
                      <span className="w-4 text-center font-mono font-bold">{qty}</span>
                      <button
                        type="button"
                        onClick={() => handleRentalChange(item.id, 1, item.maxQuantityPerBooking)}
                        className="w-6 h-6 rounded border border-black/10 flex items-center justify-center font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <Input
            label="Notes"
            placeholder="e.g. Paid in cash AUR"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" className="flex-1" type="submit" isLoading={isLoading}>
              Confirm Walk-In
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
