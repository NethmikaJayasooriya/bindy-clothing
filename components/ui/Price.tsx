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
    sm: "text-sm",
    md: "text-lg sm:text-xl",
    lg: "text-2xl sm:text-3xl",
  };

  const isSale = compareAtAmount && compareAtAmount > amount;

  return (
    <div className={`inline-flex items-baseline gap-2 ${className}`}>
      <span className={`font-serif font-semibold text-charcoal tracking-tight ${sizeStyles[size]}`}>
        ${amount}
      </span>

      {isSale && (
        <span className="font-serif text-sm text-muted line-through opacity-70">
          ${compareAtAmount}
        </span>
      )}

      <span className="text-[10px] sm:text-xs font-sans text-muted uppercase tracking-wider font-normal">
        {currency}
      </span>
    </div>
  );
}
