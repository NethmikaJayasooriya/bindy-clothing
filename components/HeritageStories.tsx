"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, Sparkles, ArrowRight } from "lucide-react";

export interface StoryChapter {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  quote: string;
  description: string;
  elements: string[];
  colorPalette: { name: string; hex: string }[];
  image: string;
}

export const STORIES: StoryChapter[] = [
  {
    id: "lotus-memory",
    number: "01",
    title: "Fragment of Memories",
    subtitle: "Inspired by Sri Lankan Lotus Ponds",
    quote: "Every memory blooms in its own time.",
    description: "The structured bodice reflects inner strength while the softly gathered skirt represents peaceful moments unfolding like lotus petals over calm waters.",
    elements: ["Lotus Offering", "Inner Strength", "Soft Ripples", "Natural Voile"],
    colorPalette: [
      { name: "Lotus Pink", hex: "#E8B7C3" },
      { name: "Dusty Rose", hex: "#D48D9B" },
      { name: "Soft Sand", hex: "#DCC7AF" },
      { name: "Sage Green", hex: "#AFC8B1" },
    ],
    image: "/images/serendipity/lotus-memory-dress.jpg",
  },
  {
    id: "serendib-pearl",
    number: "02",
    title: "The Island Pearl",
    subtitle: "Hidden Waters of Mannar",
    quote: "Hidden beneath the quiet island waters, an unexpected treasure reveals its timeless grace.",
    description: "Centuries of maritime pearl diving translated into delicate ivory cotton, scalloped cutwork hems, and pearlescent light drape.",
    elements: ["Pearl Lustre", "Ocean Movement", "Shell Texture", "Cutwork Scallop"],
    colorPalette: [
      { name: "Ivory White", hex: "#F6F5F2" },
      { name: "Oat Milk", hex: "#EDE8DF" },
      { name: "Pastel Blue", hex: "#C8D8E6" },
      { name: "Warm Gold", hex: "#C5A059" },
    ],
    image: "/images/serendipity/serendib-pearl-dress.jpg",
  },
  {
    id: "pettah-discovery",
    number: "03",
    title: "A Pettah Discovery",
    subtitle: "The Historic Red Mosque (Jami Ul-Alfar)",
    quote: "Among Pettah's restless streets, an unexpected geometric rhythm rises into view.",
    description: "The iconic red-and-white brick stripes of Colombo's architectural gem reimagined into sharp collars, button rhythms, and classic silhouettes.",
    elements: ["Red-White Rhythm", "Pointed Arch Lines", "Minaret Balance", "Gingham Weave"],
    colorPalette: [
      { name: "Crimson Red", hex: "#A82B35" },
      { name: "Clean White", hex: "#FFFFFF" },
      { name: "Charcoal Slate", hex: "#2A2928" },
      { name: "Sand Taupe", hex: "#C4B6A6" },
    ],
    image: "/images/serendipity/pettah-check-dress.jpg",
  },
  {
    id: "celestial-bloom",
    number: "04",
    title: "Celestial Bloom",
    subtitle: "Sigiriya Frescoes & Earth Pigments",
    quote: "From an ancient painted wall, a timeless feminine grace quietly reappears.",
    description: "Inspired by the 5th-century Sigiriya Cloud Maidens. Earth terracotta pigments, cinnamon silk drapery, and romantic gathered eyelet textures.",
    elements: ["Fresco Ochre", "Graceful Posture", "Cinnamon Spice", "Pleated Terracotta"],
    colorPalette: [
      { name: "Terracotta", hex: "#B86B4B" },
      { name: "Cinnamon", hex: "#A46446" },
      { name: "Rock Ochre", hex: "#D19B53" },
      { name: "Pure Voile", hex: "#FAF7F2" },
    ],
    image: "/images/serendipity/celestial-terracotta-skirt.jpg",
  },
  {
    id: "leaf-unfolds",
    number: "05",
    title: "A Leaf Unfolds",
    subtitle: "High-Altitude Sri Lankan Tea Plantations",
    quote: "From one tender leaf, an entire landscape quietly unfolds.",
    description: "The emerald contours of Nuwara Eliya and Ella hills mirrored in curved bodice yokes, tiered gathered growth, and pure organic linen.",
    elements: ["Tender Leaves", "Tea-Bush Contours", "Misty Slopes", "Breathable Linen"],
    colorPalette: [
      { name: "Olive Leaf", hex: "#5E6C52" },
      { name: "Sage Green", hex: "#AFC8B1" },
      { name: "Deep Forest", hex: "#2C3E2E" },
      { name: "Misty Khaki", hex: "#9EA895" },
    ],
    image: "/images/serendipity/tea-leaf-two-piece.jpg",
  },
];

export default function HeritageStories() {
  const [activeStory, setActiveStory] = useState(STORIES[0]);

  return (
    <section id="stories" className="py-28 bg-[#181614] text-[#FAF7F2] relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#A46446]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 border-b border-[#C5A059]/20 pb-8">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-[#C5A059] text-[11px] uppercase font-sans tracking-[0.35em]">
              <Compass className="w-3.5 h-3.5" />
              <span>Roots → Journey → Discovery</span>
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light tracking-wide">
              The Stories Behind <span className="italic font-serif text-[#DCC7AF]">Every Thread</span>
            </h2>
          </div>
          <p className="mt-4 md:mt-0 font-serif italic text-sm text-[#A89F91] max-w-sm">
            Not wearing the past. Carrying its story forward into modern Australian living.
          </p>
        </div>

        {/* Story Selector Horizontal Navigation */}
        <div className="flex space-x-3 overflow-x-auto pb-4 mb-12 no-scrollbar">
          {STORIES.map((story) => (
            <button
              key={story.id}
              onClick={() => setActiveStory(story)}
              className={`px-5 py-2.5 rounded-full text-xs font-sans uppercase tracking-[0.2em] whitespace-nowrap transition-all duration-300 flex items-center space-x-2 border ${
                activeStory.id === story.id
                  ? "bg-[#C5A059] text-black border-[#C5A059] font-medium shadow-[0_0_20px_rgba(197,160,89,0.3)]"
                  : "bg-white/5 border-white/10 text-white/70 hover:text-white hover:border-[#C5A059]/50"
              }`}
            >
              <span className="text-[10px] opacity-70">{story.number}.</span>
              <span>{story.title}</span>
            </button>
          ))}
        </div>

        {/* Interactive Story Display Stage */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStory.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
          >
            {/* Story Visual Frame (5 cols) */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[3/4] rounded-3xl overflow-hidden border border-[#C5A059]/30 shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
                <img
                  src={activeStory.image}
                  alt={activeStory.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="text-[10px] font-sans tracking-[0.3em] uppercase text-[#C5A059]">
                    Chapter {activeStory.number}
                  </span>
                  <h4 className="font-serif text-2xl text-white font-medium">
                    {activeStory.title}
                  </h4>
                </div>
              </div>
            </div>

            {/* Story Text & Exploration (7 cols) */}
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-3">
                <span className="text-xs uppercase font-sans tracking-[0.35em] text-[#C5A059]">
                  {activeStory.subtitle}
                </span>
                <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light leading-tight">
                  &ldquo;{activeStory.quote}&rdquo;
                </h3>
              </div>

              <p className="font-sans text-sm sm:text-base text-zinc-300 leading-relaxed max-w-xl">
                {activeStory.description}
              </p>

              {/* Elements Tags */}
              <div className="space-y-3">
                <span className="text-[10px] uppercase font-sans tracking-[0.25em] text-[#8C8477]">
                  Design Invocations:
                </span>
                <div className="flex flex-wrap gap-2">
                  {activeStory.elements.map((el, i) => (
                    <span
                      key={i}
                      className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-[#FAF7F2] font-sans tracking-wide"
                    >
                      {el}
                    </span>
                  ))}
                </div>
              </div>

              {/* Color Palette Chips */}
              <div className="space-y-3 pt-2">
                <span className="text-[10px] uppercase font-sans tracking-[0.25em] text-[#8C8477]">
                  Harmonious Palette:
                </span>
                <div className="flex items-center space-x-3">
                  {activeStory.colorPalette.map((cp, idx) => (
                    <div key={idx} className="flex flex-col items-center space-y-1">
                      <div
                        className="w-8 h-8 rounded-full border border-white/20 shadow-md"
                        style={{ backgroundColor: cp.hex }}
                        title={`${cp.name} (${cp.hex})`}
                      />
                      <span className="text-[9px] font-sans text-zinc-400">
                        {cp.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
