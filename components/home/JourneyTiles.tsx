"use client";

import React from "react";
import Link from "next/link";
import {
  MapPin,
  Palmtree,
  Sparkles,
  Building2,
  Flower2,
  Sun,
  ArrowRight,
} from "lucide-react";
import { DESTINATIONS, type Destination } from "@/data/products";
import { SectionHeading } from "@/components/ui";

const DEST_ICONS: Record<Destination, React.ElementType> = {
  Beach: Palmtree,
  Party: Sparkles,
  City: Building2,
  Garden: Flower2,
  Everyday: Sun,
};

const DEST_IMAGES: Record<Destination | "All", string> = {
  All: "/images/destinations/all.jpg",
  Beach: "/images/destinations/beach.jpg",
  Party: "/images/destinations/party.jpg",
  City: "/images/destinations/city.jpg",
  Garden: "/images/destinations/garden.jpg",
  Everyday: "/images/destinations/everyday.jpg",
};

const HOVER_CAPTIONS: Record<Destination | "All", string> = {
  All: "Explore all 19 handcrafted silhouettes",
  Beach: "Breezy handloom linens and oceanic hues",
  Party: "Liquid silk drapery under golden evening lights",
  City: "Architectural gingham and easy shirting structure",
  Garden: "Soft lotus pinks and botanical voile gathers",
  Everyday: "Breathable island staples for effortless mornings",
};

export interface JourneyTilesProps {
  onSelectJourney?: (destination: Destination | "All") => void;
  selectedJourney?: Destination | "All";
}

export default function JourneyTiles({
  onSelectJourney,
  selectedJourney,
}: JourneyTilesProps) {
  const allDestinations: Destination[] = [
    "Beach",
    "Party",
    "City",
    "Garden",
    "Everyday",
  ];

  return (
    <section className="relative py-20 sm:py-24 px-4 sm:px-6 lg:px-8 bg-paper-dark/50 border-b border-sand/30">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          eyebrow="Curated Living"
          eyebrowIcon={<MapPin className="w-3.5 h-3.5 text-gold" />}
          title="Shop by Journey"
          italicWord="Journey"
          description="Where will your clothes accompany you? Silhouettes tailored for sun, salt, city, and calm."
          align="center"
        />

        {/* 5 Journey Horizontal Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
          {allDestinations.map((destKey) => {
            const meta = DESTINATIONS.find((d) => d.key === destKey);
            const Icon = DEST_ICONS[destKey];
            const active = selectedJourney === destKey;

            return (
              <Link
                key={destKey}
                href={`/collection?journey=${destKey}`}
                onClick={(e) => {
                  if (onSelectJourney) {
                    e.preventDefault();
                    onSelectJourney(destKey);
                    const el = document.getElementById("browse-collection");
                    el?.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className={`group relative h-64 sm:h-72 lg:h-80 rounded-3xl overflow-hidden text-left transition-all duration-500 cursor-pointer shadow-paper-card hover:shadow-luxury-hover hover:-translate-y-1.5 ${
                  active ? "ring-2 ring-gold scale-[1.02]" : "ring-1 ring-sand/40"
                }`}
              >
                {/* Background Image */}
                <img
                  src={DEST_IMAGES[destKey]}
                  alt={meta?.label || destKey}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />

                {/* Scrim Gradients */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300" />
                <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black/90 via-black/45 to-transparent" />

                {/* Top Icon Badge */}
                <div className="absolute top-4 left-4 w-9 h-9 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center border border-white/15 text-gold">
                  <Icon className="w-4 h-4" />
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-0 p-5 flex flex-col justify-end text-white">
                  <span className="text-[9px] uppercase font-sans tracking-[0.25em] text-sand/80 font-medium">
                    Destination
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-normal leading-tight text-white group-hover:text-gold transition-colors">
                    {meta?.label}
                  </h3>
                  <p className="text-[11px] font-sans text-sand/90 font-light mt-1">
                    {meta?.tagline}
                  </p>

                  {/* Hover Caption */}
                  <p className="text-[10px] font-serif italic text-white/90 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 line-clamp-2">
                    {HOVER_CAPTIONS[destKey]}
                  </p>

                  {/* Micro action arrow */}
                  <div className="mt-3 flex items-center gap-1 text-[10px] uppercase font-sans tracking-widest text-gold font-semibold">
                    <span>Shop Journey</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
