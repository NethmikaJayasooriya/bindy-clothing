"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Heart, ShieldCheck } from "lucide-react";

export default function ThreeWomenStory() {
  const founders = [
    {
      name: "Dilrukshi Wickramarathna",
      role: "Founder & Creative Director",
      bio: "Fashion Designer, Entrepreneur & Garment Manufacturing Specialist with decades of mastery crafting timeless garments.",
      focus: ["Brand Vision", "Product Development", "Design & Trend Research"],
    },
    {
      name: "Binadhi Ranasinghe",
      role: "Daughter — Concept & Trend Muse",
      bio: "QUT Brisbane Fashion Design Student bridging modern Australian lifestyle with heritage aesthetics.",
      focus: ["Australian Market Research", "Contemporary Design", "Concept Development"],
    },
    {
      name: "Vinudhi Ranasinghe",
      role: "Daughter — Visual Storytelling",
      bio: "Collection Concept Creator, Campaign Model, and Creative Direction lead bringing soul to every visual.",
      focus: ["Collection Concept", "Campaign Model", "Visual Storytelling"],
    },
  ];

  return (
    <section id="about" className="py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
        <span className="text-[11px] font-sans uppercase tracking-[0.4em] text-gold font-medium">
          Our Origin • Three Women
        </span>
        <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-zinc-900 dark:text-zinc-100 font-light">
          Three Women. <span className="italic font-serif">One Vision.</span>
        </h2>
        <p className="font-serif italic text-base sm:text-lg text-zinc-600 dark:text-zinc-400 font-light">
          What began as one woman’s dream evolved into a shared journey between a mother and her two daughters, united by a passion for ethical fashion.
        </p>
      </div>

      {/* 3 Founders Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {founders.map((person, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: idx * 0.15 }}
            className="p-8 rounded-3xl bg-white/60 dark:bg-zinc-900/40 border border-sand/40 hover:border-gold transition-all duration-500 hover:shadow-xl flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold text-xs font-serif">
                0{idx + 1}
              </div>
              <div>
                <h3 className="font-serif text-2xl text-zinc-900 dark:text-zinc-100 font-medium">
                  {person.name}
                </h3>
                <p className="text-xs uppercase font-sans tracking-[0.25em] text-gold mt-1 font-medium">
                  {person.role}
                </p>
              </div>
              <p className="text-sm font-sans text-zinc-600 dark:text-zinc-300 leading-relaxed">
                {person.bio}
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-sand/20 space-y-2">
              <span className="text-[10px] uppercase font-sans tracking-widest text-muted">
                Key Pillar:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {person.focus.map((f, i) => (
                  <span
                    key={i}
                    className="text-[11px] font-sans px-2.5 py-1 rounded-md bg-sand/20 text-zinc-800 dark:text-zinc-200"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
