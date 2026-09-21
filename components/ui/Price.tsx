import React from "react";

export interface PriceProps {
  amount: number;
  compareAtAmount?: number;
  currency?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function Price({
  amount,
  compareAtAmount,
  currency = "AUD",
  size = "md",
  className = "",
}: PriceProps) {
  const sizeStyles = {
    sm: "text-[17px] sm:text-[19px]",
    md: "text-xl sm:text-2xl",
    lg: "text-2xl sm:text-3xl",
  };

  const isSale = compareAtAmount && compareAtAmount > amount;

  return (
    <div className={`inline-flex items-baseline gap-1.5 ${className}`}>
      <span className={`font-outfit font-semibold text-[#181614] tracking-tight ${sizeStyles[size]}`}>
        ${amount}
      </span>

      {isSale && (
        <span className="font-outfit text-xs sm:text-sm text-charcoal/40 line-through">
          ${compareAtAmount}
        </span>
      )}

      <span className="text-[10.5px] sm:text-[11px] font-sans text-charcoal/55 uppercase tracking-widest font-medium">
        {currency}
      </span>
    </div>
  );
}
