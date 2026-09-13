"use client";

import { useState } from "react";
import { Star } from "lucide-react";

interface Props {
  rating: number;
  onChange: (val: number) => void;
}

const RATING_LABELS: Record<number, string> = {
  1: "1 Star - Needs Improvement",
  2: "2 Stars - Fair Experience",
  3: "3 Stars - Good Service",
  4: "4 Stars - Great Experience",
  5: "5 Stars - Exceptional Arena",
};

export function StarRatingSelector({ rating, onChange }: Props) {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const activeRating = hoverRating ?? rating;

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-xs font-medium text-[#252724]">
          Rating Score
        </label>
        <span className="text-[11px] font-mono text-neutral-500">
          {RATING_LABELS[activeRating] || `${activeRating} of 5 Stars`}
        </span>
      </div>

      <div
        className="inline-flex items-center gap-1.5 p-2 rounded-2xl bg-white border border-black/8 shadow-2xs"
        onMouseLeave={() => setHoverRating(null)}
      >
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = activeRating >= star;

          return (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              onMouseEnter={() => setHoverRating(star)}
              aria-label={`${star} star rating`}
              className="p-1 rounded-lg transition-transform hover:scale-115 focus:outline-none focus:ring-2 focus:ring-[#668c63] cursor-pointer"
            >
              <Star
                className={`w-6 h-6 transition-colors ${
                  isFilled
                    ? "fill-amber-400 text-amber-400"
                    : "fill-neutral-100 text-neutral-300 hover:text-neutral-400"
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
