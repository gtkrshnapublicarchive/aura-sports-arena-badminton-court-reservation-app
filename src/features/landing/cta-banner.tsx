import Link from "next/link";

export function CtaBanner() {
  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="rounded-3xl bg-[#252724] text-white p-8 sm:p-14 text-center relative overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-2xl mx-auto">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-mono tracking-wider bg-white/10 text-neutral-300 mb-4 border border-white/10">
            Aura Sports Arena - 12 Veloce Boulevard
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-white tracking-tight">
            Ready to Take the Court?
          </h2>
          <p className="mt-3 text-sm text-neutral-300 leading-relaxed font-sans">
            Check real-time court availability across Courts 1 through 4, reserve your 1-hour time blocks, and have rental rackets waiting at the desk.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/schedule"
              className="px-6 py-3.5 rounded-xl bg-white text-[#252724] text-xs font-bold uppercase tracking-wider hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              Open Schedule Board
            </Link>
            <Link
              href="/register"
              className="px-6 py-3.5 rounded-xl border border-white/20 text-white text-xs font-bold uppercase tracking-wider hover:bg-white/10 transition-colors cursor-pointer"
            >
              Create Player Account
            </Link>
          </div>
        </div>

        {/* Ambient subtle background decorative ring */}
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full border border-white/5 pointer-events-none" />
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full border border-white/5 pointer-events-none" />
      </div>
    </section>
  );
}
