"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X, Sparkles } from "lucide-react";

interface ActivityItem {
  id: string;
  name: string;
  city: string;
  state: string;
  item: string;
  size: string;
  image: string;
  href: string;
  timeAgo: string;
}

const ACTIVITIES: ActivityItem[] = [
  {
    id: "act-1",
    name: "Amara P.",
    city: "Sydney",
    state: "NSW",
    item: "The Island Pearl Maxi Dress",
    size: "AU 8 (S)",
    image: "/images/serendipity/serendib-pearl-dress.jpg",
    href: "/product/serendib-pearl-dress",
    timeAgo: "4m ago",
  },
  {
    id: "act-2",
    name: "Chloe M.",
    city: "Gold Coast",
    state: "QLD",
    item: "Lotus Memory Strapless Dress",
    size: "AU 8 (S)",
    image: "/images/serendipity/lotus-memory-dress.jpg",
    href: "/product/lotus-memory-dress",
    timeAgo: "8m ago",
  },
  {
    id: "act-3",
    name: "Elena V.",
    city: "Melbourne",
    state: "VIC",
    item: "Cinnamon Flow Bias Skirt",
    size: "AU 10 (M)",
    image: "/images/serendipity/cinnamon-flow-skirt.jpg",
    href: "/product/cinnamon-flow-skirt",
    timeAgo: "14m ago",
  },
  {
    id: "act-4",
    name: "Zara W.",
    city: "Perth",
    state: "WA",
    item: "Beyond The Garden Wall Peplum",
    size: "AU 6 (XS)",
    image: "/images/collection-2/beyond-garden-wall-peplum.jpg",
    href: "/product/beyond-garden-wall-peplum",
    timeAgo: "19m ago",
  },
  {
    id: "act-5",
    name: "Isabelle R.",
    city: "Byron Bay",
    state: "NSW",
    item: "Tea Leaf Handloom Two-Piece",
    size: "AU 8 (S)",
    image: "/images/serendipity/tea-leaf-two-piece.jpg",
    href: "/product/tea-leaf-two-piece",
    timeAgo: "23m ago",
  },
];

export default function SocialProofToast() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Wait 5 seconds before showing the first toast so hero isn't obstructed initially
    const initialTimer = setTimeout(() => {
      if (!isDismissed) {
        setIsVisible(true);
      }
    }, 5000);

    return () => clearTimeout(initialTimer);
  }, [isDismissed]);

  useEffect(() => {
    if (isDismissed) return;

    // Cycle every 14 seconds: visible for 6.5s, then hide briefly and show next
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % ACTIVITIES.length);
        setIsVisible(true);
      }, 1800);
    }, 14000);

    return () => clearInterval(interval);
  }, [isDismissed]);

  if (isDismissed) return null;

  const current = ACTIVITIES[currentIndex];

  return (
    <div className="fixed bottom-4 left-3.5 sm:bottom-6 sm:left-6 z-40 pointer-events-none select-none max-w-[340px] sm:max-w-sm">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto bg-[#1F1E1D]/95 text-white backdrop-blur-xl border border-[#C5A059]/40 rounded-2xl p-2.5 sm:p-3 shadow-[0_12px_35px_rgba(0,0,0,0.35)] flex items-center gap-3 relative group"
          >
            {/* Clickable Product Thumbnail */}
            <Link
              href={current.href}
              className="relative w-12 h-14 sm:w-13 sm:h-15 rounded-xl overflow-hidden bg-black/40 flex-shrink-0 border border-white/15 block group-hover:border-[#C5A059] transition-colors"
            >
              <img
                src={current.image}
                alt={current.item}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute bottom-0 inset-x-0 bg-[#C5A059] text-[8px] font-mono text-black font-bold uppercase tracking-wider text-center py-0.2">
                Order
              </span>
            </Link>

            {/* Buyer & Activity Information */}
            <div className="flex-1 min-w-0 pr-4">
              <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-mono text-[#DCC7AF]">
                <span className="font-semibold text-white truncate">{current.name}</span>
                <span>•</span>
                <span className="text-[#C5A059] font-medium">{current.city}, {current.state}</span>
                <CheckCircle2 className="w-2.5 h-2.5 text-[#AFC8B1] flex-shrink-0" />
              </div>

              <Link href={current.href} className="block group-hover:text-[#C5A059] transition-colors">
                <p className="text-xs sm:text-sm font-serif font-medium text-white line-clamp-1 leading-tight mt-0.5">
                  {current.item}
                </p>
              </Link>

              <div className="flex items-center gap-2 mt-1 text-[10px] font-sans text-white/60">
                <span className="font-mono text-white/80">{current.size}</span>
                <span>•</span>
                <span className="text-[#DCC7AF]">{current.timeAgo}</span>
              </div>
            </div>

            {/* Dismiss Button */}
            <button
              type="button"
              onClick={() => setIsDismissed(true)}
              className="absolute top-2 right-2 text-white/40 hover:text-white transition-colors p-1 rounded-full cursor-pointer"
              aria-label="Dismiss notification"
              title="Dismiss"
            >
              <X className="w-3 h-3" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
