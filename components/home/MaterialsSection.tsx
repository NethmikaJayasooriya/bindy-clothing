"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Leaf } from "lucide-react";
import { CRAFT_MATERIALS, ETHICAL_PILLARS } from "@/data/craft";
import { SectionHeading, Button } from "@/components/ui";

export default function MaterialsSection() {
  return (
    <section id="craft" className="py-24 sm:py-28 bg-paper-dark border-y border-sand/40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Fabric & Material Board"
          eyebrowIcon={<Leaf className="w-3.5 h-3.5 text-gold" />}
          title="Crafted with Heart. Made to be Loved."
          italicWord="Made to be Loved."
          description="Natural, breathable fabrics chosen to bring effortless comfort and calm to warm Australian days."
          align="center"
        />

        {/* 4 Fabric Board Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
          {CRAFT_MATERIALS.map((mat) => (
            <div
              key={mat.id}
              className="p-6 sm:p-7 rounded-3xl bg-paper-light border border-sand/40 hover:border-gold/70 transition-all duration-300 shadow-paper-card hover:shadow-luxury flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <span className="text-[9px] uppercase font-sans tracking-[0.22em] px-3 py-1 rounded-full bg-gold/15 text-charcoal font-semibold inline-block border border-gold/25">
                  {mat.badge}
                </span>

                <h3 className="font-serif text-xl text-charcoal-rich font-medium">
                  {mat.title}
                </h3>

                <p className="text-xs font-sans text-muted font-light">
                  {mat.subtitle}
                </p>

                <p className="text-xs font-sans text-charcoal/85 leading-relaxed pt-3 border-t border-sand/30 font-light">
                  {mat.desc}
                </p>
              </div>

              <div className="pt-2 text-[10px] font-sans text-gold font-medium uppercase tracking-wider">
                {mat.origin}
              </div>
            </div>
          ))}
        </div>

        {/* Ethical Highlights Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 py-8 border-y border-sand/30 mb-10">
          {ETHICAL_PILLARS.map((p, i) => (
            <div key={i} className="text-center space-y-1">
              <span className="font-serif text-3xl sm:text-4xl text-gold font-light">
                {p.stat}
              </span>
              <h4 className="text-xs font-sans uppercase tracking-wider text-charcoal font-semibold">
                {p.title}
              </h4>
              <p className="text-[11px] font-sans text-muted font-light max-w-[200px] mx-auto">
                {p.desc}
              </p>
            </div>
          ))}
        </div>

        {/* "Learn about our fabrics" CTA Button linking to /craft */}
        <div className="text-center space-y-3">
          <Link href="/craft">
            <Button
              variant="primary"
              size="md"
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Learn About Our Fabrics & Artisan Process
            </Button>
          </Link>
          <p className="text-xs font-sans text-muted font-light">
            Read our sourcing standards, weaver fair wages, and natural plant-dyeing methods.
          </p>
        </div>
      </div>
    </section>
  );
}
