"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CourtWithSlots, CourtSlotItem, ScheduleDaySummary } from "./court.types";
import { RentalCatalogItem } from "@/features/rentals/get-rentals.query";
import { BookingModal } from "@/features/bookings/booking-modal";
import { AuthUser } from "@/core/auth/auth.types";

export interface ScheduleCalendarProps {
  courts: CourtWithSlots[];
  dates: ScheduleDaySummary[];
  currentDate: string;
  rentalCatalog: RentalCatalogItem[];
  currentUser: AuthUser | null;
}

export function ScheduleCalendar({
  courts,
  dates,
  currentDate,
  rentalCatalog,
  currentUser,
}: ScheduleCalendarProps) {
  const router = useRouter();
  const [selectedSlotData, setSelectedSlotData] = useState<{
    court: CourtWithSlots;
    slot: CourtSlotItem;
  } | null>(null);

  const handleDateChange = (newDate: string) => {
    router.push(`/schedule?date=${newDate}`);
  };

  const handleSlotClick = (court: CourtWithSlots, slot: CourtSlotItem) => {
    if (slot.status !== "AVAILABLE") return;

    if (!currentUser) {
      router.push(`/login?callbackUrl=/schedule?date=${currentDate}`);
      return;
    }

    setSelectedSlotData({ court, slot });
  };

  const operatingHours: number[] = [];
  for (let h = 7; h <= 22; h++) {
    operatingHours.push(h);
  }

  return (
    <div className="w-full">
      {/* 7-Day Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 border-b border-black/8">
        {dates.map((d) => {
          const isSelected = d.date === currentDate;
          return (
            <button
              key={d.date}
              onClick={() => handleDateChange(d.date)}
              className={`flex-shrink-0 px-4 py-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                isSelected
                  ? "bg-[#252724] border-[#252724] text-white shadow-xs"
                  : "bg-white border-black/8 text-[#252724] hover:bg-[#fbfbfa]"
              }`}
            >
              <div className="text-[10px] uppercase font-mono tracking-wider opacity-70">
                {d.isToday ? "Today" : d.dayName}
              </div>
              <div className="text-sm font-semibold">{d.displayDate}</div>
            </button>
          );
        })}
      </div>

      {/* Legend & Peak Hours Callout */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 text-xs text-neutral-600 bg-white p-3.5 rounded-xl border border-black/8">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-[#eef2ec] border border-[#dbe6d9]" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-amber-50 border border-amber-300" />
            <span>Peak Hours (18:00 - 22:00)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-neutral-200 border border-neutral-300" />
            <span>Reserved</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-neutral-300 border border-dashed border-neutral-400" />
            <span>Maintenance</span>
          </div>
        </div>
        <div className="text-[11px] font-mono text-neutral-500">
          Max 2 consecutive hours per player / day
        </div>
      </div>

      {/* 4-Court Schedule Grid */}
      <div className="overflow-x-auto bg-white rounded-2xl border border-black/8 shadow-xs">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-black/8 bg-[#fbfbfa]">
              <th className="py-3 px-4 text-xs font-mono text-neutral-500 uppercase tracking-wider w-24">
                Time
              </th>
              {courts.map((court) => (
                <th key={court.id} className="py-3 px-4 text-xs font-serif font-semibold text-[#252724]">
                  <div>{court.name}</div>
                  <div className="text-[10px] font-normal text-neutral-500 font-sans">
                    {court.surfaceType} ({court.hourlyRate} AUR/h)
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-black/6">
            {operatingHours.map((hour) => {
              const timeLabel = `${hour.toString().padStart(2, "0")}:00`;
              const isPeakHour = hour >= 18 && hour < 22;

              return (
                <tr key={hour} className="hover:bg-neutral-50/50 transition-colors">
                  <td className="py-2.5 px-4 font-mono text-xs text-neutral-500 bg-[#fbfbfa]/50">
                    <span className={isPeakHour ? "text-amber-700 font-medium" : ""}>
                      {timeLabel}
                    </span>
                  </td>

                  {courts.map((court) => {
                    const slot = court.slots.find((s) => s.startHour === hour);
                    if (!slot) return <td key={court.id} className="p-2" />;

                    const isAvailable = slot.status === "AVAILABLE";
                    const isBooked = slot.status === "BOOKED" || slot.status === "CHECKED_IN";
                    const isMaintenance = slot.status === "MAINTENANCE";

                    return (
                      <td key={court.id} className="p-1.5">
                        <button
                          type="button"
                          disabled={!isAvailable}
                          onClick={() => handleSlotClick(court, slot)}
                          className={`w-full py-2 px-3 rounded-xl text-xs font-medium text-center transition-all ${
                            isAvailable
                              ? isPeakHour
                                ? "bg-amber-50/80 hover:bg-amber-100 text-amber-900 border border-amber-200 cursor-pointer"
                                : "bg-[#eef2ec]/70 hover:bg-[#eef2ec] text-[#5a8357] border border-[#dbe6d9] cursor-pointer"
                              : isBooked
                              ? "bg-neutral-100 text-neutral-400 border border-neutral-200 cursor-not-allowed"
                              : isMaintenance
                              ? "bg-neutral-200 text-neutral-500 border border-dashed border-neutral-300 cursor-not-allowed"
                              : "bg-neutral-100 text-neutral-400 cursor-not-allowed"
                          }`}
                        >
                          {isAvailable ? (
                            <span>Book {court.hourlyRate} AUR</span>
                          ) : isBooked ? (
                            <span>Reserved</span>
                          ) : isMaintenance ? (
                            <span>Locked</span>
                          ) : (
                            <span>Closed</span>
                          )}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Booking Checkout Modal */}
      {selectedSlotData && (
        <BookingModal
          court={selectedSlotData.court}
          selectedSlot={selectedSlotData.slot}
          date={currentDate}
          rentalCatalog={rentalCatalog}
          isOpen={true}
          onClose={() => setSelectedSlotData(null)}
        />
      )}
    </div>
  );
}
