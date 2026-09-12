"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Compass, Feather } from "lucide-react";

export default function EditorialPhilosophyBanner() {
  return (
    <section className="relative w-full py-20 sm:py-24 bg-[#181614] text-[#FAF7F2] border-y border-[#C5A059]/30 overflow-hidden select-none">
      {/* Ambient Warm Golden Spotlight in Background */}
      <div className="absolute -top-32 left-1/3 w-[600px] h-[350px] bg-[#C5A059]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-28 right-1/4 w-[500px] h-[300px] bg-[#B86B4B]/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Decorative Golden Stitched Hairline Borders */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#C5A059]/40 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#C5A059]/30 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Macro Handloom Weave Visual Framing (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] sm:aspect-[1/1] lg:aspect-[4/5] w-full max-w-md mx-auto rounded-[32px] overflow-hidden border border-[#C5A059]/30 shadow-[0_20px_60px_rgba(0,0,0,0.6)] group">
              {/* Macro Handloom Fabric Image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/detail/lotus-memory-dress-b.jpg"
                alt="Artisan Sri Lankan Handloom Weave Texture"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {/* Floating Artisan Seal Badge */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-[#141312]/85 backdrop-blur-md border border-[#C5A059]/40 flex items-center justify-between shadow-xl">
                <div className="space-y-0.5">
                  <span className="block text-[9px] font-mono text-[#C5A059] uppercase tracking-[0.25em] font-bold">
                    Ancestral Pit-Loom
                  </span>
                  <span className="block font-serif text-sm text-white font-medium">
                    100% Natural Organic Cotton
                  </span>
                </div>
                <span className="text-[#C5A059] text-sm opacity-90">✦</span>
              </div>
            </div>

            {/* Subtle floating badge behind image */}
            <div className="hidden sm:flex absolute -top-4 -left-4 w-20 h-20 rounded-full border border-dashed border-[#C5A059]/40 items-center justify-center p-2 text-center pointer-events-none rotate-[-12deg]">
              <span className="text-[8px] font-mono uppercase tracking-widest text-[#C5A059] font-bold leading-tight">
                Slow Craft
              </span>
            </div>
          </div>

          {/* Right Column: Editorial Quote & Slow Fashion Metrics (7 cols) */}
          <div className="lg:col-span-7 space-y-8 text-left">
            
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-[#C5A059]/40 text-[#C5A059] text-[10px] font-mono tracking-[0.25em] uppercase font-semibold">
              <Sparkles className="w-3 h-3 text-[#C5A059]" />
              <span>Atelier Philosophy • Two Islands</span>
            </div>

            {/* Main Editorial Quote */}
            <blockquote className="space-y-4">
              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#FAF7F2] font-light leading-[1.3] tracking-tight">
                “Woven slowly on ancestral wooden looms in rural Sri Lanka — designed for effortless, sun-drenched Australian living.”
              </h3>
              <p className="font-serif italic text-sm sm:text-base text-[#DCC7AF]/80 leading-relaxed font-light max-w-xl">
                Every meter carries the rhythmic cadence of the weaver&apos;s pedal. No two bolts are ever tensioned identically; each silhouette is an intimate dialogue between island heritage and coastal calm.
              </p>
            </blockquote>

            {/* 3 Slow-Fashion Metric Pillars */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-6 border-t border-white/10">
              <div className="space-y-1">
                <span className="block font-serif text-2xl sm:text-3xl text-[#C5A059] font-light">
                  14 Days
                </span>
                <span className="block text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-[#DCC7AF]/70 font-medium">
                  Single Bolt Weave
                </span>
              </div>

              <div className="space-y-1 border-l border-white/10 pl-4 sm:pl-6">
                <span className="block font-serif text-2xl sm:text-3xl text-[#C5A059] font-light">
                  100%
                </span>
                <span className="block text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-[#DCC7AF]/70 font-medium">
                  Natural Plant Dyes
                </span>
              </div>

              <div className="space-y-1 border-l border-white/10 pl-4 sm:pl-6">
                <span className="block font-serif text-2xl sm:text-3xl text-[#C5A059] font-light">
                  0%
                </span>
                <span className="block text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-[#DCC7AF]/70 font-medium">
                  Plastic Polyester
                </span>
              </div>
            </div>

            {/* Micro Link to Craft Page */}
            <div className="pt-2">
              <Link
                href="/craft"
                className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[#C5A059] hover:text-white transition-colors group font-semibold"
              >
                <span>Read the Weaver&apos;s Guild Chronicle</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
