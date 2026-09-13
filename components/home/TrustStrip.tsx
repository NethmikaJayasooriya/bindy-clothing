import React from "react";
import { Truck, RefreshCw, Sparkles, ShieldCheck, Star } from "lucide-react";
import { motion } from "framer-motion";
import { getStoreReviewsAggregate } from "@/data/products";

export default function TrustStrip() {
  const { averageRating, totalReviews } = getStoreReviewsAggregate();

  const trustBadges = [
    {
      icon: Star,
      iconClass: "fill-[#C5A059] text-[#C5A059]",
      text: `${averageRating}/5.0 • Loved by ${totalReviews}+ Women`,
    },
    {
      icon: Truck,
      iconClass: "text-[#C5A059]",
      text: "Free AU Shipping $150+",
    },
    {
      icon: RefreshCw,
      iconClass: "text-[#C5A059]",
      text: "30-Day Mindful Returns",
    },
    {
      icon: Sparkles,
      iconClass: "text-[#C5A059]",
      text: "Ancestral Handloom Certified",
    },
    {
      icon: ShieldCheck,
      iconClass: "text-[#C5A059]",
      text: "Small-Batch Ethical Craft",
    },
  ];

  // Duplicate for seamless looping
  const loopedBadges = [...trustBadges, ...trustBadges, ...trustBadges, ...trustBadges];

  return (
    <section className="relative z-10 bg-[#FAF7F2]/95 backdrop-blur-sm border-b border-[#DCC7AF]/50 py-3 sm:py-3.5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-hidden">
      <motion.div
        initial={{ x: "-50%" }}
        animate={{ x: ["-50%", "0%"] }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 35,
        }}
        className="flex w-max items-center gap-6 sm:gap-8 whitespace-nowrap px-4"
      >
        {loopedBadges.map((badge, idx) => {
          const Icon = badge.icon;
          return (
            <React.Fragment key={idx}>
              <div className="flex items-center gap-2 flex-shrink-0 text-[#2B2927] hover:text-[#B86B4B] transition-colors">
                <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${badge.iconClass}`} />
                <span className="text-sm sm:text-sm uppercase font-semibold tracking-[0.14em] font-medium">
                  {badge.text}
                </span>
              </div>
              {idx < loopedBadges.length - 1 && (
                <span className="text-[#DCC7AF] text-xs select-none flex-shrink-0" aria-hidden="true">
                  •
                </span>
              )}
            </React.Fragment>
          );
        })}
      </motion.div>
    </section>
  );
}
