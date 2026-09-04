import React from "react";
import { Star } from "lucide-react";

export interface StarRatingProps {
  value: number; // e.g. 4.9
  max?: number;
  count?: number; // review count
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  interactive?: boolean;
  onChange?: (rating: number) => void;
  className?: string;
}

export default function StarRating({
  value,
  max = 5,
  count,
  size = "sm",
  showValue = false,
  interactive = false,
  onChange,
  className = "",
}: StarRatingProps) {
  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-3.5 h-3.5",
    lg: "w-4 h-4",
  };

  const stars = Array.from({ length: max }, (_, i) => i + 1);

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <div className="inline-flex items-center gap-0.5">
        {stars.map((starIndex) => {
          const filled = starIndex <= Math.round(value);
          return (
            <button
              key={starIndex}
              type="button"
              disabled={!interactive}
              onClick={() => interactive && onChange?.(starIndex)}
              className={`${interactive ? "cursor-pointer hover:scale-110 transition-transform" : "cursor-default"}`}
              aria-label={`${starIndex} star`}
            >
              <Star
                className={`${iconSizes[size]} ${
                  filled
                    ? "fill-gold text-gold"
                    : "fill-transparent text-sand/40"
                }`}
              />
            </button>
          );
        })}
      </div>

      {showValue && (
        <span className="text-xs font-sans font-medium text-charcoal">
          {value.toFixed(1)}
        </span>
      )}

      {typeof count === "number" && (
        <span className="text-[11px] font-sans text-muted font-normal">
          ({count})
        </span>
      )}
    </div>
  );
}
