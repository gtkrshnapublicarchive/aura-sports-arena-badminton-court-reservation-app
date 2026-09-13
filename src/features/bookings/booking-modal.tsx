"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBookingAction, BookingReceipt } from "./create-booking.action";
import { RentalCatalogItem } from "@/features/rentals/get-rentals.query";
import { CourtWithSlots, CourtSlotItem } from "@/features/courts/court.types";
import { Button } from "@/components/ui/button";

export interface BookingModalProps {
  court: CourtWithSlots;
  selectedSlot: CourtSlotItem;
  date: string;
  rentalCatalog: RentalCatalogItem[];
  isOpen: boolean;
  onClose: () => void;
}

export function BookingModal({
  court,
  selectedSlot,
  date,
  rentalCatalog,
  isOpen,
  onClose,
}: BookingModalProps) {
  const router = useRouter();

  // Check if adjacent next hour is available for 2-hour option
  const nextSlot = court.slots.find((s) => s.startHour === selectedSlot.startHour + 1);
  const canBookTwoHours = nextSlot?.status === "AVAILABLE";

  const [duration, setDuration] = useState<1 | 2>(1);
  const [notes, setNotes] = useState("");
  const [rentals, setRentals] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<BookingReceipt | null>(null);

  if (!isOpen) return null;

  const handleRentalQtyChange = (itemId: string, delta: number, maxQty: number) => {
    const current = rentals[itemId] || 0;
    const updated = Math.max(0, Math.min(maxQty, current + delta));
    setRentals((prev) => ({ ...prev, [itemId]: updated }));
  };

  const selectedStartHours =
    duration === 1 ? [selectedSlot.startHour] : [selectedSlot.startHour, selectedSlot.startHour + 1];

  // Pricing calculations
  const courtCost = court.hourlyRate * duration;
  let rentalsCost = 0;
  for (const item of rentalCatalog) {
    const qty = rentals[item.id] || 0;
    rentalsCost += qty * item.ratePerUnit;
  }
  const totalCost = courtCost + rentalsCost;

  const handleSubmit = async () => {
    setError(null);
    setIsLoading(true);

    const rentalPayload = Object.entries(rentals)
      .filter(([_, qty]) => qty > 0)
      .map(([rentalItemId, quantity]) => ({ rentalItemId, quantity }));

    try {
      const res = await createBookingAction({
        courtId: court.id,
        date,
        startHours: selectedStartHours,
        notes: notes.trim() || undefined,
        rentals: rentalPayload,
      });

      if (!res.success) {
        setError(res.error || "Reservation failed");
        setIsLoading(false);
        return;
      }

      setReceipt(res.data!);
      setIsLoading(false);
    } catch {
      setError("An unexpected network error occurred");
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-black/10 max-w-lg w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        {receipt ? (
          /* Success Receipt Voucher */
          <div className="text-center py-4">
            <div className="w-12 h-12 rounded-full bg-[#eef2ec] text-[#5a8357] mx-auto flex items-center justify-center mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-serif font-semibold text-[#252724]">
              Court Reserved
            </h3>
            <p className="text-xs text-neutral-500 mt-1">
              Your court booking voucher is secured at Aura Sports Arena.
            </p>

            <div className="my-6 p-4 rounded-xl bg-[#fbfbfa] border border-black/8 text-left space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-neutral-500">Booking Reference:</span>
                <span className="font-mono font-bold text-[#252724]">{receipt.bookingReference}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-neutral-500">Court:</span>
                <span className="font-medium text-[#252724]">{receipt.courtName}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-neutral-500">Date & Time:</span>
                <span className="font-medium text-[#252724]">
                  {receipt.date} ({receipt.timeRange})
                </span>
              </div>
              <div className="flex justify-between text-xs pt-2 border-t border-black/8">
                <span className="text-neutral-500">Counter Settlement:</span>
                <span className="font-bold text-[#5a8357]">{receipt.totalAmount} AUR</span>
              </div>
            </div>

            <p className="text-[11px] text-neutral-400 mb-6">
              Payment is settled in Aurum (AUR) at the front desk upon check-in. Please arrive 10 minutes before your slot.
            </p>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  onClose();
                  router.refresh();
                }}
              >
                Close
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                onClick={() => {
                  onClose();
                  router.push("/my-bookings");
                }}
              >
                View My Bookings
              </Button>
            </div>
          </div>
        ) : (
          /* Checkout Booking Form */
          <div>
            <div className="flex justify-between items-start mb-4 pb-3 border-b border-black/8">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#5a8357]">
                  {court.name} - {court.surfaceType}
                </span>
                <h3 className="text-xl font-serif font-semibold text-[#252724]">
                  Reserve Court Time
                </h3>
                <div className="text-xs text-neutral-500 mt-0.5">
                  Date: {date}
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-neutral-400 hover:text-[#252724] text-lg font-bold cursor-pointer"
              >
                x
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
                {error}
              </div>
            )}

            {/* Duration Choice */}
            <div className="mb-5">
              <label className="block text-xs font-medium text-[#252724] mb-2">
                Booking Duration
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDuration(1)}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    duration === 1
                      ? "border-[#252724] bg-[#fbfbfa]"
                      : "border-black/10 hover:border-black/20"
                  }`}
                >
                  <div className="text-xs font-bold text-[#252724]">1 Hour Slot</div>
                  <div className="text-[11px] text-neutral-500">
                    {selectedSlot.startHour}:00 - {selectedSlot.startHour + 1}:00
                  </div>
                  <div className="text-xs font-semibold text-[#5a8357] mt-1">
                    {court.hourlyRate} AUR
                  </div>
                </button>

                <button
                  type="button"
                  disabled={!canBookTwoHours}
                  onClick={() => canBookTwoHours && setDuration(2)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    !canBookTwoHours
                      ? "opacity-40 cursor-not-allowed border-dashed"
                      : duration === 2
                      ? "border-[#252724] bg-[#fbfbfa] cursor-pointer"
                      : "border-black/10 hover:border-black/20 cursor-pointer"
                  }`}
                >
                  <div className="text-xs font-bold text-[#252724]">2 Consecutive Hours</div>
                  <div className="text-[11px] text-neutral-500">
                    {canBookTwoHours
                      ? `${selectedSlot.startHour}:00 - ${selectedSlot.startHour + 2}:00`
                      : "Next hour unavailable"}
                  </div>
                  <div className="text-xs font-semibold text-[#5a8357] mt-1">
                    {court.hourlyRate * 2} AUR
                  </div>
                </button>
              </div>
            </div>

            {/* Rental Add-ons */}
            <div className="mb-5">
              <div className="flex justify-between items-baseline mb-2">
                <label className="text-xs font-medium text-[#252724]">
                  Equipment Rental Add-ons (Optional)
                </label>
                <span className="text-[10px] text-neutral-400">
                  Ready at reception desk
                </span>
              </div>
              <div className="space-y-2">
                {rentalCatalog.map((item) => {
                  const qty = rentals[item.id] || 0;
                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-2.5 rounded-xl border border-black/8 bg-[#fbfbfa]"
                    >
                      <div>
                        <div className="text-xs font-medium text-[#252724]">
                          {item.name}
                        </div>
                        <div className="text-[10px] text-neutral-500">
                          {item.ratePerUnit} AUR / unit (max {item.maxQuantityPerBooking})
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={qty === 0}
                          onClick={() => handleRentalQtyChange(item.id, -1, item.maxQuantityPerBooking)}
                          className="w-7 h-7 rounded-lg border border-black/10 flex items-center justify-center text-xs font-bold disabled:opacity-30 hover:bg-neutral-100 cursor-pointer"
                        >
                          -
                        </button>
                        <span className="w-5 text-center text-xs font-bold font-mono">
                          {qty}
                        </span>
                        <button
                          type="button"
                          disabled={qty >= item.maxQuantityPerBooking}
                          onClick={() => handleRentalQtyChange(item.id, 1, item.maxQuantityPerBooking)}
                          className="w-7 h-7 rounded-lg border border-black/10 flex items-center justify-center text-xs font-bold disabled:opacity-30 hover:bg-neutral-100 cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Special Instructions / Notes */}
            <div className="mb-5">
              <label className="block text-xs font-medium text-[#252724] mb-1">
                Booking Notes (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Practice match, racket stringing request"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded-xl bg-white px-3 py-2 text-xs border border-black/10 focus:outline-none focus:ring-2 focus:ring-[#668c63]"
                maxLength={200}
              />
            </div>

            {/* Cost Summary Box */}
            <div className="p-3.5 rounded-xl bg-[#eef2ec] border border-[#dbe6d9] mb-5">
              <div className="flex justify-between text-xs text-neutral-600 mb-1">
                <span>Court ({duration} hr):</span>
                <span>{courtCost} AUR</span>
              </div>
              {rentalsCost > 0 && (
                <div className="flex justify-between text-xs text-neutral-600 mb-1">
                  <span>Rental Equipment:</span>
                  <span>{rentalsCost} AUR</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-[#252724] pt-2 border-t border-[#dbe6d9]">
                <span>Total Counter Settlement:</span>
                <span className="text-[#5a8357]">{totalCost} AUR</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={onClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button variant="primary" className="flex-1" onClick={handleSubmit} isLoading={isLoading}>
                Confirm Reservation
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
