"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, UserCheck } from "lucide-react";
import { FOUNDERS } from "@/data/founders";
import { SectionHeading, Button } from "@/components/ui";

export default function FoundersSection() {
  return (
    <section id="about" className="py-24 sm:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-paper">
      <SectionHeading
        eyebrow="Our Origin • Three Women"
        eyebrowIcon={<Sparkles className="w-3.5 h-3.5 text-gold" />}
        title="Three Women. One Vision."
        italicWord="One Vision"
        description="What began as one woman's dream evolved into a shared journey between a mother and her two daughters, united by a passion for ethical slow fashion."
        align="center"
      />

      {/* Editorial Founder Cards Spread */}
      <div className="border border-sand/40 bg-paper-light rounded-3xl shadow-paper-card overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-sand/40">
          {FOUNDERS.map((founder, idx) => (
            <motion.div
              key={founder.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="p-8 lg:p-10 flex flex-col justify-between space-y-6 text-left hover:bg-paper-dark/30 transition-colors duration-300"
            >
              {/* Header: Monogram + Number */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-display text-4xl sm:text-5xl text-gold tracking-wide select-none">
                    {founder.monogram}
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.3em] text-muted uppercase font-medium">
                    {founder.number} / 03
                  </span>
                </div>

                <div className="w-10 h-px bg-gold/50" />

                <div>
                  <h3 className="font-serif text-2xl sm:text-3xl text-charcoal-rich font-medium tracking-wide leading-snug">
                    {founder.name}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] font-sans uppercase tracking-[0.25em] text-gold font-semibold mt-1">
                    {founder.role}
                  </p>
                  <p className="text-[10px] font-sans text-muted mt-0.5">
                    {founder.location}
                  </p>
                </div>
              </div>

              {/* Emotional Centerpiece: Pull-Quote */}
              <div className="space-y-3 my-auto py-2">
                <blockquote className="font-editorial-italic text-base text-charcoal font-light leading-relaxed border-l-2 border-gold/60 pl-3.5 py-0.5">
                  &ldquo;{founder.quote}&rdquo;
                </blockquote>
                <p className="font-sans text-xs text-charcoal/80 font-light leading-relaxed line-clamp-4">
                  {founder.bio}
                </p>
              </div>

              {/* Focus Tags & Link to About */}
              <div className="pt-4 border-t border-sand/30 space-y-4">
                <div className="space-y-1.5">
                  <span className="text-[9px] uppercase font-sans tracking-[0.28em] text-muted block font-semibold">
                    Focus Areas
                  </span>
                  <div className="text-xs font-sans text-charcoal font-light flex flex-wrap gap-1.5">
                    {founder.focus.slice(0, 3).map((f, i) => (
                      <span key={i} className="text-[10px] bg-paper-dark px-2.5 py-0.5 rounded-full border border-sand/40 text-charcoal/80">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Click-through to full founder bio on About page */}
                <Link
                  href={`/about#${founder.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-sans uppercase tracking-[0.2em] text-gold hover:text-cinnamon font-semibold transition-colors pt-2 group"
                >
                  <span>Read Full Bio & Interview</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom CTA to About page */}
      <div className="text-center mt-12">
        <Link href="/about">
          <Button
            variant="secondary"
            size="md"
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Explore Our Complete Story & Timeline
          </Button>
        </Link>
      </div>
    </section>
  );
}
