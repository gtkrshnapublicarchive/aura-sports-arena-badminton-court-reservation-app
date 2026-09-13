import { format, addDays, isSameDay } from "date-fns";
import { getCourtSchedule } from "@/features/courts/get-schedule.query";
import { getActiveRentalItems } from "@/features/rentals/get-rentals.query";
import { getCurrentUser } from "@/core/auth/session";
import { Navbar } from "@/components/ui/navbar";
import { ScheduleCalendar } from "@/features/courts/schedule-calendar";
import { ScheduleDaySummary } from "@/features/courts/court.types";

export interface SchedulePageProps {
  searchParams: Promise<{ date?: string }>;
}

export default async function SchedulePage({ searchParams }: SchedulePageProps) {
  const resolvedParams = await searchParams;
  const now = new Date();
  const todayStr = format(now, "yyyy-MM-dd");
  const targetDate = resolvedParams.date || todayStr;

  // Generate 7 consecutive days starting from today
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

  const [courts, rentalCatalog, currentUser] = await Promise.all([
    getCourtSchedule(targetDate),
    getActiveRentalItems(),
    getCurrentUser(),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfbfa]">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <span className="text-[11px] font-mono text-[#5a8357] uppercase tracking-wider bg-[#eef2ec] px-3 py-1 rounded-full">
            Real-Time Court Availability
          </span>
          <h1 className="text-3xl font-serif font-semibold text-[#252724] mt-2">
            Badminton Court Schedule
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Reserve up to 2 consecutive hours per day across 4 tournament-grade rubber courts.
          </p>
        </div>

        <ScheduleCalendar
          courts={courts}
          dates={dates}
          currentDate={targetDate}
          rentalCatalog={rentalCatalog}
          currentUser={currentUser}
        />
      </main>
    </div>
  );
}
