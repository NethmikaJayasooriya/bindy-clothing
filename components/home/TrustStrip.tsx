import React from "react";
import { Truck, RefreshCw, Sparkles, ShieldCheck, Star } from "lucide-react";
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

  return (
    <section className="relative z-10 bg-[#FAF7F2]/95 backdrop-blur-sm border-b border-[#DCC7AF]/50 py-3 sm:py-3.5 px-4 sm:px-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
      <div className="max-w-7xl mx-auto flex items-center justify-start md:justify-center gap-4 sm:gap-6 lg:gap-8 overflow-x-auto no-scrollbar scroll-smooth whitespace-nowrap text-xs font-mono">
        {trustBadges.map((badge, idx) => {
          const Icon = badge.icon;
          return (
            <React.Fragment key={idx}>
              {idx > 0 && (
                <span className="text-[#DCC7AF] text-xs select-none flex-shrink-0" aria-hidden="true">
                  •
                </span>
              )}
              <div className="flex items-center gap-2 flex-shrink-0 text-[#2B2927] hover:text-[#B86B4B] transition-colors">
                <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${badge.iconClass}`} />
                <span className="text-sm sm:text-sm uppercase font-semibold tracking-[0.14em] font-medium">
                  {badge.text}
                </span>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </section>
  );
}
