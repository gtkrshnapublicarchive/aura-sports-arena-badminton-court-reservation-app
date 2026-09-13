"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MyBookingItem } from "./get-my-bookings.query";
import { cancelBookingAction } from "./cancel-booking.action";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function MyBookingsList({ bookings }: { bookings: MyBookingItem[] }) {
  const router = useRouter();
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCancel = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this reservation? The court slot will be released immediately.")) {
      return;
    }

    setCancellingId(bookingId);
    setErrorMessage(null);

    try {
      const res = await cancelBookingAction(bookingId);
      if (!res.success) {
        setErrorMessage(res.error || "Failed to cancel booking");
        setCancellingId(null);
        return;
      }
      router.refresh();
      setCancellingId(null);
    } catch {
      setErrorMessage("An unexpected network error occurred");
      setCancellingId(null);
    }
  };

  if (bookings.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-black/8 p-12 text-center">
        <h3 className="text-lg font-serif font-semibold text-[#252724] mb-2">
          No Court Reservations Found
        </h3>
        <p className="text-xs text-neutral-500 mb-6">
          You haven't reserved any court slots yet.
        </p>
        <Button onClick={() => router.push("/schedule")}>
          View Court Schedule
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
          {errorMessage}
        </div>
      )}

      {bookings.map((booking) => {
        const isBooked = booking.status === "BOOKED";
        const isCheckedIn = booking.status === "CHECKED_IN";
        const isCancelled = booking.status === "CANCELLED";
        const isNoShow = booking.status === "NO_SHOW";
        const isCompleted = booking.status === "COMPLETED";

        const badgeVariant = isBooked
          ? "sage"
          : isCheckedIn
          ? "info"
          : isCancelled || isNoShow
          ? "danger"
          : "neutral";

        return (
          <div
            key={booking.id}
            className="bg-white rounded-2xl border border-black/8 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-sm text-[#252724]">
                  {booking.bookingReference}
                </span>
                <Badge variant={badgeVariant}>{booking.status}</Badge>
              </div>

              <div className="text-base font-serif font-semibold text-[#252724]">
                {booking.courtName} - {booking.date} ({booking.timeRange})
              </div>

              {booking.rentals.length > 0 && (
                <div className="text-xs text-neutral-600 flex items-center gap-2 flex-wrap">
                  <span className="text-neutral-400">Add-ons:</span>
                  {booking.rentals.map((r, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 text-[11px]">
                      {r.quantity}x {r.name}
                    </span>
                  ))}
                </div>
              )}

              {booking.notes && (
                <div className="text-xs text-neutral-500 italic">
                  Notes: "{booking.notes}"
                </div>
              )}
            </div>

            <div className="flex flex-col md:items-end gap-3 border-t md:border-t-0 pt-4 md:pt-0 border-black/8">
              <div className="text-right">
                <div className="text-xs text-neutral-400">Desk Settlement</div>
                <div className="text-lg font-bold text-[#5a8357]">{booking.totalAmount} AUR</div>
              </div>

              {isBooked && (
                <div className="flex items-center gap-2">
                  {booking.canCancel ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-rose-600 hover:bg-rose-50 border-rose-200"
                      onClick={() => handleCancel(booking.id)}
                      isLoading={cancellingId === booking.id}
                    >
                      Cancel Reservation
                    </Button>
                  ) : (
                    <span className="text-[11px] text-neutral-400 max-w-[200px] text-right">
                      Cancellation window closed (&lt; 2h from start)
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
