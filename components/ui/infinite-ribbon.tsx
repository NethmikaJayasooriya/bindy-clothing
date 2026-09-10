"use client";

import type * as React from "react";
import { cn } from "@/lib/utils";

export interface InfiniteRibbonProps {
  repeat?: number;
  duration?: number;
  reverse?: boolean;
  rotation?: number;
  pauseOnHover?: boolean;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const ribbonAnimationStyles = `
@keyframes iconiq-infinite-ribbon {
  0% {
    transform: translate3d(0, 0, 0);
  }
  100% {
    transform: translate3d(-50%, 0, 0);
  }
}

@keyframes iconiq-infinite-ribbon-reverse {
  0% {
    transform: translate3d(-50%, 0, 0);
  }
  100% {
    transform: translate3d(0, 0, 0);
  }
}

.iconiq-infinite-ribbon-track {
  display: flex;
  align-items: center;
  width: max-content;
  flex-shrink: 0;
  will-change: transform;
  transform: translate3d(0, 0, 0);
  -webkit-transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  perspective: 1000px;
  -webkit-perspective: 1000px;
}

.iconiq-infinite-ribbon-hover-pause:hover .iconiq-infinite-ribbon-track {
  animation-play-state: paused;
}

@media (prefers-reduced-motion: reduce) {
  .iconiq-infinite-ribbon-track {
    animation-duration: 1ms !important;
    animation-iteration-count: 1 !important;
  }
}
`;

export function InfiniteRibbon({
  repeat = 4,
  duration = 50,
  reverse = false,
  rotation = 0,
  pauseOnHover = true,
  children,
  className,
  style,
}: InfiniteRibbonProps) {
  const repeatCount = Math.max(1, Math.floor(repeat));
  const animationName = reverse
    ? "iconiq-infinite-ribbon-reverse"
    : "iconiq-infinite-ribbon";

  const isRotated = Math.abs(rotation) > 0.01;

  return (
    <div
      className={cn(
        "w-full max-w-full overflow-hidden select-none",
        pauseOnHover && "iconiq-infinite-ribbon-hover-pause",
        className
      )}
      style={{
        transform: isRotated
          ? `rotate(${rotation}deg) scale(1.05) translateZ(0)`
          : "translateZ(0)",
        WebkitTransform: isRotated
          ? `rotate(${rotation}deg) scale(1.05) translateZ(0)`
          : "translateZ(0)",
        transformOrigin: "center center",
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        ...style,
      }}
    >
      <span className="sr-only">{children}</span>
      <div
        aria-hidden="true"
        className="iconiq-infinite-ribbon-track flex w-max whitespace-nowrap"
        style={
          {
            "--ribbon-duration": `${Math.max(0.1, duration)}s`,
            animation: `${animationName} var(--ribbon-duration) linear infinite`,
          } as React.CSSProperties
        }
      >
        {Array.from({ length: repeatCount * 2 }, (_, index) => (
          <div
            className="flex items-center flex-shrink-0 select-none"
            key={index}
          >
            {children}
          </div>
        ))}
      </div>
      <style>{ribbonAnimationStyles}</style>
    </div>
  );
}

export default InfiniteRibbon;
