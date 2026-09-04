import React from "react";
import { MapPin, Check, Sparkles } from "lucide-react";
import type { Product } from "@/lib/products";

export interface StoryBlockProps {
  product: Product;
}

export default function StoryBlock({ product }: StoryBlockProps) {
  // Select an evocative location/lifestyle inspiration photo
  const inspirationPhoto =
    product.gallery[1] || product.imageHover || product.image;

  return (
    <section className="py-20 sm:py-28 bg-paper-dark/60 border-y border-sand/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Inspiration Photo Frame (5 cols) */}
          <div className="lg:col-span-5 relative aspect-[3/4] sm:aspect-[4/5] rounded-3xl overflow-hidden bg-paper shadow-luxury border border-sand/40">
            <img
              src={inspirationPhoto}
              alt={`${product.story} inspiration`}
              loading="lazy"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

            {/* Photo Caption Badge */}
            <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
              <span className="text-[9px] uppercase font-sans tracking-[0.25em] text-gold font-semibold flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-gold" />
                {product.storyPlace}
              </span>
              <p className="font-serif text-lg leading-tight text-white/95">
                The Heritage of {product.story}
              </p>
            </div>
          </div>

          {/* Narrative & Craft Details (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-[10px] font-sans uppercase tracking-[0.35em] text-gold font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-gold" />
                <span>The Story</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl text-charcoal-rich font-light tracking-wide leading-tight">
                An Ode to {product.storyPlace}
              </h2>

              <blockquote className="font-editorial-italic text-xl sm:text-2xl text-charcoal font-light leading-relaxed border-l-2 border-gold/70 pl-5 py-1">
                &ldquo;{product.quote}&rdquo;
              </blockquote>

              <p className="font-sans text-sm sm:text-[15px] leading-relaxed text-charcoal/85 font-light">
                {product.heritage}
              </p>
            </div>

            {/* Thoughtful Details Checklist */}
            <div className="pt-6 border-t border-sand/30 space-y-4">
              <h3 className="text-[11px] font-sans uppercase tracking-[0.28em] text-gold font-semibold">
                Thoughtful Handcrafted Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.craftDetails.map((detail, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-paper-light border border-sand/30 shadow-sm"
                  >
                    <div className="w-5 h-5 rounded-full bg-gold/15 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-gold stroke-[2.5]" />
                    </div>
                    <span className="text-xs font-sans text-charcoal/85 font-light leading-relaxed">
                      {detail}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
