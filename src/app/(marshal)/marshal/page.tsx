import { format, addDays, isSameDay } from "date-fns";
import Link from "next/link";
import { MessageSquare } from "lucide-react";
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

          <div className="flex items-center gap-3">
            <Link
              href="/marshal/testimonials"
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-black/10 bg-white hover:bg-[#fbfbfa] text-xs font-medium text-[#252724] transition-colors shadow-xs"
            >
              <MessageSquare className="w-4 h-4 text-[#5a8357]" />
              <span>Moderate Testimonials</span>
            </Link>
            <Link
              href="/profile"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-black/10 bg-white hover:bg-[#fbfbfa] text-xs font-medium text-[#252724] transition-colors shadow-xs"
            >
              <svg
                className="w-4 h-4 text-neutral-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.75}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span>Marshal Profile Settings</span>
            </Link>
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
