import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Waves, Sun, ShieldAlert, Wind, Feather, CheckCircle2 } from "lucide-react";
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
    <section className="py-20 sm:py-24 bg-paper border-b border-sand/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/15 text-xs font-sans uppercase font-bold tracking-wider text-gold border border-gold/30">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span>Material Sourcing & Maintenance</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-charcoal-rich font-light">
            Fabric Integrity & Loving Care
          </h2>
          <p className="font-serif italic text-base sm:text-lg text-charcoal-subtle font-light">
            Created from living, natural fibers that deserve respectful, mindful care.
          </p>
        </div>

        {/* 3-Card Overview: Fabric Details + Origin + Weight */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Card 1: Fabric & Composition */}
          <div className="p-7 rounded-3xl bg-paper-light border border-sand/50 space-y-3 shadow-paper-card hover:border-gold/50 transition-all">
            <span className="text-xs uppercase font-sans tracking-widest text-gold font-bold block">
              Pure Natural Weave
            </span>
            <h3 className="font-serif text-2xl text-charcoal-rich">{product.fabric}</h3>
            <p className="text-xs sm:text-sm font-sans text-charcoal/80 font-light leading-relaxed">
              100% natural organic fiber weave, completely free from polyester, synthetic microplastics, and toxic chemical finishes.
            </p>
            <div className="pt-2 flex items-center gap-1.5 text-xs text-emerald-800 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>GOTS-Certified Botanical Dyes</span>
            </div>
          </div>

          {/* Card 2: Fabric Origin */}
          <div className="p-7 rounded-3xl bg-paper-light border border-sand/50 space-y-3 shadow-paper-card hover:border-gold/50 transition-all">
            <span className="text-xs uppercase font-sans tracking-widest text-gold font-bold block">
              Weaving Origin
            </span>
            <h3 className="font-serif text-2xl text-charcoal-rich">{originDistrict}</h3>
            <p className="text-xs sm:text-sm font-sans text-charcoal/80 font-light leading-relaxed">
              Crafted in limited seasonal batches by generational artisan weaving families working on traditional timber pit-looms.
            </p>
            <div className="pt-2 flex items-center gap-1.5 text-xs text-emerald-800 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>Direct Artisan Living Wage Verified</span>
            </div>
          </div>

          {/* Card 3: Weight & Feel */}
          <div className="p-7 rounded-3xl bg-paper-light border border-sand/50 space-y-3 shadow-paper-card hover:border-gold/50 transition-all">
            <span className="text-xs uppercase font-sans tracking-widest text-gold font-bold block">
              Cloth Weight & Breathability
            </span>
            <h3 className="font-serif text-2xl text-charcoal-rich">~{weightGsm} GSM (Featherlight)</h3>
            <p className="text-xs sm:text-sm font-sans text-charcoal/80 font-light leading-relaxed">
              Optimal airflow and whisper-soft drape designed specifically for the warm Australian subtropical climate.
            </p>
            <div className="pt-2 flex items-center gap-1.5 text-xs text-emerald-800 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>High Air Permeability</span>
            </div>
          </div>
        </div>

        {/* 4 Care Icons Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
          {careGuidance.map((guide, idx) => {
            const Icon = guide.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#F8F5EE] border border-sand/40 flex items-start gap-4 hover:border-gold/40 transition-colors shadow-sm"
              >
                <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center shrink-0 border border-gold/25">
                  <Icon className="w-5 h-5 text-gold" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs uppercase font-sans font-bold tracking-wider text-charcoal-rich">
                    {guide.title}
                  </h4>
                  <p className="text-xs font-sans text-charcoal/80 font-light leading-relaxed">
                    {guide.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Direct Link to Sustainability Page */}
        <div className="text-center pt-2">
          <Link
            href="/craft"
            className="inline-flex items-center gap-2 text-xs font-sans uppercase font-bold tracking-widest text-gold hover:text-cinnamon transition-colors border-b border-gold/40 hover:border-cinnamon pb-0.5"
          >
            <span>Learn More About Our Sustainable Craft Journey</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
