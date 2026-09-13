"use client";

import { useState } from "react";
import { TestimonialItem } from "./testimonials.types";
import { toggleTestimonialPublishAction } from "./actions/toggle-testimonial-publish.action";
import { deleteTestimonialAction } from "./actions/delete-testimonial.action";

interface Props {
  initialTestimonials: TestimonialItem[];
}

export function StaffTestimonialManager({ initialTestimonials }: Props) {
  const [items, setItems] = useState<TestimonialItem[]>(initialTestimonials);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleToggle = async (id: string, currentStatus: boolean) => {
    setProcessingId(id);
    const nextStatus = !currentStatus;
    const res = await toggleTestimonialPublishAction({ id, isPublished: nextStatus });
    setProcessingId(null);

    if (res.success) {
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, isPublished: nextStatus } : item))
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Permanently delete this testimonial?")) return;

    setProcessingId(id);
    const res = await deleteTestimonialAction({ id });
    setProcessingId(null);

    if (res.success) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-black/8 p-6 sm:p-8 shadow-xs">
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-[10px] font-mono text-[#5a8357] uppercase tracking-wider bg-[#eef2ec] px-2.5 py-0.5 rounded-full">
            Moderation Console
          </span>
          <h3 className="text-xl font-serif font-semibold text-[#252724] mt-1.5">
            Testimonial & Review Moderation
          </h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            Approve, publish, or remove player feedback featured on the arena landing page.
          </p>
        </div>
        <span className="text-xs font-mono text-neutral-500 bg-neutral-100 px-3 py-1 rounded-full">
          {items.length} Total Reviews
        </span>
      </div>

      {items.length === 0 ? (
        <div className="p-8 text-center border border-dashed border-black/10 rounded-2xl">
          <p className="text-xs text-neutral-400 font-mono">No testimonials recorded in database.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl border border-black/8 bg-[#fbfbfa] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-[#252724]">{item.author}</span>
                  <span className="text-[10px] font-mono text-neutral-400">&bull; {item.role}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#eef2ec] text-[#5a8357]">
                    {item.tag}
                  </span>
                  <span className="text-[10px] font-mono text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded">
                    {item.rating}&#9733;
                  </span>
                </div>
                <p className="text-xs text-neutral-600 italic line-clamp-2 leading-relaxed">
                  "{item.quote}"
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  disabled={processingId === item.id}
                  onClick={() => handleToggle(item.id, item.isPublished)}
                  className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer ${
                    item.isPublished
                      ? "bg-[#eef2ec] text-[#5a8357] hover:bg-[#dbe6d9]"
                      : "bg-neutral-200 text-neutral-600 hover:bg-neutral-300"
                  }`}
                >
                  {item.isPublished ? "Published" : "Hidden (Draft)"}
                </button>

                <button
                  type="button"
                  disabled={processingId === item.id}
                  onClick={() => handleDelete(item.id)}
                  className="text-xs text-rose-600 hover:text-rose-800 transition-colors cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
