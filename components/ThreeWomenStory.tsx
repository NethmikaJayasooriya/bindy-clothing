"use client";

import React from "react";
import { motion } from "framer-motion";

interface Founder {
  id: string;
  monogram: string;
  number: string;
  name: string;
  role: string;
  category: string;
  quote: string;
  bio: string;
  focus: string[];
}

export default function ThreeWomenStory() {
  const founders: Founder[] = [
    {
      id: "dilrukshi",
      monogram: "DW",
      number: "01",
      name: "Dilrukshi Wickramarathna",
      role: "Founder & Creative Director",
      category: "Creative Direction & Craft Mastery",
      quote: "Every garment must hold honesty in its threads and dignity in its making.",
      bio: "Fashion Designer, Entrepreneur & Garment Manufacturing Specialist with decades of mastery crafting timeless, ethical silhouettes for conscious women.",
      focus: ["Brand Vision", "Product Development", "Ethical Craftsmanship"],
    },
    {
      id: "binadhi",
      monogram: "BR",
      number: "02",
      name: "Binadhi Ranasinghe",
      role: "Concept & Trend Muse",
      category: "Modern Australian Wardrobe",
      quote: "Fashion should feel like second nature under the sun — fluid, relaxed, and deeply personal.",
      bio: "QUT Brisbane Fashion Design Student bridging modern relaxed Australian lifestyles with ancestral Sri Lankan handloom traditions.",
      focus: ["Australian Wardrobe Ease", "Contemporary Silhouettes", "Trend Research"],
    },
    {
      id: "vinudhi",
      monogram: "VR",
      number: "03",
      name: "Vinudhi Ranasinghe",
      role: "Visual Storyteller & Muse",
      category: "Visual Identity & Soul",
      quote: "We don't just create clothes; we capture memories and weave them into living art.",
      bio: "Collection Concept Creator, Campaign Model, and Visual Storyteller bringing poetic authenticity and soul to every photographic narrative.",
      focus: ["Collection Narrative", "Campaign Creative", "Visual Identity"],
    },
  ];

  return (
    <section id="about" className="py-24 sm:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Editorial Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24 space-y-4">
        <span className="text-[11px] font-sans uppercase tracking-[0.4em] text-gold font-medium">
          Our Origin • Three Women
        </span>
        <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-zinc-900 dark:text-zinc-100 font-light tracking-wide">
          Three Women. <span className="italic font-serif">One Vision.</span>
        </h2>
        <p className="font-serif italic text-base sm:text-lg text-zinc-600 dark:text-sand/80 font-light leading-relaxed">
          What began as one woman’s dream evolved into a shared journey between a mother and her two daughters, united by a passion for ethical slow fashion.
        </p>
      </div>

      {/* Magazine Masthead Credits Layout (Typography-Only Spread) */}
      <div className="border-y border-sand/30 dark:border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-sand/30 dark:divide-white/10">
          {founders.map((person, idx) => (
            <motion.div
              key={person.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="px-4 sm:px-8 lg:px-12 py-12 md:py-14 flex flex-col justify-between space-y-8 text-left"
            >
              {/* 1. Header: Monogram + Name + Role */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-display text-4xl sm:text-5xl text-gold/90 tracking-wide font-normal select-none">
                    {person.monogram}
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.3em] text-sand/60 uppercase">
                    {person.number} / 03
                  </span>
                </div>

                <div className="w-12 h-px bg-gold/40" />

                <div>
                  <h3 className="font-serif text-2xl sm:text-3xl text-zinc-900 dark:text-paper-light font-medium tracking-wide leading-snug">
                    {person.name}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] font-sans uppercase tracking-[0.28em] text-gold font-medium mt-1">
                    {person.role}
                  </p>
                </div>
              </div>

              {/* 2. Emotional Centerpiece: Pull-Quote */}
              <div className="space-y-4 my-auto py-2">
                <blockquote className="font-serif italic text-base sm:text-lg text-zinc-800 dark:text-[#E8DFC8] font-light leading-relaxed border-l-2 border-gold/40 pl-4 py-1">
                  &ldquo;{person.quote}&rdquo;
                </blockquote>
                <p className="font-sans text-xs sm:text-[13px] text-zinc-600 dark:text-sand/75 font-light leading-relaxed">
                  {person.bio}
                </p>
              </div>

              {/* 3. Unboxed Editorial Focus Tags */}
              <div className="pt-6 border-t border-sand/20 dark:border-white/10 space-y-2">
                <span className="text-[9px] uppercase font-sans tracking-[0.25em] text-muted block font-medium">
                  Focus Areas
                </span>
                <div className="text-xs font-sans text-zinc-700 dark:text-sand/80 font-light flex flex-wrap gap-x-2.5 gap-y-1">
                  {person.focus.map((f, i) => (
                    <span key={i} className="inline-flex items-center gap-2">
                      <span>{f}</span>
                      {i < person.focus.length - 1 && (
                        <span className="text-gold/40 text-[10px]">•</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
