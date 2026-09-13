"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MarshalCourtMatrix, MarshalSlotDetail } from "./marshal.types";
import { ScheduleDaySummary } from "@/features/courts/court.types";
import { RentalCatalogItem } from "@/features/rentals/get-rentals.query";
import { checkInBookingAction } from "./actions/check-in.action";
import { markNoShowAction } from "./actions/no-show.action";
import { WalkInModal } from "./walkin-modal";
import { MaintenanceModal } from "./maintenance-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface MasterScheduleBoardProps {
  courts: MarshalCourtMatrix[];
  dates: ScheduleDaySummary[];
  currentDate: string;
  rentalCatalog: RentalCatalogItem[];
}

export function MasterScheduleBoard({
  courts,
  dates,
  currentDate,
  rentalCatalog,
}: MasterScheduleBoardProps) {
  const router = useRouter();
  const [selectedWalkInSlot, setSelectedWalkInSlot] = useState<MarshalSlotDetail | null>(null);
  const [selectedMaintenanceSlot, setSelectedMaintenanceSlot] = useState<MarshalSlotDetail | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [filterQuery, setFilterQuery] = useState("");

  const handleDateSelect = (date: string) => {
    router.push(`/marshal?date=${date}`);
  };

  const handleCheckIn = async (bookingId: string) => {
    setActionLoadingId(bookingId);
    try {
      const res = await checkInBookingAction(bookingId);
      if (!res.success) {
        alert(res.error || "Check-in failed");
      } else {
        router.refresh();
      }
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleNoShow = async (bookingId: string) => {
    if (!confirm("Confirm marking player as No-Show? This will immediately free the court slot.")) {
      return;
    }
    setActionLoadingId(bookingId);
    try {
      const res = await markNoShowAction(bookingId);
      if (!res.success) {
        alert(res.error || "Failed to mark no-show");
      } else {
        router.refresh();
      }
    } finally {
      setActionLoadingId(null);
    }
  };

  const operatingHours: number[] = [];
  for (let h = 7; h <= 22; h++) {
    operatingHours.push(h);
  }

  return (
    <div className="w-full space-y-6">
      {/* Date Navigation & Search Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
          {dates.map((d) => {
            const isSelected = d.date === currentDate;
            return (
              <button
                key={d.date}
                onClick={() => handleDateSelect(d.date)}
                className={`flex-shrink-0 px-3.5 py-2 rounded-xl border text-left cursor-pointer transition-all ${
                  isSelected
                    ? "bg-[#252724] border-[#252724] text-white shadow-xs"
                    : "bg-white border-black/8 text-[#252724] hover:bg-[#fbfbfa]"
                }`}
              >
                <div className="text-[10px] uppercase font-mono tracking-wider opacity-70">
                  {d.isToday ? "Today" : d.dayName}
                </div>
                <div className="text-xs font-semibold">{d.displayDate}</div>
              </button>
            );
          })}
        </div>

        <div className="w-full sm:w-64">
          <input
            type="text"
            placeholder="Filter player or reference..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="w-full rounded-xl bg-white px-3.5 py-2 text-xs border border-black/10 focus:outline-none focus:ring-2 focus:ring-[#668c63]"
          />
        </div>
      </div>

      {/* Master 4-Court Board Matrix */}
      <div className="overflow-x-auto bg-white rounded-2xl border border-black/8 shadow-xs">
        <table className="w-full text-left border-collapse min-w-[850px]">
          <thead>
            <tr className="border-b border-black/8 bg-[#fbfbfa]">
              <th className="py-3 px-4 text-xs font-mono text-neutral-500 uppercase tracking-wider w-20">
                Time
              </th>
              {courts.map((court) => (
                <th key={court.id} className="py-3 px-4 text-xs font-serif font-semibold text-[#252724]">
                  <div>{court.name}</div>
                  <div className="text-[10px] text-neutral-400 font-sans">
                    {court.surfaceType}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-black/6">
            {operatingHours.map((hour) => {
              const timeLabel = `${hour.toString().padStart(2, "0")}:00`;
              const isPeak = hour >= 18 && hour < 22;

              return (
                <tr key={hour} className="hover:bg-neutral-50/40 transition-colors">
                  <td className="py-3 px-4 font-mono text-xs text-neutral-500 bg-[#fbfbfa]/50 align-top">
                    <span className={isPeak ? "text-amber-700 font-semibold" : ""}>
                      {timeLabel}
                    </span>
                  </td>

                  {courts.map((court) => {
                    const slot = court.slots.find((s) => s.startHour === hour);
                    if (!slot) return <td key={court.id} className="p-2" />;

                    const matchesFilter =
                      !filterQuery ||
                      slot.booking?.playerName.toLowerCase().includes(filterQuery.toLowerCase()) ||
                      slot.booking?.bookingReference.toLowerCase().includes(filterQuery.toLowerCase());

                    if (filterQuery && !matchesFilter && slot.status !== "AVAILABLE") {
                      return (
                        <td key={court.id} className="p-2 opacity-30">
                          <div className="p-2 rounded-lg bg-neutral-100 text-[11px] text-neutral-400">
                            Hidden by filter
                          </div>
                        </td>
                      );
                    }

                    return (
                      <td key={court.id} className="p-2 align-top">
                        {slot.status === "AVAILABLE" ? (
                          <div className="p-2.5 rounded-xl border border-dashed border-black/10 bg-[#fbfbfa] flex items-center justify-between gap-1 group">
                            <span className="text-[11px] text-neutral-400 font-mono">Vacant</span>
                            <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => setSelectedWalkInSlot(slot)}
                                className="px-2 py-1 rounded-lg bg-white border border-black/10 text-[10px] font-medium text-[#252724] hover:bg-neutral-100 cursor-pointer"
                              >
                                + Walk-in
                              </button>
                              <button
                                onClick={() => setSelectedMaintenanceSlot(slot)}
                                className="px-1.5 py-1 rounded-lg border border-black/10 text-[10px] text-neutral-400 hover:text-neutral-700 cursor-pointer"
                                title="Lock Maintenance"
                              >
                                Lock
                              </button>
                            </div>
                          </div>
                        ) : slot.status === "BOOKED" && slot.booking ? (
                          <div className="p-3 rounded-xl border border-amber-200 bg-amber-50/50 space-y-1.5 shadow-2xs">
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-[11px] font-bold text-[#252724]">
                                {slot.booking.bookingReference}
                              </span>
                              <Badge variant="warning">Reserved</Badge>
                            </div>

                            <div className="text-xs font-semibold text-[#252724]">
                              {slot.booking.playerName}
                            </div>
                            <div className="text-[10px] text-neutral-500 font-mono">
                              {slot.booking.playerPhone}
                            </div>

                            {slot.booking.rentals.length > 0 && (
                              <div className="text-[10px] text-neutral-600 flex gap-1 flex-wrap">
                                {slot.booking.rentals.map((r, i) => (
                                  <span key={i} className="px-1.5 py-0.5 rounded bg-white text-neutral-700">
                                    {r.quantity}x {r.name.split(" ")[0]}
                                  </span>
                                ))}
                              </div>
                            )}

                            <div className="pt-2 flex items-center gap-1.5 border-t border-amber-200/60">
                              <Button
                                size="sm"
                                variant="primary"
                                className="flex-1 text-[10px] py-1 h-7"
                                isLoading={actionLoadingId === slot.booking.id}
                                onClick={() => handleCheckIn(slot.booking!.id)}
                              >
                                Check-In
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-[10px] py-1 h-7 text-rose-600 hover:bg-rose-50 border-rose-200"
                                isLoading={actionLoadingId === slot.booking.id}
                                onClick={() => handleNoShow(slot.booking!.id)}
                              >
                                No-Show
                              </Button>
                            </div>
                          </div>
                        ) : slot.status === "CHECKED_IN" && slot.booking ? (
                          <div className="p-3 rounded-xl border border-[#dbe6d9] bg-[#eef2ec]/70 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-[11px] font-bold text-[#252724]">
                                {slot.booking.bookingReference}
                              </span>
                              <Badge variant="sage">Active Play</Badge>
                            </div>
                            <div className="text-xs font-medium text-[#252724]">
                              {slot.booking.playerName}
                            </div>
                            <div className="text-[10px] text-neutral-500">
                              Settled: {slot.booking.totalAmount} AUR
                            </div>
                          </div>
                        ) : slot.status === "MAINTENANCE" ? (
                          <div className="p-2.5 rounded-xl border border-neutral-300 bg-neutral-100 flex items-center justify-between gap-2">
                            <div>
                              <div className="text-xs font-medium text-neutral-700">Maintenance</div>
                              <div className="text-[10px] text-neutral-500 truncate max-w-[120px]">
                                {slot.maintenanceReason || "Locked"}
                              </div>
                            </div>
                            <button
                              onClick={() => setSelectedMaintenanceSlot(slot)}
                              className="px-2 py-1 rounded-lg bg-white border border-neutral-300 text-[10px] text-neutral-600 hover:bg-neutral-50 cursor-pointer"
                            >
                              Unlock
                            </button>
                          </div>
                        ) : null}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {selectedWalkInSlot && (
        <WalkInModal
          slot={selectedWalkInSlot}
          rentalCatalog={rentalCatalog}
          isOpen={true}
          onClose={() => setSelectedWalkInSlot(null)}
        />
      )}

      {selectedMaintenanceSlot && (
        <MaintenanceModal
          slot={selectedMaintenanceSlot}
          isOpen={true}
          onClose={() => setSelectedMaintenanceSlot(null)}
        />
      )}
    </div>
  );
}
