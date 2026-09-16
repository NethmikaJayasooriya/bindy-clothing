"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import gsap from "gsap";

export interface DepthFlipImageProps {
  /** Array of image URLs to cycle between, or at least two pictures */
  images: string[];
  /** Number of 3D slices (default: 15) */
  stripCount?: number;
  /** "horizontal" (rolls along X axis) or "vertical" (revolves along Y axis) */
  direction?: "horizontal" | "vertical";
  /** How long each picture is shown before flipping (seconds) */
  holdDuration?: number;
  /** Duration of the 3D flip animation (seconds) */
  transitionDuration?: number;
  /** Stagger delay between consecutive strips (seconds) */
  stripStagger?: number;
  /** Flip on hover, auto-loop timer, or manual click */
  trigger?: "auto" | "hover" | "click";
  /** GSAP easing formula */
  ease?: string;
  /** Additional container styling (e.g. aspect ratio, rounded corners) */
  className?: string;
  /** Alt text description */
  alt?: string;
  /** Optional callback when flip completes */
  onFlipComplete?: (newIndex: number) => void;
}

export default function DepthFlipImage({
  images,
  stripCount = 15,
  direction = "horizontal",
  holdDuration = 3.5,
  transitionDuration = 1.2,
  stripStagger = 0.035,
  trigger = "auto",
  ease = "power4.inOut",
  className = "w-full aspect-[4/5] rounded-2xl",
  alt = "Artisan Handloom Visual",
  onFlipComplete,
}: DepthFlipImageProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const currentStripsRef = useRef<(HTMLDivElement | null)[]>([]);
  const nextStripsRef = useRef<(HTMLDivElement | null)[]>([]);
  const currentShadowsRef = useRef<(HTMLDivElement | null)[]>([]);
  const nextShadowsRef = useRef<(HTMLDivElement | null)[]>([]);

  const validImages = useMemo(() => {
    return images.filter(Boolean);
  }, [images]);

  const nextIndex = (activeIndex + 1) % (validImages.length || 1);
  const currentImage = validImages[activeIndex] || "";
  const nextImage = validImages[nextIndex] || "";

  // Helper to trigger the 15-strip 3D flip
  const flipToNext = () => {
    if (isAnimating || validImages.length < 2) return;
    setIsAnimating(true);

    const container = containerRef.current;
    if (!container) return;

    const { clientWidth, clientHeight } = container;
    const isHoriz = direction === "horizontal";
    
    // Strip dimension and rotation depth pivot
    const stripSize = isHoriz ? clientHeight / stripCount : clientWidth / stripCount;
    const faceOffset = stripSize / 2;

    const currentStrips = currentStripsRef.current.filter(Boolean) as HTMLDivElement[];
    const nextStrips = nextStripsRef.current.filter(Boolean) as HTMLDivElement[];
    const currentShadows = currentShadowsRef.current.filter(Boolean) as HTMLDivElement[];
    const nextShadows = nextShadowsRef.current.filter(Boolean) as HTMLDivElement[];

    // 3D face properties with recessed Z origin
    const faceProps = {
      transformOrigin: isHoriz
        ? `50% 50% -${faceOffset}px`
        : `50% 50% -${faceOffset}px`,
      transformPerspective: 1200,
      backfaceVisibility: "hidden",
      force3D: true,
    };

    // Initial setup: current face flat, next face cocked at -90deg
    if (isHoriz) {
      gsap.set(currentStrips, { ...faceProps, rotationX: 0, opacity: 1 });
      gsap.set(nextStrips, { ...faceProps, rotationX: -90, opacity: 1 });
    } else {
      gsap.set(currentStrips, { ...faceProps, rotationY: 0, opacity: 1 });
      gsap.set(nextStrips, { ...faceProps, rotationY: -90, opacity: 1 });
    }

    gsap.set(currentShadows, { opacity: 0 });
    gsap.set(nextShadows, { opacity: 0.6 });

    const tl = gsap.timeline({
      onComplete: () => {
        setActiveIndex(nextIndex);
        setIsAnimating(false);
        if (onFlipComplete) onFlipComplete(nextIndex);

        // Reset positions after swap
        if (isHoriz) {
          gsap.set(currentStrips, { rotationX: 0 });
          gsap.set(nextStrips, { rotationX: -90 });
        } else {
          gsap.set(currentStrips, { rotationY: 0 });
          gsap.set(nextStrips, { rotationY: -90 });
        }
        gsap.set(currentShadows, { opacity: 0 });
        gsap.set(nextShadows, { opacity: 0.6 });
      },
    });

    if (isHoriz) {
      // Outgoing strips rotate 0 -> 90deg
      tl.to(
        currentStrips,
        {
          rotationX: 90,
          duration: transitionDuration,
          ease: ease,
          stagger: stripStagger,
        },
        0
      );
      // Incoming strips rotate -90deg -> 0deg
      tl.to(
        nextStrips,
        {
          rotationX: 0,
          duration: transitionDuration,
          ease: ease,
          stagger: stripStagger,
        },
        0
      );
    } else {
      // Outgoing strips rotate 0 -> 90deg (or -90)
      tl.to(
        currentStrips,
        {
          rotationY: 90,
          duration: transitionDuration,
          ease: ease,
          stagger: stripStagger,
        },
        0
      );
      // Incoming strips rotate -90deg -> 0deg
      tl.to(
        nextStrips,
        {
          rotationY: 0,
          duration: transitionDuration,
          ease: ease,
          stagger: stripStagger,
        },
        0
      );
    }

    // Realistic lighting shading during rotation
    tl.to(
      currentShadows,
      {
        opacity: 0.65,
        duration: transitionDuration * 0.7,
        ease: "power2.in",
        stagger: stripStagger,
      },
      0
    );

    tl.to(
      nextShadows,
      {
        opacity: 0,
        duration: transitionDuration,
        ease: "power2.out",
        stagger: stripStagger,
      },
      transitionDuration * 0.15
    );
  };

  // Auto-play timer
  useEffect(() => {
    if (trigger !== "auto" || validImages.length < 2) return;

    const timer = setInterval(() => {
      flipToNext();
    }, (holdDuration + transitionDuration) * 1000);

    return () => clearInterval(timer);
  }, [activeIndex, isAnimating, trigger, holdDuration, transitionDuration, validImages.length]);

  // Slices generation
  const slices = Array.from({ length: stripCount }, (_, i) => i);
  const isHoriz = direction === "horizontal";

  return (
    <div
      ref={containerRef}
      onClick={() => trigger === "click" && flipToNext()}
      onMouseEnter={() => trigger === "hover" && flipToNext()}
      className={`relative overflow-hidden cursor-pointer select-none bg-[#141312] ${className}`}
      style={{ perspective: 1400 }}
      role="region"
      aria-label={alt}
    >
      {/* 15 Strips Matrix */}
      {slices.map((index) => {
        // Strip geometry
        const stripStyle: React.CSSProperties = isHoriz
          ? {
              position: "absolute",
              top: `${(index / stripCount) * 100}%`,
              left: 0,
              width: "100%",
              height: `${100 / stripCount}%`,
              overflow: "hidden",
            }
          : {
              position: "absolute",
              top: 0,
              left: `${(index / stripCount) * 100}%`,
              width: `${100 / stripCount}%`,
              height: "100%",
              overflow: "hidden",
            };

        // Inner image offset positioning to render seamless slices
        const innerImageStyle: React.CSSProperties = isHoriz
          ? {
              position: "absolute",
              left: 0,
              top: `-${index * 100}%`,
              width: "100%",
              height: `${stripCount * 100}%`,
              objectFit: "cover",
            }
          : {
              position: "absolute",
              top: 0,
              left: `-${index * 100}%`,
              width: `${stripCount * 100}%`,
              height: "100%",
              objectFit: "cover",
            };

        return (
          <div key={index} style={stripStyle}>
            {/* Current Face */}
            <div
              ref={(el) => {
                currentStripsRef.current[index] = el;
              }}
              className="absolute inset-0 w-full h-full overflow-hidden"
              style={{ transformStyle: "preserve-3d" }}
            >
              <img
                src={currentImage}
                alt={`${alt} slice ${index + 1}`}
                style={innerImageStyle}
                className="pointer-events-none select-none"
              />
              {/* Shading layer */}
              <div
                ref={(el) => {
                  currentShadowsRef.current[index] = el;
                }}
                className="absolute inset-0 bg-black pointer-events-none opacity-0 transition-opacity"
              />
            </div>

            {/* Next Face */}
            <div
              ref={(el) => {
                nextStripsRef.current[index] = el;
              }}
              className="absolute inset-0 w-full h-full overflow-hidden"
              style={{ transformStyle: "preserve-3d" }}
            >
              <img
                src={nextImage}
                alt={`${alt} next slice ${index + 1}`}
                style={innerImageStyle}
                className="pointer-events-none select-none"
              />
              {/* Shading layer */}
              <div
                ref={(el) => {
                  nextShadowsRef.current[index] = el;
                }}
                className="absolute inset-0 bg-black pointer-events-none opacity-60 transition-opacity"
              />
            </div>
          </div>
        );
      })}

      {/* Subtle indicator dots */}
      {validImages.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
          {validImages.map((_, i) => (
            <span
              key={i}
              className={`block rounded-full transition-all duration-300 ${
                i === activeIndex
                  ? "w-4 h-1.5 bg-[#C5A059]"
                  : "w-1.5 h-1.5 bg-white/40"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
