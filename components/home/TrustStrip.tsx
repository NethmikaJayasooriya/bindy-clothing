import React from "react";
import { Truck, RefreshCw, Sparkles, ShieldCheck, Star, Heart } from "lucide-react";
import { getStoreReviewsAggregate } from "@/data/products";

export default function TrustStrip() {
  const { averageRating, totalReviews } = getStoreReviewsAggregate();

  const items = [
    {
      icon: Truck,
      title: "Free AU Shipping $150+",
      sub: "Express carbon-neutral courier dispatch across Australia",
    },
    {
      icon: RefreshCw,
      title: "30-Day Thoughtful Returns",
      sub: "Hassle-free regional exchanges via our return portal",
    },
    {
      icon: Sparkles,
      title: "Ancestral Handloom Certified",
      sub: "100% natural cotton & pit-loom woven in rural Sri Lanka",
    },
    {
      icon: ShieldCheck,
      title: "Small-Batch Ethical Craft",
      sub: "Fair living wages & dignity for female master weavers",
    },
  ];

  return (
    <section className="relative z-10 bg-gradient-to-b from-white via-[#FAF7F2] to-white border-y border-[#DCC7AF]/60 py-7 sm:py-8 px-4 sm:px-6 lg:px-8 shadow-sm">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Early Social Proof Banner (Section 7.6 Upgrade) */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-center pb-4 border-b border-[#DCC7AF]/40">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white border border-[#DCC7AF]/70 shadow-sm">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-3.5 h-3.5 fill-[#C5A059] text-[#C5A059]" />
              ))}
            </div>
            <span className="font-serif text-xs font-semibold text-[#1F1E1D]">
              {averageRating} / 5.0
            </span>
          </div>

          <span className="text-xs font-mono uppercase tracking-wider text-[#78716A]">
            Loved by <strong className="text-[#1F1E1D] font-semibold">{totalReviews}+ Verified Women</strong> Across Australia &amp; Sri Lanka
          </span>

          <span className="hidden md:inline text-[#DCC7AF]">•</span>

          <span className="text-xs font-mono text-[#B86B4B] font-semibold uppercase tracking-wider flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 fill-[#B86B4B]" />
            <span>Two Islands, One Thread</span>
          </span>
        </div>

        {/* 4 Enriched Value Proposition Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y sm:divide-y-0 lg:divide-x divide-[#DCC7AF]/40">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`flex items-start gap-4 ${
                  idx > 0 ? "pt-4 sm:pt-0 lg:pl-6" : ""
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-white border border-[#DCC7AF] flex items-center justify-center shrink-0 shadow-sm text-[#C5A059]">
                  <Icon className="w-5 h-5 text-[#C5A059]" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-serif text-sm sm:text-base text-[#1F1E1D] font-medium leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-xs font-sans text-[#78716A] leading-relaxed font-light">
                    {item.sub}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
