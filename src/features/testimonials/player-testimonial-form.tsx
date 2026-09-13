"use client";

import { useState } from "react";
import { TestimonialItem } from "./testimonials.types";
import { savePlayerTestimonialAction } from "./actions/save-player-testimonial.action";
import { deleteTestimonialAction } from "./actions/delete-testimonial.action";
import { StarRatingSelector } from "./components/star-rating-selector";
import { TestimonialFormHeader } from "./components/testimonial-form-header";
import { TestimonialAlert } from "./components/testimonial-alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {
  initialTestimonial: TestimonialItem | null;
  userName: string;
}

export function PlayerTestimonialForm({ initialTestimonial, userName }: Props) {
  const [role, setRole] = useState(initialTestimonial?.role || "Amateur League Player");
  const [tag, setTag] = useState(initialTestimonial?.tag || "Verified Player");
  const [quote, setQuote] = useState(initialTestimonial?.quote || "");
  const [rating, setRating] = useState(initialTestimonial?.rating || 5);
  const [isPublished, setIsPublished] = useState(initialTestimonial?.isPublished ?? true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [hasRecord, setHasRecord] = useState(Boolean(initialTestimonial));
  const [currentId, setCurrentId] = useState<string | null>(initialTestimonial?.id || null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const res = await savePlayerTestimonialAction({
      author: userName,
      role,
      tag,
      quote,
      rating,
      isPublished,
    });

    setIsSubmitting(false);
    if (res.success) {
      setMessage({ type: "success", text: "Your testimonial has been saved and published." });
      setHasRecord(true);
      if (res.testimonialId) setCurrentId(res.testimonialId);
    } else {
      setMessage({ type: "error", text: res.error || "Failed to save testimonial" });
    }
  };

  const handleDelete = async () => {
    if (!currentId) return;
    if (!window.confirm("Are you sure you want to remove your testimonial?")) return;

    setIsSubmitting(true);
    const res = await deleteTestimonialAction({ id: currentId });
    setIsSubmitting(false);

    if (res.success) {
      setQuote("");
      setHasRecord(false);
      setCurrentId(null);
      setMessage({ type: "success", text: "Your testimonial was removed." });
    } else {
      setMessage({ type: "error", text: res.error || "Failed to remove testimonial" });
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-black/8 p-6 sm:p-8 shadow-xs">
      <TestimonialFormHeader />
      <TestimonialAlert message={message} />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Player Tagline / Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g. Weekend Club Member, League Player"
            required
          />
          <Input
            label="Category Badge"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            placeholder="e.g. Verified Player, Club Captain"
            required
          />
        </div>

        <StarRatingSelector rating={rating} onChange={setRating} />

        <div>
          <label className="block text-xs font-medium text-[#252724] mb-1.5">
            Your Review / Testimonial
          </label>
          <textarea
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            rows={4}
            className="w-full rounded-xl bg-white px-3.5 py-2.5 text-sm text-[#252724] placeholder:text-neutral-400 border border-black/10 focus:outline-none focus:ring-2 focus:ring-[#668c63] transition-all"
            placeholder="Share details about court flooring, LED lighting, gear rentals, or staff desk check-in..."
            required
          />
        </div>

        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="isPublished"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="w-4 h-4 rounded-[5px] accent-[#5a8357] cursor-pointer"
          />
          <label htmlFor="isPublished" className="text-xs text-[#252724] cursor-pointer">
            Display this review publicly on the Aura Sports Arena homepage
          </label>
        </div>

        <div className="pt-2 flex items-center justify-between border-t border-black/6">
          <Button type="submit" isLoading={isSubmitting}>
            {hasRecord ? "Update Testimonial" : "Submit Testimonial"}
          </Button>

          {hasRecord && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isSubmitting}
              className="text-xs text-rose-600 hover:text-rose-800 transition-colors cursor-pointer"
            >
              Remove Testimonial
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
