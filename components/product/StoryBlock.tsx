import React from "react";
import { MapPin, Check, Sparkles, Award } from "lucide-react";
import type { Product } from "@/lib/products";

export interface StoryBlockProps {
  product: Product;
}

export default function StoryBlock({ product }: StoryBlockProps) {
  // Select an evocative location/lifestyle inspiration photo
  const inspirationPhoto =
    product.gallery[1] || product.imageHover || product.image;

  return (
    <section className="py-20 sm:py-28 bg-[#F8F5EE] border-y border-sand/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Inspiration Photo Frame with Editorial Border (5 cols) */}
          <div className="lg:col-span-5 relative aspect-[3/4] sm:aspect-[4/5] rounded-3xl overflow-hidden bg-paper shadow-2xl border border-sand/50 group">
            <img
              src={inspirationPhoto}
              alt={`${product.story} inspiration`}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

            {/* Photo Caption Badge */}
            <div className="absolute bottom-6 left-6 right-6 text-white space-y-1.5 backdrop-blur-sm bg-black/30 p-4 rounded-2xl border border-white/15">
              <span className="text-xs uppercase font-sans tracking-wider text-gold font-bold flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-gold" />
                {product.storyPlace}
              </span>
              <p className="font-serif text-lg sm:text-xl leading-snug text-white font-medium">
                The Heritage of {product.story}
              </p>
              <p className="text-xs text-white/80 font-sans font-light">
                Documented in small artisan weaving communes of Sri Lanka
              </p>
            </div>
          </div>

          {/* Narrative & Craft Details (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/15 text-xs font-sans uppercase font-bold tracking-wider text-gold border border-gold/30">
                <Sparkles className="w-3.5 h-3.5 text-gold" />
                <span>The Story & Provenance</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-charcoal-rich font-light tracking-wide leading-tight">
                An Ode to {product.storyPlace}
              </h2>

              <blockquote className="font-serif italic text-xl sm:text-2xl text-charcoal-rich font-light leading-relaxed border-l-3 border-gold pl-5 py-2 my-4 bg-gold/5 rounded-r-2xl">
                &ldquo;{product.quote}&rdquo;
              </blockquote>

              <p className="font-sans text-sm sm:text-base leading-relaxed text-charcoal/85 font-light">
                {product.heritage}
              </p>
            </div>

            {/* Thoughtful Details Checklist */}
            <div className="pt-6 border-t border-sand/40 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-sans uppercase tracking-widest text-gold font-bold">
                  Thoughtful Handcrafted Details
                </h3>
                <span className="text-xs font-sans text-charcoal-subtle flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-gold" />
                  Master Artisan Hand-Finished
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.craftDetails.map((detail, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-4 rounded-2xl bg-paper-light border border-sand/40 shadow-sm hover:border-gold/60 transition-colors"
                  >
                    <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 text-gold stroke-[2.5]" />
                    </div>
                    <span className="text-xs sm:text-sm font-sans text-charcoal leading-relaxed font-normal">
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
