import Image from "next/image";
import Link from "next/link";

export function GearShowcaseSection() {
  const rentalOptions = [
    {
      name: "Pro Tournament Rackets",
      desc: "Even-balanced high-modulus graphite frame, strung at 26 lbs with high-repulsion string.",
      price: "10 AUR / booking",
      limit: "Max 4 per reservation",
    },
    {
      name: "Aura Attack Rackets",
      desc: "Head-heavy aerodynamic carbon frame for players with an aggressive rear-court smash style.",
      price: "15 AUR / booking",
      limit: "Max 4 per reservation",
    },
    {
      name: "AeroSensa Feather Shuttles",
      desc: "Selected goose feather tournament grade shuttlecocks, grade 1 flight consistency (Tube of 6).",
      price: "20 AUR / tube",
      limit: "Max 2 per reservation",
    },
    {
      name: "Synthetic Training Shuttles",
      desc: "Durable precision-molded nylon skirt shuttlecocks with natural cork base (Tube of 6).",
      price: "12 AUR / tube",
      limit: "Max 2 per reservation",
    },
  ];

  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Visual Showcase */}
        <div className="lg:col-span-6">
          <div className="relative rounded-3xl overflow-hidden border border-black/10 shadow-md">
            <Image
              src="/images/arena-gear.jpg"
              alt="Professional badminton rackets and shuttlecocks at Aura Sports Arena"
              width={800}
              height={600}
              className="w-full h-auto object-cover"
            />
            <div className="p-4 bg-white/95 backdrop-blur-xs border-t border-black/8">
              <div className="text-xs font-semibold text-[#252724]">
                Arena Reception Gear Vault
              </div>
              <div className="text-[11px] text-neutral-500">
                Freshly prepped, inspected, and packaged for your group prior to court start time.
              </div>
            </div>
          </div>
        </div>

        {/* Content & Rental List */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <span className="text-[11px] font-mono text-[#5a8357] uppercase tracking-wider bg-[#eef2ec] px-3 py-1 rounded-full border border-[#dbe6d9]">
              Front Desk Add-ons
            </span>
            <h2 className="text-3xl font-serif font-semibold text-[#252724] mt-3">
              Tournament Equipment Waiting at Your Arrival
            </h2>
            <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
              Never worry about broken strings or unboxed shuttles. Attach rental gear directly during your online court checkout and collect it at the marshal desk in seconds.
            </p>
          </div>

          <div className="space-y-3">
            {rentalOptions.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-black/8 bg-white hover:border-black/15 transition-colors"
              >
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-semibold text-[#252724]">
                    {item.name}
                  </span>
                  <span className="text-xs font-bold text-[#5a8357] font-mono">
                    {item.price}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500 mt-1 leading-normal">
                  {item.desc}
                </p>
                <div className="mt-1.5 text-[10px] text-neutral-400 font-mono">
                  {item.limit}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <Link
              href="/schedule"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#252724] hover:text-[#5a8357] transition-colors"
            >
              <span>Book a court and attach gear</span>
              <span>-&gt;</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
