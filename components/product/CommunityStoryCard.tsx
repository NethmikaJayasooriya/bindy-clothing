"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Heart, MapPin, Quote } from "lucide-react";
import type { Product } from "@/lib/products";

export interface CommunityStory {
  id: string;
  name: string;
  handle: string;
  location: string;
  occasion: string;
  quote: string;
  stylingTip: string;
  image: string;
}

export interface CommunityStoryCardProps {
  product: Product;
}

export default function CommunityStoryCard({ product }: CommunityStoryCardProps) {
  const stories: CommunityStory[] = [
    {
      id: "1",
      name: "Amara Perera",
      handle: "@amara.perera",
      location: "New Farm, Brisbane",
      occasion: "Riverfront Gallery Opening",
      quote: "Wearing this piece felt like wearing a quiet breath. In the humid late afternoon sun, the handloom cotton stayed so airy and composed. Three strangers stopped to ask about the weave.",
      stylingTip: "Styled with vintage woven straw mules and subtle gold hoop earrings.",
      image: product.gallery[0] || product.image,
    },
    {
      id: "2",
      name: "Tahlia Campbell",
      handle: "@tahlia_campbell",
      location: "Noosa Heads, QLD",
      occasion: "Coastal Weekend Escape",
      quote: "The texture softens every single time I wash it. It feels completely intimate to the body — never stiff, never fast fashion. A true heirloom staple in my suitcase.",
      stylingTip: "Draped over swimwear by day, paired with an open linen shirt for sunset drinks.",
      image: product.gallery[1] || product.imageHover || product.image,
    },
    {
      id: "3",
      name: "Elena Rossi",
      handle: "@elena_rossi",
      location: "Cottesloe, WA",
      occasion: "Long Sunday Table Lunch",
      quote: "The attention to detail in the seams and natural buttons is extraordinary. You can physically feel the human hands that guided the shuttle.",
      stylingTip: "Accented with flat tan leather slides and minimal coral jewelry.",
      image: product.gallery[2] || product.image,
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  const prev = () => {
    setActiveIndex((i) => (i === 0 ? stories.length - 1 : i - 1));
  };

  const next = () => {
    setActiveIndex((i) => (i === stories.length - 1 ? 0 : i + 1));
  };

  const activeStory = stories[activeIndex];

  return (
    <section className="py-20 sm:py-24 bg-paper-dark/40 border-b border-sand/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <span className="text-[10px] font-sans uppercase tracking-[0.35em] text-gold font-semibold block">
            Community Spotlight
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-charcoal-rich font-light">
            In Her Own Words
          </h2>
        </div>

        {/* Carousel Card Frame */}
        <div className="relative rounded-3xl bg-paper-light border border-sand/40 shadow-paper-card overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStory.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 p-6 sm:p-10 items-center"
            >
              {/* Thumbnail (4 cols) */}
              <div className="md:col-span-4 relative aspect-[3/4] rounded-2xl overflow-hidden bg-paper-dark border border-sand/40 shadow-md">
                <img
                  src={activeStory.image}
                  alt={activeStory.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full text-[9px] font-sans text-gold border border-white/10 uppercase tracking-wider">
                  Verified Muse
                </div>
              </div>

              {/* Story Content (8 cols) */}
              <div className="md:col-span-8 space-y-5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[10px] font-sans text-muted">
                    <MapPin className="w-3.5 h-3.5 text-gold" />
                    <span>{activeStory.location}</span>
                    <span>•</span>
                    <span className="text-charcoal font-medium">{activeStory.occasion}</span>
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl text-charcoal font-medium">
                    {activeStory.name}{" "}
                    <span className="text-xs font-sans text-gold font-normal">
                      {activeStory.handle}
                    </span>
                  </h3>
                </div>

                <blockquote className="font-editorial-italic text-base sm:text-lg text-charcoal font-light leading-relaxed border-l-2 border-gold/70 pl-4 py-1">
                  &ldquo;{activeStory.quote}&rdquo;
                </blockquote>

                <div className="p-3.5 rounded-2xl bg-paper border border-sand/30 text-xs font-sans">
                  <span className="font-semibold text-gold uppercase tracking-wider text-[10px] block mb-0.5">
                    How She Styled It:
                  </span>
                  <p className="text-charcoal/85 font-light">{activeStory.stylingTip}</p>
                </div>

                {/* Carousel Controls */}
                <div className="pt-2 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {stories.map((s, i) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setActiveIndex(i)}
                        className={`h-2 rounded-full transition-all cursor-pointer ${
                          activeIndex === i ? "w-6 bg-gold" : "w-2 bg-sand/60 hover:bg-sand"
                        }`}
                        aria-label={`Go to slide ${i + 1}`}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={prev}
                      className="p-2 rounded-full border border-sand/50 bg-paper hover:bg-gold hover:text-charcoal transition-colors cursor-pointer"
                      aria-label="Previous story"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={next}
                      className="p-2 rounded-full border border-sand/50 bg-paper hover:bg-gold hover:text-charcoal transition-colors cursor-pointer"
                      aria-label="Next story"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
