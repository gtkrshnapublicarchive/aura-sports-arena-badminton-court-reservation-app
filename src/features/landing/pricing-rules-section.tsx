import Link from "next/link";

export function PricingRulesSection() {
  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-[11px] font-mono text-[#5a8357] uppercase tracking-wider bg-[#eef2ec] px-3 py-1 rounded-full border border-[#dbe6d9]">
          Clear Rates & Operating Rules
        </span>
        <h2 className="text-3xl font-serif font-semibold text-[#252724] mt-3">
          Transparent Aurum (AUR) Rates with Fair Allocation
        </h2>
        <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
          All court reservations are booked online and settled at the front desk upon check-in. No online credit card or third-party fees.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Standard Off-Peak Card */}
        <div className="p-8 rounded-2xl bg-white border border-black/8 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
              Daily Baseline
            </span>
            <h3 className="text-xl font-serif font-semibold text-[#252724] mt-1">
              Standard Hours
            </h3>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-serif font-bold text-[#252724]">50</span>
              <span className="text-sm font-semibold text-neutral-500">AUR / hour</span>
            </div>
            <p className="text-xs text-neutral-500 mt-3">
              Weekdays & weekends across morning and early afternoon slots (07:00 - 18:00, 22:00 - 23:00).
            </p>

            <ul className="mt-6 space-y-2.5 text-xs text-neutral-600 border-t border-black/6 pt-6">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5a8357]" />
                Tournament synthetic rubber court
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5a8357]" />
                Calibrated 850 lux LED lighting
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5a8357]" />
                Full locker & shower room access
              </li>
            </ul>
          </div>

          <div className="mt-8 pt-4">
            <Link
              href="/schedule"
              className="block w-full py-2.5 rounded-xl border border-black/10 text-center text-xs font-semibold text-[#252724] hover:bg-[#fbfbfa] transition-colors"
            >
              Book Standard Slot
            </Link>
          </div>
        </div>

        {/* Peak Prime Hours Card */}
        <div className="p-8 rounded-2xl bg-[#f2f5f0] border-2 border-[#5a8357]/40 shadow-sm flex flex-col justify-between relative">
          <div className="absolute top-4 right-4">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#5a8357] text-white">
              Prime Evening
            </span>
          </div>

          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#5a8357]">
              High Demand
            </span>
            <h3 className="text-xl font-serif font-semibold text-[#252724] mt-1">
              Peak Hours
            </h3>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-serif font-bold text-[#252724]">50</span>
              <span className="text-sm font-semibold text-neutral-500">AUR / hour</span>
            </div>
            <p className="text-xs text-neutral-600 mt-3">
              Weekday evenings (18:00 - 22:00). High demand window backed by strict transactional locking.
            </p>

            <ul className="mt-6 space-y-2.5 text-xs text-neutral-700 border-t border-[#dbe6d9] pt-6">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5a8357]" />
                Guaranteed slot concurrency protection
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5a8357]" />
                Court marshal court rotation supervision
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5a8357]" />
                Priority racket stringing availability
              </li>
            </ul>
          </div>

          <div className="mt-8 pt-4">
            <Link
              href="/schedule"
              className="block w-full py-2.5 rounded-xl bg-[#252724] hover:bg-[#3b3e39] text-center text-xs font-semibold text-white transition-colors"
            >
              Reserve Peak Window
            </Link>
          </div>
        </div>

        {/* Operating Rules & Policies Card */}
        <div className="p-8 rounded-2xl bg-white border border-black/8 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
              Fair Allocation
            </span>
            <h3 className="text-xl font-serif font-semibold text-[#252724] mt-1">
              Arena Policies
            </h3>
            <p className="text-xs text-neutral-500 mt-3">
              Designed to eliminate court hoarding, reduce no-shows, and provide reliable access for all players.
            </p>

            <div className="mt-6 space-y-4 border-t border-black/6 pt-6 text-xs text-neutral-600">
              <div>
                <div className="font-semibold text-[#252724]">2-Hour Daily Cap</div>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  Players may book a maximum of 2 consecutive hours per calendar day.
                </p>
              </div>
              <div>
                <div className="font-semibold text-[#252724]">2-Hour Cancellation Window</div>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  Self-service cancellations allowed up to 2 hours prior to scheduled start time.
                </p>
              </div>
              <div>
                <div className="font-semibold text-[#252724]">15-Min Walk-In Grace Period</div>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  Unattended slots are released at 15 minutes past the hour for waiting walk-in players.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4">
            <Link
              href="/schedule"
              className="block w-full py-2.5 rounded-xl border border-black/10 text-center text-xs font-semibold text-[#252724] hover:bg-[#fbfbfa] transition-colors"
            >
              View 7-Day Calendar
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
