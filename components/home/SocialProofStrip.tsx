import React from "react";
import { Star, Camera, Heart, Sparkles, Quote } from "lucide-react";
import { PRESS_QUOTES, UGC_POSTS } from "@/data/socialProof";
import { getStoreReviewsAggregate } from "@/data/products";
import { SectionHeading } from "@/components/ui";

export default function SocialProofStrip() {
  const { averageRating, totalReviews } = getStoreReviewsAggregate();

  return (
    <section className="py-24 sm:py-28 bg-paper border-b border-sand/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 1. Aggregate Rating Banner */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-[10px] font-sans uppercase tracking-[0.35em] text-gold font-semibold block">
            Community & Recognition
          </span>

          <div className="inline-flex items-center justify-center gap-2 bg-paper-light px-6 py-2.5 rounded-full border border-sand/40 shadow-sm">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-4 h-4 fill-gold text-gold" />
              ))}
            </div>
            <span className="text-xs font-sans text-charcoal font-semibold">
              {averageRating} ★{" "}
              <span className="text-muted font-normal">
                · Based on {totalReviews} verified customer reviews
              </span>
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl text-charcoal-rich font-light">
            Loved Across Australia & Beyond
          </h2>
        </div>

        {/* 2. Press Mentions Strip */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {PRESS_QUOTES.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-paper-light border border-sand/40 shadow-sm flex flex-col justify-between space-y-4"
            >
              <Quote className="w-5 h-5 text-gold/60" />
              <blockquote className="font-serif italic text-sm text-charcoal/90 leading-relaxed">
                &ldquo;{item.quote}&rdquo;
              </blockquote>
              <div className="pt-3 border-t border-sand/30">
                <h4 className="font-sans uppercase text-[11px] tracking-[0.2em] text-gold font-semibold">
                  {item.publication}
                </h4>
                <p className="text-[10px] font-sans text-muted">{item.location}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 3. Instagram UGC Community Grid */}
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-sans uppercase tracking-[0.3em] text-gold font-semibold">
                <Camera className="w-3.5 h-3.5 text-gold" />
                <span>#BindyJourneys</span>
              </div>
              <h3 className="font-serif text-2xl text-charcoal-rich font-light mt-1">
                Worn in Quiet, Meaningful Moments
              </h3>
            </div>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-sans uppercase tracking-[0.2em] text-charcoal hover:text-gold transition-colors font-semibold"
            >
              Follow @bindyclothing →
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {UGC_POSTS.map((post) => (
              <div
                key={post.id}
                className="group relative aspect-[4/5] rounded-2xl overflow-hidden bg-paper-dark border border-sand/40 shadow-sm"
              >
                <img
                  src={post.image}
                  alt={post.garment}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-3.5 flex flex-col justify-between text-white">
                  <div className="flex items-center justify-between text-[10px] font-sans">
                    <span className="font-medium text-gold">{post.handle}</span>
                    <span className="flex items-center gap-1 text-[9px]">
                      <Heart className="w-3 h-3 fill-gold text-gold" />
                      {post.likes}
                    </span>
                  </div>

                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-sand/80 block">
                      {post.garment}
                    </span>
                    <p className="text-[10px] font-serif italic text-white/90 line-clamp-3 mt-1">
                      &ldquo;{post.caption}&rdquo;
                    </p>
                    <span className="text-[9px] text-muted block mt-1">
                      {post.location}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
