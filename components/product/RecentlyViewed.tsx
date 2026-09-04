"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { PRODUCTS, type Product } from "@/data/products";

export interface RecentlyViewedProps {
  currentProductId: string;
}

const STORAGE_KEY = "bindy-recently-viewed";

export default function RecentlyViewed({ currentProductId }: RecentlyViewedProps) {
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const ids: string[] = raw ? JSON.parse(raw) : [];

      // Add current product to front and dedup
      const updatedIds = [currentProductId, ...ids.filter((id) => id !== currentProductId)].slice(0, 8);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedIds));

      // Resolve full product items excluding current product for display
      const items = updatedIds
        .filter((id) => id !== currentProductId)
        .map((id) => PRODUCTS.find((p) => p.id === id))
        .filter(Boolean) as Product[];

      setRecentProducts(items.slice(0, 4));
    } catch {
      /* ignore quota errors */
    }
  }, [currentProductId]);

  if (recentProducts.length === 0) return null;

  return (
    <section className="py-16 sm:py-20 bg-paper-light border-b border-sand/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gold" />
            <h3 className="font-serif text-xl sm:text-2xl text-charcoal font-light">
              Recently Viewed
            </h3>
          </div>

          <Link
            href="/collection"
            className="text-xs font-sans uppercase tracking-[0.2em] text-gold hover:text-cinnamon font-semibold transition-colors"
          >
            Explore All →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {recentProducts.map((p) => (
            <Link
              key={p.id}
              href={`/product/${p.id}`}
              className="group flex flex-col bg-paper rounded-2xl overflow-hidden border border-sand/40 hover:border-gold/60 p-3 sm:p-4 transition-all shadow-sm hover:shadow-md"
            >
              <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-paper-dark mb-3">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <span className="text-[9px] uppercase font-sans tracking-widest text-gold font-semibold">
                {p.story}
              </span>
              <h4 className="font-serif text-sm font-medium text-charcoal group-hover:text-gold transition-colors truncate mt-0.5">
                {p.name}
              </h4>
              <p className="mt-1 text-xs font-serif font-semibold text-charcoal">
                ${p.priceAud} AUD
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
