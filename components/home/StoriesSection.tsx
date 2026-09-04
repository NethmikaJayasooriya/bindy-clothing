"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, Sparkles, ArrowRight, MapPin } from "lucide-react";
import { STORIES, type StoryChapter } from "@/data/stories";
import { SectionHeading, Button } from "@/components/ui";

export default function StoriesSection() {
  const [activeStory, setActiveStory] = useState<StoryChapter>(STORIES[0]);

  return (
    <section id="stories" className="py-24 sm:py-32 bg-paper-dark border-t border-sand/40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Narrative Origins"
          eyebrowIcon={<Compass className="w-3.5 h-3.5 text-gold" />}
          title="The Stories Behind Every Thread"
          italicWord="Every Thread"
          description="Every silhouette is anchored in a real Sri Lankan memory, temple lotus pond, coastal reef, or architectural landmark."
          align="center"
        />

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12 sm:mb-16">
          {STORIES.map((story) => {
            const isActive = activeStory.id === story.id;
            return (
              <button
                key={story.id}
                type="button"
                onClick={() => setActiveStory(story)}
                className={`group px-4 sm:px-5 py-2.5 rounded-full text-xs font-sans uppercase tracking-[0.2em] transition-all duration-300 border cursor-pointer select-none flex items-center gap-2 ${
                  isActive
                    ? "bg-gold text-charcoal border-gold font-bold shadow-luxury scale-[1.03]"
                    : "bg-paper-light/80 text-charcoal/80 border-sand/40 hover:border-gold hover:text-gold font-medium"
                }`}
              >
                <span className="font-mono text-[10px] opacity-70">
                  {story.number}
                </span>
                <span>{story.title}</span>
              </button>
            );
          })}
        </div>

        {/* Active Chapter Showcase */}
        <div className="bg-paper-light rounded-3xl border border-sand/40 shadow-paper-card overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStory.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 p-6 sm:p-10 lg:p-14 items-center"
            >
              {/* Left Column: Visual Artwork (5 cols) */}
              <div className="lg:col-span-5 relative aspect-[3/4] rounded-2xl overflow-hidden bg-paper-dark border border-sand/40 shadow-lg">
                <img
                  src={activeStory.image}
                  alt={activeStory.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[10px] font-mono tracking-widest text-gold uppercase block mb-1">
                    CHAPTER {activeStory.number}
                  </span>
                  <p className="font-serif text-lg leading-tight text-white">
                    {activeStory.title}
                  </p>
                  <p className="text-[11px] font-sans text-sand/80 font-light flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-gold" />
                    {activeStory.location}
                  </p>
                </div>
              </div>

              {/* Right Column: Poetic Narrative & Deep Link (7 cols) */}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 text-[10px] font-sans uppercase tracking-[0.3em] text-gold font-semibold">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{activeStory.subtitle}</span>
                    <span className="text-sand/60">•</span>
                    <span className="font-mono text-muted">{activeStory.coordinates}</span>
                  </div>

                  <h3 className="font-serif text-3xl sm:text-4xl text-charcoal-rich font-light tracking-wide leading-tight">
                    {activeStory.title}
                  </h3>

                  <blockquote className="font-editorial-italic text-lg sm:text-xl text-charcoal font-light border-l-2 border-gold/70 pl-4 py-1 leading-relaxed">
                    &ldquo;{activeStory.quote}&rdquo;
                  </blockquote>

                  <p className="font-sans text-sm sm:text-[15px] text-charcoal/85 font-light leading-relaxed">
                    {activeStory.description}
                  </p>
                </div>

                {/* Color Palette Preview */}
                <div className="space-y-2 pt-2 border-t border-sand/30">
                  <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-muted font-semibold block">
                    Chapter Color Palette
                  </span>
                  <div className="flex flex-wrap items-center gap-3">
                    {activeStory.colorPalette.map((col, i) => (
                      <div key={i} className="flex items-center gap-2 bg-paper-dark px-3 py-1.5 rounded-full border border-sand/40">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-sand/60 shadow-sm"
                          style={{ backgroundColor: col.hex }}
                        />
                        <span className="text-[11px] font-sans font-medium text-charcoal">
                          {col.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Elements */}
                <div className="space-y-2">
                  <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-muted font-semibold block">
                    Garment Design Motifs
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {activeStory.elements.map((el, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-sans px-3 py-1 rounded-full bg-gold/10 text-charcoal border border-gold/25 font-light"
                      >
                        {el}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Prominent Deep Link to Full Story Page */}
                <div className="pt-4 border-t border-sand/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <Link href={`/stories/${activeStory.id}`}>
                    <Button
                      variant="primary"
                      size="md"
                      rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    >
                      Read Full Story Chapter
                    </Button>
                  </Link>

                  <Link
                    href="/stories"
                    className="text-xs font-sans uppercase tracking-[0.2em] text-charcoal/80 hover:text-gold transition-colors font-medium"
                  >
                    View All 5 Chapters →
                  </Link>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
