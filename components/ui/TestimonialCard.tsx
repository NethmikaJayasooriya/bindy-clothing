import React from "react";
import { CheckCircle2, Quote } from "lucide-react";
import StarRating from "./StarRating";
import Badge from "./Badge";

export interface TestimonialCardProps {
  reviewerName: string;
  reviewerLocation: string;
  rating: number;
  title?: string;
  body: string;
  date?: string;
  verified?: boolean;
  fit?: "small" | "true" | "large";
  productName?: string;
  className?: string;
}

export default function TestimonialCard({
  reviewerName,
  reviewerLocation,
  rating,
  title,
  body,
  date,
  verified = true,
  fit = "true",
  productName,
  className = "",
}: TestimonialCardProps) {
  const fitLabels = {
    small: "Runs Small",
    true: "True to Size",
    large: "Runs Large",
  };

  return (
    <div
      className={`p-6 sm:p-7 rounded-3xl bg-paper-light border border-sand/40 hover:border-gold/60 transition-all duration-300 shadow-paper-card hover:shadow-luxury flex flex-col justify-between space-y-4 ${className}`}
    >
      <div className="space-y-3">
        {/* Top bar: Stars + Fit Tag */}
        <div className="flex items-center justify-between gap-2">
          <StarRating value={rating} size="sm" />
          {fit && (
            <Badge variant="sand" size="sm">
              {fitLabels[fit]}
            </Badge>
          )}
        </div>

        {/* Title */}
        {title && (
          <h4 className="font-serif text-base text-charcoal font-medium leading-snug">
            &ldquo;{title}&rdquo;
          </h4>
        )}

        {/* Body quote */}
        <p className="font-sans text-xs sm:text-[13px] text-charcoal/80 font-light leading-relaxed">
          {body}
        </p>
      </div>

      {/* Footer: Reviewer Info + Garment */}
      <div className="pt-3 border-t border-sand/30 flex items-center justify-between text-[11px] font-sans">
        <div>
          <div className="flex items-center gap-1.5 font-medium text-charcoal">
            <span>{reviewerName}</span>
            {verified && (
              <span className="inline-flex items-center gap-0.5 text-gold text-[10px]" title="Verified Buyer">
                <CheckCircle2 className="w-3 h-3 text-gold" />
                <span className="font-normal text-[9px] uppercase tracking-wider">Verified</span>
              </span>
            )}
          </div>
          <p className="text-[10px] text-muted font-light">{reviewerLocation}</p>
        </div>

        {productName && (
          <span className="text-[10px] text-gold font-medium uppercase tracking-wider text-right max-w-[120px] truncate">
            {productName}
          </span>
        )}
      </div>
    </div>
  );
}
