"use client";

interface Props {
  rating: number;
  onChange: (val: number) => void;
}

export function StarRatingSelector({ rating, onChange }: Props) {
  return (
    <div>
      <label className="block text-xs font-medium text-[#252724] mb-1.5">
        Rating Score
      </label>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
              rating >= star
                ? "bg-[#252724] text-white"
                : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
            }`}
          >
            {star} Star{star > 1 ? "s" : ""}
          </button>
        ))}
      </div>
    </div>
  );
}
