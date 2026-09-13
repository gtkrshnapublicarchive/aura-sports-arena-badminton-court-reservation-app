import Link from "next/link";
import Image from "next/image";
import { AuthUser } from "@/core/auth/auth.types";
import { Role } from "@prisma/client";

export function HeroSection({ user }: { user: AuthUser | null }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
      {/* Top Tagline */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-medium bg-[#eef2ec] text-[#5a8357] mb-6 border border-[#dbe6d9]">
          <span className="w-2 h-2 rounded-full bg-[#5a8357]" />
          12 Veloce Boulevard, Aurelia City - Open Daily 07:00 to 23:00
        </div>

        <h1 className="text-4xl sm:text-6xl font-serif font-semibold text-[#252724] tracking-tight max-w-4xl mx-auto leading-tight">
          Precision Badminton Courts for Competitive & League Play
        </h1>

        <p className="mt-6 text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto font-sans leading-relaxed">
          Four tournament-calibrated synthetic rubber courts with glare-free LED lighting. Reserve 1-hour slots in real time with transactional zero-collision protection.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/schedule"
            className="px-6 py-3.5 rounded-xl bg-[#252724] hover:bg-[#3b3e39] text-white text-sm font-medium transition-colors shadow-xs"
          >
            View Live Court Schedule
          </Link>
          {!user ? (
            <Link
              href="/register"
              className="px-6 py-3.5 rounded-xl border border-black/10 bg-white hover:bg-[#fbfbfa] text-[#252724] text-sm font-medium transition-colors"
            >
              Register Player Account
            </Link>
          ) : user.role === Role.PLAYER ? (
            <Link
              href="/my-bookings"
              className="px-6 py-3.5 rounded-xl border border-black/10 bg-white hover:bg-[#fbfbfa] text-[#252724] text-sm font-medium transition-colors"
            >
              My Reservations
            </Link>
          ) : (
            <Link
              href="/marshal"
              className="px-6 py-3.5 rounded-xl border border-black/10 bg-white hover:bg-[#fbfbfa] text-[#252724] text-sm font-medium transition-colors"
            >
              Open Master Board
            </Link>
          )}
        </div>
      </div>

      {/* Featured Arena Visual */}
      <div className="mt-12 relative rounded-3xl overflow-hidden border border-black/10 shadow-lg">
        <Image
          src="/images/arena-hero.jpg"
          alt="Aura Sports Arena interior badminton courts"
          width={1280}
          height={720}
          priority
          className="w-full h-auto object-cover max-h-[560px]"
        />
        {/* Floating Live Badge */}
        <div className="absolute bottom-6 left-6 right-6 sm:right-auto bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-black/10 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-[#5a8357] animate-pulse" />
            <div>
              <div className="text-xs font-bold text-[#252724]">
                Aura Sports Arena - Live Status
              </div>
              <div className="text-[11px] text-neutral-500">
                4 Courts Active - Zero Double-Booking Concurrency Lock
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-black/8 text-center sm:text-left">
          <div className="text-[11px] font-mono uppercase text-neutral-400">Court Count</div>
          <div className="text-2xl font-serif font-bold text-[#252724] mt-0.5">4 Synthetic</div>
          <div className="text-xs text-neutral-500">Rubber shock absorption</div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-black/8 text-center sm:text-left">
          <div className="text-[11px] font-mono uppercase text-neutral-400">Daily Hours</div>
          <div className="text-2xl font-serif font-bold text-[#252724] mt-0.5">07:00 - 23:00</div>
          <div className="text-xs text-neutral-500">16 hourly blocks daily</div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-black/8 text-center sm:text-left">
          <div className="text-[11px] font-mono uppercase text-neutral-400">Hourly Rate</div>
          <div className="text-2xl font-serif font-bold text-[#252724] mt-0.5">50 AUR</div>
          <div className="text-xs text-neutral-500">Desk counter settlement</div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-black/8 text-center sm:text-left">
          <div className="text-[11px] font-mono uppercase text-neutral-400">Conflict Rate</div>
          <div className="text-2xl font-serif font-bold text-[#5a8357] mt-0.5">0.00%</div>
          <div className="text-xs text-neutral-500">Row-level ACID locking</div>
        </div>
      </div>
    </section>
  );
}
