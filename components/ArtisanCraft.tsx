"use client";

import React from "react";
import { Sparkles, Leaf, Sun, Award, Star } from "lucide-react";
import { getStoreReviewsAggregate } from "@/lib/products";

export default function ArtisanCraft() {
  const { averageRating, totalReviews } = getStoreReviewsAggregate();

  const materials = [
    {
      title: "Handloom Cotton",
      subtitle: "Heritage in Every Thread",
      desc: "Textured, breathable handloom woven by traditional Sri Lankan artisan communities on ancestral wooden looms.",
      badge: "Artisan Woven",
    },
    {
      title: "Embroidered Voile",
      subtitle: "Light & Sheer Romance",
      desc: "Delicate floral embroidery and cutwork scallop motifs adding a soft feminine touch to airy silhouettes.",
      badge: "Hand Detailed",
    },
    {
      title: "Recycled Silk & Lyocell",
      subtitle: "Fluid Drape & Conscious Luxury",
      desc: "Fluid and elegant blends creating liquid movements under the Australian sun with minimal environmental footprint.",
      badge: "Conscious Blend",
    },
    {
      title: "Natural Shell & Coconut Buttons",
      subtitle: "Organic Accents",
      desc: "Each button is individually cut and polished from organic mother-of-pearl shell or reclaimed coconut timber.",
      badge: "100% Organic",
    },
  ];

  return (
    /* Light Surface "Visual Breath" Section: bg-paper dark:bg-paper-dark with charcoal text */
    <section id="craft" className="py-24 sm:py-28 bg-paper dark:bg-paper-dark text-charcoal border-y border-sand/40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-[11px] font-sans uppercase tracking-[0.35em] text-gold font-medium">
            Fabric & Material Board
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-charcoal font-light tracking-wide">
            Crafted with Heart. <span className="italic font-serif">Made to be Loved.</span>
          </h2>
          <p className="font-serif italic text-base sm:text-lg text-zinc-600 font-light">
            Natural, breathable fabrics chosen to bring effortless comfort to warm Australian days.
          </p>
        </div>

        {/* 4 Fabric Board Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {materials.map((mat, i) => (
            <div
              key={i}
              className="p-6 sm:p-7 rounded-2xl bg-white/95 dark:bg-white/90 border border-sand/40 hover:border-gold transition-all duration-300 shadow-sm hover:shadow-lg space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <span className="text-[10px] uppercase font-sans tracking-widest px-2.5 py-1 rounded-full bg-gold/15 text-gold font-semibold inline-block border border-gold/20">
                  {mat.badge}
                </span>
                <h3 className="font-serif text-xl text-charcoal font-medium">
                  {mat.title}
                </h3>
                <p className="text-xs font-sans text-zinc-500 font-light">
                  {mat.subtitle}
                </p>
              </div>

              <p className="text-xs font-sans text-zinc-700 leading-relaxed pt-3 border-t border-sand/20">
                {mat.desc}
              </p>
            </div>
          ))}
        </div>

        {/* ── 3. HOMEPAGE TRUST SIGNAL (Connected to live review system) ── */}
        <div className="mt-20 pt-10 border-t border-sand/30 text-center space-y-2">
          <p className="font-serif italic text-lg sm:text-xl text-charcoal font-light tracking-wide">
            Loved by customers across Australia
          </p>
          <div className="inline-flex items-center justify-center gap-2">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-4 h-4 fill-gold text-gold" />
              ))}
            </div>
            <span className="text-xs font-sans text-charcoal/80 font-medium">
              {averageRating} ★ · Based on {totalReviews} verified customer reviews
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
