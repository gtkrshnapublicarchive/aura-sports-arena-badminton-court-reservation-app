import { format, addDays, isSameDay } from "date-fns";
import { requireMarshal } from "@/core/auth/guards";
import { getMasterSchedule } from "@/features/marshal/get-master-schedule.query";
import { getActiveRentalItems } from "@/features/rentals/get-rentals.query";
import { Navbar } from "@/components/ui/navbar";
import { MasterScheduleBoard } from "@/features/marshal/master-schedule-board";
import { ScheduleDaySummary } from "@/features/courts/court.types";

export interface MarshalPageProps {
  searchParams: Promise<{ date?: string }>;
}

export default async function MarshalPage({ searchParams }: MarshalPageProps) {
  const staff = await requireMarshal();
  const resolvedParams = await searchParams;

  const now = new Date();
  const todayStr = format(now, "yyyy-MM-dd");
  const targetDate = resolvedParams.date || todayStr;

  const dates: ScheduleDaySummary[] = [];
  for (let i = 0; i < 7; i++) {
    const day = addDays(now, i);
    const dateStr = format(day, "yyyy-MM-dd");
    dates.push({
      date: dateStr,
      dayName: format(day, "EEE"),
      displayDate: format(day, "MMM d"),
      isToday: isSameDay(day, now),
    });
  }

  const [courts, rentalCatalog] = await Promise.all([
    getMasterSchedule(targetDate),
    getActiveRentalItems(),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfbfa]">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#5a8357] animate-pulse" />
              <span className="text-[11px] font-mono text-[#5a8357] uppercase tracking-wider bg-[#eef2ec] px-2.5 py-0.5 rounded-full">
                Front Desk Console
              </span>
            </div>
            <h1 className="text-3xl font-serif font-semibold text-[#252724] mt-2">
              Master Court Schedule Board
            </h1>
            <p className="text-xs text-neutral-500 mt-0.5">
              Marshal Operator: {staff.name} ({staff.role}) - Desk check-in, no-show release, walk-in creation, and court locks.
            </p>
          </div>
        </div>

        <MasterScheduleBoard
          courts={courts}
          dates={dates}
          currentDate={targetDate}
          rentalCatalog={rentalCatalog}
        />
      </main>
    </div>
  );
}
