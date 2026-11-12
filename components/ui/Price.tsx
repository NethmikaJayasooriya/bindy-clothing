"use client";

import React from "react";
import { useCurrency, type ProductPriceInput } from "@/components/CurrencyContext";

export interface PriceProps {
  amount?: number;
  product?: ProductPriceInput;
  compareAtAmount?: number;
  currency?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  showCurrency?: boolean;
}

export default function Price({
  amount,
  product,
  compareAtAmount,
  currency: explicitCurrency,
  size = "md",
  className = "",
  showCurrency = true,
}: PriceProps) {
  const { getPrice, currency: activeCurrency } = useCurrency();

  const sizeStyles = {
    sm: "text-[17px] sm:text-[19px]",
    md: "text-xl sm:text-2xl",
    lg: "text-2xl sm:text-3xl",
  };

  let displayAmount: number;
  let displayCurrency: string;
  let isLkr: boolean;

  if (product) {
    const info = getPrice(product);
    displayAmount = info.amount;
    displayCurrency = explicitCurrency || info.currency;
    isLkr = displayCurrency === "LKR";
  } else {
    displayAmount = amount ?? 0;
    displayCurrency = explicitCurrency || activeCurrency;
    isLkr = displayCurrency === "LKR";
  }

  const isSale = compareAtAmount && compareAtAmount > displayAmount;

  return (
    <div className={`inline-flex items-baseline gap-1.5 ${className}`}>
      <span className={`font-outfit font-semibold text-[#181614] tracking-tight ${sizeStyles[size]}`}>
        {isLkr ? `Rs. ${displayAmount.toLocaleString()}` : `$${displayAmount}`}
      </span>

      {isSale && (
        <span className="font-outfit text-xs sm:text-sm text-charcoal/40 line-through">
          {isLkr ? `Rs. ${compareAtAmount.toLocaleString()}` : `$${compareAtAmount}`}
        </span>
      )}

      {showCurrency && (
        <span className="text-[10.5px] sm:text-[11px] font-sans text-charcoal/55 uppercase tracking-widest font-medium">
          {displayCurrency}
        </span>
      )}
    </div>
  );
}
