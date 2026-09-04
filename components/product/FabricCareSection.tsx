import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Waves, Sun, ShieldAlert, Wind, Feather } from "lucide-react";
import type { Product } from "@/lib/products";

export interface FabricCareSectionProps {
  product: Product;
  originDistrict?: string;
  weightGsm?: number;
}

export default function FabricCareSection({
  product,
  originDistrict = "Gampaha Handloom Village, Western Province",
  weightGsm = 120,
}: FabricCareSectionProps) {
  const careGuidance = [
    {
      icon: Waves,
      title: "Cold Gentle Wash",
      desc: "Wash by hand or on a delicate machine cycle under 30°C to preserve yarn strength.",
    },
    {
      icon: Sun,
      title: "Line Dry in Shade",
      desc: "Hang in the shade away from direct midday sun to maintain vibrancy of natural vegetable dyes.",
    },
    {
      icon: Wind,
      title: "Warm Iron on Reverse",
      desc: "Iron lightly on the reverse while slightly damp to smooth natural handloom slub.",
    },
    {
      icon: Feather,
      title: "Natural Softening",
      desc: "Our pure organic fibers naturally soften with every gentle wash, aging gracefully with you.",
    },
  ];

  return (
    <section className="py-20 sm:py-24 bg-paper border-b border-sand/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-[10px] font-sans uppercase tracking-[0.35em] text-gold font-semibold block">
            Material Sourcing & Maintenance
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-charcoal-rich font-light">
            Fabric Integrity & Loving Care
          </h2>
          <p className="font-serif italic text-base text-muted font-light">
            Created from living, natural fibers that deserve respectful, mindful care.
          </p>
        </div>

        {/* 2-Column Overview: Fabric Details + Origin */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Card 1: Fabric & Composition */}
          <div className="p-6 rounded-3xl bg-paper-light border border-sand/40 space-y-2.5 shadow-sm">
            <span className="text-[9px] uppercase font-sans tracking-widest text-gold font-semibold">
              Fabric Composition
            </span>
            <h4 className="font-serif text-xl text-charcoal">{product.fabric}</h4>
            <p className="text-xs font-sans text-muted font-light">
              100% natural fiber weave, free from polyester, synthetic blends, or toxic sizing chemicals.
            </p>
          </div>

          {/* Card 2: Fabric Origin */}
          <div className="p-6 rounded-3xl bg-paper-light border border-sand/40 space-y-2.5 shadow-sm">
            <span className="text-[9px] uppercase font-sans tracking-widest text-gold font-semibold">
              Weaving Origin
            </span>
            <h4 className="font-serif text-xl text-charcoal">{originDistrict}</h4>
            <p className="text-xs font-sans text-muted font-light">
              Crafted in small batches by generational artisan families on wooden pit-looms.
            </p>
          </div>

          {/* Card 3: Weight & Feel */}
          <div className="p-6 rounded-3xl bg-paper-light border border-sand/40 space-y-2.5 shadow-sm">
            <span className="text-[9px] uppercase font-sans tracking-widest text-gold font-semibold">
              Cloth Weight & Feel
            </span>
            <h4 className="font-serif text-xl text-charcoal">~{weightGsm} GSM (Featherlight)</h4>
            <p className="text-xs font-sans text-muted font-light">
              Optimal breathability designed specifically for the warm Australian subtropical climate.
            </p>
          </div>
        </div>

        {/* 4 Care Icons Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {careGuidance.map((guide, idx) => {
            const Icon = guide.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-paper-dark/50 border border-sand/30 flex items-start gap-3.5"
              >
                <div className="w-9 h-9 rounded-full bg-gold/15 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-gold" />
                </div>
                <div className="space-y-1">
                  <h5 className="text-xs font-sans uppercase tracking-wider text-charcoal font-semibold">
                    {guide.title}
                  </h5>
                  <p className="text-[11px] font-sans text-muted font-light leading-relaxed">
                    {guide.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Direct Link to Sustainability Page */}
        <div className="text-center">
          <Link
            href="/craft"
            className="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-[0.22em] text-gold hover:text-cinnamon font-semibold transition-colors"
          >
            <span>Learn More About Our Sustainable Craft Journey</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
