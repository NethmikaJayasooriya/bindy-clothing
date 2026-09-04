import React from "react";

export type BadgeVariant =
  | "gold"
  | "terracotta"
  | "blush"
  | "olive"
  | "sand"
  | "charcoal"
  | "outline";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: "sm" | "md";
  dot?: boolean;
  children: React.ReactNode;
}

export default function Badge({
  children,
  variant = "gold",
  size = "sm",
  dot = false,
  className = "",
  ...props
}: BadgeProps) {
  const base =
    "inline-flex items-center gap-1.5 rounded-full font-sans uppercase font-medium tracking-[0.2em] select-none";

  const sizeStyles = {
    sm: "text-[9px] px-2.5 py-0.5",
    md: "text-[10px] px-3.5 py-1",
  };

  const variantStyles: Record<BadgeVariant, { bg: string; dot: string }> = {
    gold: {
      bg: "bg-gold/15 text-charcoal-rich border border-gold/30",
      dot: "bg-gold",
    },
    terracotta: {
      bg: "bg-terracotta/15 text-terracotta border border-terracotta/30",
      dot: "bg-terracotta",
    },
    blush: {
      bg: "bg-blush/25 text-charcoal border border-blush/40",
      dot: "bg-blush-dark",
    },
    olive: {
      bg: "bg-olive/15 text-olive-dark border border-olive/30",
      dot: "bg-olive",
    },
    sand: {
      bg: "bg-sand/30 text-charcoal border border-sand/50",
      dot: "bg-sand-warm",
    },
    charcoal: {
      bg: "bg-charcoal text-paper-light border border-charcoal",
      dot: "bg-gold",
    },
    outline: {
      bg: "bg-transparent text-charcoal/80 border border-sand/60",
      dot: "bg-sand",
    },
  };

  const v = variantStyles[variant];

  return (
    <span className={`${base} ${sizeStyles[size]} ${v.bg} ${className}`} {...props}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${v.dot}`} />}
      {children}
    </span>
  );
}
