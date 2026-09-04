"use client";

import React from "react";
import { Loader2 } from "lucide-react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "terracotta"
  | "olive";

export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-sans uppercase tracking-[0.22em] font-semibold transition-all duration-300 rounded-full cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 disabled:cursor-not-allowed disabled:opacity-50";

  const sizeStyles: Record<ButtonSize, string> = {
    sm: "text-[10px] px-4 py-2 gap-1.5 min-h-[36px]",
    md: "text-xs px-6 py-3 gap-2 min-h-[44px]",
    lg: "text-xs sm:text-sm px-8 py-4 gap-2.5 min-h-[50px] tracking-[0.25em]",
  };

  const variantStyles: Record<ButtonVariant, string> = {
    primary:
      "bg-gold hover:bg-cinnamon text-charcoal hover:text-white shadow-luxury hover:shadow-luxury-hover hover:scale-[1.01] active:scale-[0.99]",
    secondary:
      "bg-paper-light text-charcoal border border-sand hover:border-gold hover:text-gold shadow-paper-card hover:shadow-luxury-hover",
    outline:
      "bg-transparent text-charcoal border border-charcoal/30 hover:border-gold hover:text-gold hover:bg-gold/5",
    ghost:
      "bg-transparent text-charcoal/80 hover:text-gold hover:bg-paper-dark/60",
    terracotta:
      "bg-terracotta hover:bg-cinnamon text-white shadow-luxury hover:shadow-luxury-hover hover:scale-[1.01]",
    olive:
      "bg-olive hover:bg-olive-dark text-white shadow-luxury hover:shadow-luxury-hover hover:scale-[1.01]",
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${
        fullWidth ? "w-full" : ""
      } ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin text-current" />}
      {!isLoading && leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
    </button>
  );
}
