import React from "react";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";

export interface StoryCardProps {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  quote: string;
  image: string;
  colorPalette: { name: string; hex: string }[];
  elements?: string[];
  className?: string;
}

export default function StoryCard({
  id,
  number,
  title,
  subtitle,
  quote,
  image,
  colorPalette,
  elements,
  className = "",
}: StoryCardProps) {
  return (
    <Link
      href={`/stories/${id}`}
      className={`group relative flex flex-col bg-paper-light rounded-3xl overflow-hidden border border-sand/40 hover:border-gold/70 transition-all duration-500 shadow-paper-card hover:shadow-luxury-hover ${className}`}
    >
      {/* Image Banner */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-paper-dark">
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Chapter Number Badge */}
        <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-mono tracking-widest text-gold border border-white/10">
          CHAPTER {number}
        </div>

        {/* Palette Swatches (Bottom Right of Image) */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
          {colorPalette.slice(0, 4).map((c, i) => (
            <span
              key={i}
              className="w-2.5 h-2.5 rounded-full border border-white/30"
              style={{ backgroundColor: c.hex }}
              title={c.name}
            />
          ))}
        </div>
      </div>

      {/* Narrative Info */}
      <div className="p-6 sm:p-7 flex flex-col justify-between flex-1 space-y-4">
        <div className="space-y-2">
          <p className="text-[10px] font-sans uppercase tracking-[0.3em] text-gold font-semibold flex items-center gap-1.5">
            <MapPin className="w-3 h-3" />
            {subtitle}
          </p>

          <h3 className="font-serif text-2xl text-charcoal-rich font-light group-hover:text-gold transition-colors leading-snug">
            {title}
          </h3>

          <blockquote className="font-serif italic text-sm text-charcoal/80 font-light border-l-2 border-gold/50 pl-3 py-0.5">
            &ldquo;{quote}&rdquo;
          </blockquote>
        </div>

        {/* Footer Link */}
        <div className="pt-3 border-t border-sand/30 flex items-center justify-between text-xs font-sans uppercase tracking-[0.22em] text-charcoal font-semibold group-hover:text-gold transition-colors">
          <span>Read Full Chapter</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
