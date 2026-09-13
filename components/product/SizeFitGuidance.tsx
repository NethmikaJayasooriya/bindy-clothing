"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Ruler, UserCheck, Sparkles, CheckCircle } from "lucide-react";
import type { Product } from "@/lib/products";
import { BODY_MEASUREMENTS } from "@/data/size-guide";

export interface SizeFitGuidanceProps {
  product: Product;
}

export default function SizeFitGuidance({ product }: SizeFitGuidanceProps) {
  const [unit, setUnit] = useState<"in" | "cm">("in");

  return (
    <section className="py-20 sm:py-24 bg-paper-light border-b border-sand/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Model Specs & Fit Feedback Graphic (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/15 text-xs font-sans uppercase font-bold tracking-wider text-gold border border-gold/30 mb-3">
                <Ruler className="w-3.5 h-3.5 text-gold" />
                <span>Tailoring & Fit Experience</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl text-charcoal-rich font-light leading-tight">
                Size & Fit Guidance
              </h2>
              <p className="text-xs sm:text-sm font-sans text-charcoal-subtle mt-1.5 font-light">
                Designed to embrace the natural female form with calm, effortless movement.
              </p>
            </div>

            {/* Model Spec Card */}
            <div className="p-6 sm:p-7 rounded-3xl bg-paper border border-sand/50 space-y-4 shadow-paper-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-sans uppercase font-bold tracking-wider text-charcoal-rich">
                  <UserCheck className="w-4 h-4 text-gold" />
                  <span>Editorial Model Profile</span>
                </div>
                <span className="text-xs font-sans text-gold font-semibold bg-gold/10 px-2.5 py-0.5 rounded-full">
                  AU 8 (S) Fit
                </span>
              </div>

              <p className="text-xs sm:text-sm font-sans text-charcoal/85 leading-relaxed font-light">
                Model is <strong className="font-semibold text-charcoal">176cm / 5&apos;9&quot;</strong> tall with an 84cm bust, 66cm waist, and 92cm hips.
              </p>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-sand/30 text-center text-xs font-sans">
                <div className="p-2 rounded-xl bg-paper-light border border-sand/30">
                  <span className="text-charcoal-subtle block text-[10px] uppercase tracking-wider">Bust</span>
                  <span className="font-semibold text-charcoal">84 cm</span>
                </div>
                <div className="p-2 rounded-xl bg-paper-light border border-sand/30">
                  <span className="text-charcoal-subtle block text-[10px] uppercase tracking-wider">Waist</span>
                  <span className="font-semibold text-charcoal">66 cm</span>
                </div>
                <div className="p-2 rounded-xl bg-paper-light border border-sand/30">
                  <span className="text-charcoal-subtle block text-[10px] uppercase tracking-wider">Hips</span>
                  <span className="font-semibold text-charcoal">92 cm</span>
                </div>
              </div>

              <p className="text-xs text-charcoal/70 font-sans font-light leading-relaxed">
                Silhouettes are cut with generous ease through the skirt for relaxed comfort across the day.
              </p>
            </div>

            {/* Fit Feedback Visualization */}
            <div className="p-6 sm:p-7 rounded-3xl bg-paper border border-sand/50 space-y-4 shadow-paper-card">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-sans uppercase font-bold tracking-wider text-charcoal-rich">
                  Customer Fit Consensus
                </h3>
                <span className="text-xs font-sans font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  87% True to Size
                </span>
              </div>

              {/* Multi-segment visual bar */}
              <div className="h-3 w-full rounded-full bg-sand/30 overflow-hidden flex shadow-inner">
                <div className="bg-sand-warm h-full" style={{ width: "9%" }} title="9% Runs Small" />
                <div className="bg-gold h-full" style={{ width: "87%" }} title="87% True to Size" />
                <div className="bg-terracotta h-full" style={{ width: "4%" }} title="4% Runs Large" />
              </div>

              <div className="grid grid-cols-3 text-center text-xs font-sans gap-2 pt-1">
                <div className="p-2 rounded-xl bg-paper-light/70">
                  <span className="text-charcoal-subtle block text-[11px]">Runs Small</span>
                  <strong className="text-charcoal font-semibold text-xs">9%</strong>
                </div>
                <div className="p-2 rounded-xl bg-gold/10 border border-gold/30">
                  <span className="text-gold font-bold block text-[11px]">True to Size</span>
                  <strong className="text-charcoal font-bold text-xs">87%</strong>
                </div>
                <div className="p-2 rounded-xl bg-paper-light/70">
                  <span className="text-charcoal-subtle block text-[11px]">Runs Large</span>
                  <strong className="text-charcoal font-semibold text-xs">4%</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Measurement Table (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-2xl text-charcoal-rich font-medium">
                  Garment Body Dimensions
                </h3>
                <p className="text-xs font-sans text-charcoal-subtle font-light mt-0.5">
                  Standard Australian & UK size conversions
                </p>
              </div>

              {/* CM / INCHES Toggle */}
              <div className="flex items-center gap-1 p-1 bg-paper border border-sand/60 rounded-full shadow-sm">
                <button
                  type="button"
                  onClick={() => setUnit("cm")}
                  className={`px-4 py-1.5 rounded-full text-xs font-sans uppercase font-bold tracking-wider transition-all cursor-pointer ${
                    unit === "cm"
                      ? "bg-gold text-charcoal shadow-sm"
                      : "text-charcoal-subtle hover:text-charcoal"
                  }`}
                >
                  CM
                </button>
                <button
                  type="button"
                  onClick={() => setUnit("in")}
                  className={`px-4 py-1.5 rounded-full text-xs font-sans uppercase font-bold tracking-wider transition-all cursor-pointer ${
                    unit === "in"
                      ? "bg-gold text-charcoal shadow-sm"
                      : "text-charcoal-subtle hover:text-charcoal"
                  }`}
                >
                  INCHES
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-2xl border border-sand/50 bg-paper shadow-paper-card">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-[#F8F5EE] border-b border-sand/40 text-xs uppercase font-bold tracking-wider text-charcoal-subtle">
                  <tr>
                    <th className="py-4 px-5">Size (AUS/UK)</th>
                    <th className="py-4 px-5">Bust ({unit})</th>
                    <th className="py-4 px-5">Waist ({unit})</th>
                    <th className="py-4 px-5">Hip ({unit})</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand/30 text-charcoal">
                  {BODY_MEASUREMENTS.map((m) => (
                    <tr
                      key={m.size}
                      className="hover:bg-paper-light/90 transition-colors group"
                    >
                      <td className="py-3.5 px-5 font-bold text-charcoal group-hover:text-gold transition-colors">
                        AU {m.size}
                      </td>
                      <td className="py-3.5 px-5 text-charcoal/85 font-mono text-xs">
                        {m.bust[unit]}
                      </td>
                      <td className="py-3.5 px-5 text-charcoal/85 font-mono text-xs">
                        {m.waist[unit]}
                      </td>
                      <td className="py-3.5 px-5 text-charcoal/85 font-mono text-xs">
                        {m.hip[unit]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Full Size Guide Link */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-sans pt-2">
              <span className="text-charcoal-subtle">
                Unsure about your exact fit? Our Melbourne atelier styling team is available.
              </span>
              <Link
                href="/size-guide"
                className="inline-flex items-center gap-1.5 text-gold hover:text-cinnamon font-bold uppercase tracking-wider transition-colors shrink-0"
              >
                <span>View Full Size Guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
