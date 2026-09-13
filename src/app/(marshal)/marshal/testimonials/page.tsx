import Link from "next/link";
import { requireMarshal } from "@/core/auth/guards";
import { getAllTestimonials } from "@/features/testimonials/queries/get-testimonials.query";
import { StaffTestimonialManager } from "@/features/testimonials/staff-testimonial-manager";
import { Navbar } from "@/components/ui/navbar";
import { MessageSquare, ArrowLeft } from "lucide-react";

export default async function MarshalTestimonialsPage() {
  const staff = await requireMarshal();
  const testimonials = await getAllTestimonials();

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfbfa]">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#5a8357] animate-pulse" />
              <span className="text-[11px] font-mono text-[#5a8357] uppercase tracking-wider bg-[#eef2ec] px-2.5 py-0.5 rounded-full">
                Front Desk Operations
              </span>
            </div>
            <h1 className="text-3xl font-serif font-semibold text-[#252724] mt-2">
              Testimonials Moderation Console
            </h1>
            <p className="text-xs text-neutral-500 mt-0.5">
              Operator: {staff.name} ({staff.role}) - Review, approve, publish, and moderate member feedback displayed on the arena landing page.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/marshal"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-black/8 bg-white hover:bg-[#fbfbfa] text-xs font-medium text-[#252724] transition-colors shadow-2xs"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-neutral-500" />
              <span>Master Schedule</span>
            </Link>
          </div>
        </div>

        <StaffTestimonialManager initialTestimonials={testimonials} />
      </main>
    </div>
  );
}
