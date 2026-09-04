"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Ruler, UserCheck, Sparkles } from "lucide-react";
import type { Product } from "@/lib/products";

export interface SizeFitGuidanceProps {
  product: Product;
}

export default function SizeFitGuidance({ product }: SizeFitGuidanceProps) {
  const [unit, setUnit] = useState<"cm" | "in">("cm");

  const sizeMeasurements = [
    { size: "AU 6 (XS)", bust: { cm: "80 - 83", in: "31.5 - 32.5" }, waist: { cm: "62 - 65", in: "24.5 - 25.5" }, hip: { cm: "88 - 91", in: "34.5 - 35.8" }, length: { cm: "128", in: "50.4" } },
    { size: "AU 8 (S)", bust: { cm: "84 - 87", in: "33.0 - 34.2" }, waist: { cm: "66 - 69", in: "26.0 - 27.2" }, hip: { cm: "92 - 95", in: "36.2 - 37.4" }, length: { cm: "130", in: "51.2" } },
    { size: "AU 10 (M)", bust: { cm: "88 - 92", in: "34.6 - 36.2" }, waist: { cm: "70 - 74", in: "27.5 - 29.1" }, hip: { cm: "96 - 100", in: "37.8 - 39.4" }, length: { cm: "132", in: "52.0" } },
    { size: "AU 12 (L)", bust: { cm: "93 - 97", in: "36.6 - 38.2" }, waist: { cm: "75 - 79", in: "29.5 - 31.1" }, hip: { cm: "101 - 105", in: "39.8 - 41.3" }, length: { cm: "134", in: "52.8" } },
    { size: "AU 14 (XL)", bust: { cm: "98 - 103", in: "38.6 - 40.5" }, waist: { cm: "80 - 85", in: "31.5 - 33.5" }, hip: { cm: "106 - 111", in: "41.7 - 43.7" }, length: { cm: "136", in: "53.5" } },
  ];

  return (
    <section className="py-20 sm:py-24 bg-paper-light border-b border-sand/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Model Specs & Fit Feedback Graphic (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <span className="text-[10px] font-sans uppercase tracking-[0.35em] text-gold font-semibold block mb-2">
                Tailoring & Fit Experience
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-charcoal-rich font-light leading-tight">
                Size & Fit Guidance
              </h2>
            </div>

            {/* Model Spec Card */}
            <div className="p-6 rounded-3xl bg-paper border border-sand/40 space-y-3 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-wider text-charcoal font-semibold">
                <UserCheck className="w-4 h-4 text-gold" />
                <span>Editorial Model Profile</span>
              </div>
              <p className="text-xs font-sans text-charcoal/85 leading-relaxed font-light">
                Model is <strong className="font-medium text-charcoal">176cm / 5&apos;9&quot;</strong> tall with an 84cm bust, 66cm waist, and 92cm hips. She wears size <strong className="font-medium text-gold">AU 8 (S)</strong>.
              </p>
              <div className="pt-2 text-[11px] font-sans text-muted font-light">
                Silhouettes cut with gentle drape through the hips for optimal movement and comfort.
              </div>
            </div>

            {/* Fit Feedback Visualization */}
            <div className="p-6 rounded-3xl bg-paper border border-sand/40 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-sans uppercase tracking-wider text-charcoal font-semibold">
                  Customer Fit Consensus
                </h4>
                <span className="text-xs font-sans font-bold text-gold">87% True to Size</span>
              </div>

              {/* Multi-segment visual bar */}
              <div className="h-3 w-full rounded-full bg-sand/30 overflow-hidden flex">
                <div className="bg-sand-warm h-full" style={{ width: "9%" }} title="9% Runs Small" />
                <div className="bg-gold h-full" style={{ width: "87%" }} title="87% True to Size" />
                <div className="bg-terracotta h-full" style={{ width: "4%" }} title="4% Runs Large" />
              </div>

              <div className="grid grid-cols-3 text-center text-[10px] font-sans gap-2">
                <div>
                  <span className="text-muted block">Runs Small</span>
                  <strong className="text-charcoal font-medium">9%</strong>
                </div>
                <div>
                  <span className="text-gold font-semibold block">True to Size</span>
                  <strong className="text-charcoal font-bold">87%</strong>
                </div>
                <div>
                  <span className="text-muted block">Runs Large</span>
                  <strong className="text-charcoal font-medium">4%</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Measurement Table (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h3 className="font-serif text-xl sm:text-2xl text-charcoal font-medium">
                Garment Measurements
              </h3>

              {/* CM / INCHES Toggle */}
              <div className="flex items-center gap-1 p-1 bg-paper border border-sand/50 rounded-full">
                <button
                  type="button"
                  onClick={() => setUnit("cm")}
                  className={`px-3.5 py-1 rounded-full text-xs font-sans uppercase tracking-wider transition-all cursor-pointer ${
                    unit === "cm"
                      ? "bg-gold text-charcoal font-bold shadow-sm"
                      : "text-muted hover:text-charcoal"
                  }`}
                >
                  CM
                </button>
                <button
                  type="button"
                  onClick={() => setUnit("in")}
                  className={`px-3.5 py-1 rounded-full text-xs font-sans uppercase tracking-wider transition-all cursor-pointer ${
                    unit === "in"
                      ? "bg-gold text-charcoal font-bold shadow-sm"
                      : "text-muted hover:text-charcoal"
                  }`}
                >
                  INCHES
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-2xl border border-sand/40 bg-paper shadow-sm">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-paper-dark border-b border-sand/40 text-[10px] uppercase tracking-wider text-muted font-semibold">
                  <tr>
                    <th className="py-3.5 px-4">Size</th>
                    <th className="py-3.5 px-4">Bust ({unit})</th>
                    <th className="py-3.5 px-4">Waist ({unit})</th>
                    <th className="py-3.5 px-4">Hip ({unit})</th>
                    <th className="py-3.5 px-4">Length ({unit})</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand/30 text-charcoal">
                  {sizeMeasurements.map((row, idx) => (
                    <tr key={idx} className="hover:bg-paper-light transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-charcoal">{row.size}</td>
                      <td className="py-3.5 px-4 text-charcoal/80">{row.bust[unit]}</td>
                      <td className="py-3.5 px-4 text-charcoal/80">{row.waist[unit]}</td>
                      <td className="py-3.5 px-4 text-charcoal/80">{row.hip[unit]}</td>
                      <td className="py-3.5 px-4 text-charcoal/80">{row.length[unit]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Full Size Guide Link */}
            <div className="flex items-center justify-between text-xs font-sans pt-2">
              <span className="text-muted">Need personalised sizing advice?</span>
              <Link
                href="/size-guide"
                className="inline-flex items-center gap-1.5 text-gold hover:text-cinnamon font-semibold uppercase tracking-wider transition-colors"
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
