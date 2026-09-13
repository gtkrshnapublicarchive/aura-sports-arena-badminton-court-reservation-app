export function CourtSpecsSection() {
  const specs = [
    {
      num: "01",
      title: "Synthetic Shock-Absorbing Rubber Mats",
      desc: "5.5mm multi-layer high-density PVC/rubber court mats designed to absorb knee and ankle shock during aggressive lunges and jumping smashes.",
      detail: "BWF-certified friction coefficient",
    },
    {
      num: "02",
      title: "Anti-Glare Linear LED Lighting",
      desc: "Calibrated 850 lux illumination positioned symmetrically along side boundaries, avoiding vertical glare when tracking high defensive clears.",
      detail: "Zero-strobe 5000K daylight white",
    },
    {
      num: "03",
      title: "Independent Lighting Controls",
      desc: "Automated marshal desk controls coordinate individual court lighting directly with reservation start and end times for energy efficiency.",
      detail: "Synchronized to master schedule",
    },
    {
      num: "04",
      title: "Thermal & Air Velocity Regulation",
      desc: "Constant 21°C climate control with low-velocity laminar airflow dampers, preventing artificial shuttlecock drift during high-speed rallies.",
      detail: "Zero cross-court draft interference",
    },
  ];

  return (
    <section className="py-16 bg-[#f2f5f0]/60 border-y border-black/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <span className="text-[11px] font-mono text-[#5a8357] uppercase tracking-wider bg-[#eef2ec] px-3 py-1 rounded-full border border-[#dbe6d9]">
            Court Engineering & Build
          </span>
          <h2 className="text-3xl font-serif font-semibold text-[#252724] mt-3">
            Engineered for Precision Rallies and Player Safety
          </h2>
          <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
            Every specification at Aura Sports Arena is built to eliminate distractions, protect athlete joints, and provide true shuttle flight trajectories.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {specs.map((item) => (
            <div
              key={item.num}
              className="p-6 rounded-2xl bg-white border border-black/8 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#eef2ec] text-[#5a8357] flex items-center justify-center font-serif font-bold text-sm mb-4">
                  {item.num}
                </div>
                <h3 className="text-sm font-semibold text-[#252724] mb-2 leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-black/6 text-[10px] font-mono text-[#5a8357]">
                {item.detail}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
