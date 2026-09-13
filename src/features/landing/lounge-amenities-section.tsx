import Image from "next/image";

export function LoungeAmenitiesSection() {
  const amenities = [
    {
      title: "Executive Players Lounge",
      desc: "Warm Scandinavian seating area with court-monitoring screens, high-speed WiFi, and match analysis stations.",
    },
    {
      title: "Individual Hot Shower Suites & Lockers",
      desc: "Keycard-secured lockers, clean showers, and grooming amenities for post-match transitions straight to work or evening plans.",
    },
    {
      title: "Pro Stringing & Grip Service",
      desc: "On-site electronic constant-pull stringing machine operated by arena staff. Drop off pre-game, pick up post-match.",
    },
    {
      title: "Hydration & Nutritional Bar",
      desc: "Electrolyte dispensers, filtered ice-water stations, and sports nutrition recovery drinks available at the desk.",
    },
  ];

  return (
    <section className="py-16 bg-[#f2f5f0]/40 border-t border-black/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Amenities details */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-[11px] font-mono text-[#5a8357] uppercase tracking-wider bg-[#eef2ec] px-3 py-1 rounded-full border border-[#dbe6d9]">
                Athlete Hospitality
              </span>
              <h2 className="text-3xl font-serif font-semibold text-[#252724] mt-3">
                More Than Just a Court: A Complete Badminton Center
              </h2>
              <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                From morning training sessions to high-stakes evening league rallies, our facilities ensure every minute spent at Aura Sports Arena is seamless and comfortable.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {amenities.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-white border border-black/8 shadow-2xs"
                >
                  <h3 className="text-xs font-semibold text-[#252724] mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-neutral-500 leading-normal">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Lounge Image */}
          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden border border-black/10 shadow-md">
              <Image
                src="/images/arena-lounge.jpg"
                alt="Aura Sports Arena reception desk and player lounge"
                width={800}
                height={600}
                className="w-full h-auto object-cover"
              />
              <div className="p-4 bg-white/95 backdrop-blur-xs border-t border-black/8">
                <div className="text-xs font-semibold text-[#252724]">
                  Aura Reception & Front Desk
                </div>
                <div className="text-[11px] text-neutral-500">
                  Staffed by court marshals throughout all operating hours (07:00 - 23:00).
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
