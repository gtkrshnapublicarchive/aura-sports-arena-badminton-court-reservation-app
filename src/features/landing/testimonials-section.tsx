import { getPublishedTestimonials } from "@/features/testimonials/queries/get-testimonials.query";
import Link from "next/link";

export async function TestimonialsSection() {
  const dbTestimonials = await getPublishedTestimonials();

  const fallbackTestimonials = [
    {
      id: "seed-1",
      quote:
        "Before this system, our post-work Thursday matches were constantly vulnerable to double-booking conflicts. Now I reserve Court 2 for 19:00 - 21:00 with two attack rackets right from my phone.",
      author: "Julian Hayes",
      role: "Amateur League Captain",
      tag: "Verified Player",
      rating: 5,
    },
    {
      id: "seed-2",
      quote:
        "The real-time availability grid and instant cancellation transparency gave our 12-member club total certainty. We can check slots during lunchtime and confirm attendance immediately.",
      author: "Maya Lin",
      role: "Weekend Club Organizer",
      tag: "Club Member",
      rating: 5,
    },
    {
      id: "seed-3",
      quote:
        "At the desk, front-counter check-ins now take under 20 seconds. The 15-minute no-show release rule keeps courts occupied and makes walk-in players genuinely happy.",
      author: "Tariq Shift Marshal",
      role: "Front Desk Operations",
      tag: "Arena Staff",
      rating: 5,
    },
  ];

  const items = dbTestimonials.length > 0 ? dbTestimonials : fallbackTestimonials;

  return (
    <section className="py-16 bg-[#f2f5f0]/50 border-t border-black/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="max-w-2xl">
            <span className="text-[11px] font-mono text-[#5a8357] uppercase tracking-wider bg-[#eef2ec] px-3 py-1 rounded-full border border-[#dbe6d9]">
              Player & Staff Experiences
            </span>
            <h2 className="text-3xl font-serif font-semibold text-[#252724] mt-3">
              Trusted by Aurelia City Badminton Enthusiasts
            </h2>
            <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
              Real feedback from league captains, weekend players, and shift court marshals operating at Aura Sports Arena daily.
            </p>
          </div>

          <Link
            href="/profile"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-black/8 bg-white hover:bg-[#fbfbfa] text-xs font-medium text-[#252724] shadow-xs transition-colors self-start md:self-auto"
          >
            <span>Share Your Review</span>
            <span className="text-[#5a8357]">&rarr;</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-2xl bg-white border border-black/8 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: item.rating || 5 }).map((_, starIdx) => (
                    <span key={starIdx} className="text-amber-500 text-xs">
                      &#9733;
                    </span>
                  ))}
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed italic">
                  "{item.quote}"
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-black/6 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-[#252724]">{item.author}</div>
                  <div className="text-[11px] text-neutral-400">{item.role}</div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#eef2ec] text-[#5a8357]">
                  {item.tag}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
