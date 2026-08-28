"use client";

import React from "react";
import { Sparkles, Leaf, Sun, Award } from "lucide-react";

export default function ArtisanCraft() {
  const materials = [
    {
      title: "Handloom Cotton",
      subtitle: "Heritage in Every Thread",
      desc: "Textured, breathable handloom woven by traditional Sri Lankan artisan communities.",
      badge: "Artisan Woven",
    },
    {
      title: "Embroidered Voile",
      subtitle: "Light & Sheer Romance",
      desc: "Delicate floral embroidery and cutwork scallop motifs adding a soft feminine touch.",
      badge: "Hand Detailed",
    },
    {
      title: "Recycled Silk & Lyocell",
      subtitle: "Fluid Drape & Conscious Luxury",
      desc: "Fluid and elegant blends creating liquid movements under the Australian sun with minimal footprint.",
      badge: "Conscious Blend",
    },
    {
      title: "Natural Shell & Coconut Buttons",
      subtitle: "Organic Accents",
      desc: "Each button is individually cut from organic mother-of-pearl shell or coconut timber.",
      badge: "100% Organic",
    },
  ];

  return (
    <section id="craft" className="py-24 bg-paper dark:bg-ink-deep border-t border-sand/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-[11px] font-sans uppercase tracking-[0.35em] text-gold">
            Fabric & Material Board
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-zinc-900 dark:text-zinc-100 font-light">
            Crafted with Heart. <span className="italic font-serif">Made to be Loved.</span>
          </h2>
          <p className="font-serif italic text-zinc-600 dark:text-zinc-400">
            Natural, breathable fabrics chosen to bring effortless comfort to warm Australian days.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {materials.map((mat, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-sand/30 hover:border-gold transition-all duration-300 hover:shadow-lg space-y-3"
            >
              <span className="text-[10px] uppercase font-sans tracking-widest px-2.5 py-1 rounded-full bg-gold/10 text-gold font-medium inline-block">
                {mat.badge}
              </span>
              <h3 className="font-serif text-xl text-zinc-900 dark:text-zinc-100 font-medium">
                {mat.title}
              </h3>
              <p className="text-xs font-sans text-zinc-500 dark:text-zinc-400 font-light">
                {mat.subtitle}
              </p>
              <p className="text-xs font-sans text-zinc-700 dark:text-zinc-300 leading-relaxed pt-2 border-t border-zinc-100 dark:border-zinc-800">
                {mat.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
