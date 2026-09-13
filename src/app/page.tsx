import Link from "next/link";
import { Navbar } from "@/components/ui/navbar";
import { getCurrentUser } from "@/core/auth/session";
import { Role } from "@prisma/client";

export default async function LandingPage() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfbfa]">
      <Navbar />

      {/* Hero Section */}
      <main className="flex-1">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-medium bg-[#eef2ec] text-[#5a8357] mb-6 border border-[#dbe6d9]">
            <span className="w-2 h-2 rounded-full bg-[#5a8357]" />
            12 Veloce Boulevard, Aurelia City - 4 Courts Open Daily 07:00 to 23:00
          </div>

          <h1 className="text-4xl sm:text-6xl font-serif font-semibold text-[#252724] tracking-tight max-w-4xl mx-auto leading-tight">
            Precision Badminton Scheduling for Aura Sports Arena
          </h1>

          <p className="mt-6 text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto font-sans leading-relaxed">
            Reserve tournament-grade synthetic rubber courts, pre-order rental rackets and shuttlecocks, and eliminate booking collisions with real-time transactional locking.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/schedule"
              className="px-6 py-3.5 rounded-xl bg-[#252724] hover:bg-[#3b3e39] text-white text-sm font-medium transition-colors shadow-xs"
            >
              View Court Availability & Book
            </Link>
            {!user ? (
              <Link
                href="/login?staff=true"
                className="px-6 py-3.5 rounded-xl border border-black/10 bg-white hover:bg-[#fbfbfa] text-[#252724] text-sm font-medium transition-colors"
              >
                Court Marshal Portal
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
                Open Master Schedule Board
              </Link>
            )}
          </div>
        </section>

        {/* Arena Facility Specifications */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-black/8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-serif font-semibold text-[#252724]">
              Arena Facilities & Court Standards
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              Built for amateur leagues, corporate practice, and competitive tournament play.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-black/8 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-[#eef2ec] text-[#5a8357] flex items-center justify-center font-serif font-bold text-lg mb-4">
                01
              </div>
              <h3 className="text-base font-semibold text-[#252724] mb-2">
                4 Synthetic Rubber Courts
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Tournament-grade shock-absorbing synthetic rubber flooring with anti-glare LED illumination calibrated for high-speed rallies.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-black/8 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-[#eef2ec] text-[#5a8357] flex items-center justify-center font-serif font-bold text-lg mb-4">
                02
              </div>
              <h3 className="text-base font-semibold text-[#252724] mb-2">
                Zero Double-Booking Guarantee
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Row-level transactional concurrency control locks selected time slots during checkout, completely eliminating overlapping bookings.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-black/8 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-[#eef2ec] text-[#5a8357] flex items-center justify-center font-serif font-bold text-lg mb-4">
                03
              </div>
              <h3 className="text-base font-semibold text-[#252724] mb-2">
                Reception Gear Pick-up
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Attach attack/defensive rackets and feather shuttlecock tubes to your court reservation. Gear is packaged and waiting upon arrival.
              </p>
            </div>
          </div>
        </section>

        {/* Operating Rules & Pricing */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mb-12">
          <div className="p-8 rounded-2xl bg-[#eef2ec]/60 border border-[#dbe6d9]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center sm:text-left">
              <div>
                <div className="text-xs text-neutral-500 font-mono uppercase">Court Rate</div>
                <div className="text-2xl font-serif font-bold text-[#252724] mt-1">50 AUR / hr</div>
                <div className="text-[11px] text-neutral-500 mt-0.5">Off-peak & standard slots</div>
              </div>
              <div>
                <div className="text-xs text-neutral-500 font-mono uppercase">Peak Hours</div>
                <div className="text-2xl font-serif font-bold text-[#252724] mt-1">18:00 - 22:00</div>
                <div className="text-[11px] text-neutral-500 mt-0.5">High demand evenings</div>
              </div>
              <div>
                <div className="text-xs text-neutral-500 font-mono uppercase">Player Quota</div>
                <div className="text-2xl font-serif font-bold text-[#252724] mt-1">Max 2 hr / day</div>
                <div className="text-[11px] text-neutral-500 mt-0.5">Enforces court availability</div>
              </div>
              <div>
                <div className="text-xs text-neutral-500 font-mono uppercase">Cancellation</div>
                <div className="text-2xl font-serif font-bold text-[#252724] mt-1">Up to 2 hr prior</div>
                <div className="text-[11px] text-neutral-500 mt-0.5">Frees slot for walk-ins</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-black/8 py-8 bg-white text-xs text-neutral-500 text-center">
        <div className="max-w-7xl mx-auto px-4">
          <p>Aura Sports Arena - Internal Badminton Reservation & Desk Operations Platform</p>
          <p className="text-[11px] text-neutral-400 mt-1 font-mono">
            Aurelia City Case Study. Currency: Aurum (AUR).
          </p>
        </div>
      </footer>
    </div>
  );
}
