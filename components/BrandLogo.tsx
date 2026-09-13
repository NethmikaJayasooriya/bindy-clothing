"use client";

import React from "react";

export interface BrandLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "hero";
  align?: "left" | "center";
  isScrolled?: boolean;
  inverted?: boolean;
  color?: string;
  subtitleColor?: string;
  showSubtitle?: boolean;
}

export default function BrandLogo({
  className = "",
  size = "md",
  align = "left",
  isScrolled = false,
  inverted = false,
  color,
  subtitleColor,
  showSubtitle = true,
}: BrandLogoProps) {
  const isDark = inverted || isScrolled;

  const sizeStyles = {
    sm: {
      brand: "text-[20px] sm:text-[22px]",
      sub: "text-[7.5px] sm:text-[8px] tracking-widest -mt-1 pl-[0.1em]",
    },
    md: {
      // Standard navbar size
      brand: "text-[24px] sm:text-[27px] lg:text-[29px]",
      sub: "text-[8.5px] sm:text-[9.5px] lg:text-xs tracking-widest -mt-1 pl-[0.15em]",
    },
    lg: {
      // Footer size
      brand: "text-[32px] sm:text-[38px] lg:text-[42px]",
      sub: "text-sm sm:text-[12.5px] lg:text-[13.5px] tracking-widest -mt-1.5 pl-[0.18em]",
    },
    xl: {
      brand: "text-[46px] sm:text-[56px] lg:text-[64px]",
      sub: "text-[14px] sm:text-[17px] lg:text-[19px] tracking-widest -mt-2 pl-[0.2em]",
    },
    hero: {
      // Splash screen / giant editorial size
      brand: "text-[64px] sm:text-[80px] md:text-[96px] lg:text-[110px]",
      sub: "text-[18px] sm:text-[22px] md:text-[26px] lg:text-[30px] tracking-widest -mt-3 sm:-mt-4 pl-[0.2em]",
    },
  }[size];

  const brandColorClass =
    color ||
    (isDark
      ? "text-white group-hover:text-[#C5A059]"
      : "text-[#1F1E1D] group-hover:text-[#B86B4B]");

  const subColorClass =
    subtitleColor ||
    (isDark
      ? "text-[#C5A059]"
      : "text-[#1F1E1D]/85 group-hover:text-[#1F1E1D]");

  const alignClass = align === "center" ? "text-center items-center" : "text-left items-start";

  return (
    <div
      className={`inline-flex flex-col select-none leading-none group transition-colors ${alignClass} ${className}`}
      style={{ fontFamily: "'League Spartan', sans-serif" }}
    >
      <span
        className={`font-bold lowercase tracking-[-0.025em] font-logo ${sizeStyles.brand} ${brandColorClass} transition-colors`}
      >
        bindy.
      </span>
      {showSubtitle && (
        <span
          className={`font-normal lowercase font-logo ${sizeStyles.sub} ${subColorClass} transition-colors ${
            align === "center" ? "pl-[0.45em]" : ""
          }`}
        >
          clothing
        </span>
      )}
    </div>
  );
}
