"use client";
import { useState } from "react";
import Link from "next/link";
import ResponsiveImage from "@/components/ResponsiveImage";
import { useStorefront } from "@/components/StorefrontProvider";
import { homepageProducts } from "@/lib/homepage-content";
import type { Product } from "@/data/products";
import { SectionHeading } from "@/components/ui";

export interface ShopTheLookSectionProps {
  onQuickView?: (product: Product) => void;
  onAddToCart?: (product: Product, size: string) => void;
}

export default function ShopTheLookSection({ onQuickView, onAddToCart }: ShopTheLookSectionProps) {
  const { products, homepage } = useStorefront();
  const content = homepage?.shopTheLook;
  const pieces = homepageProducts(content?.productIds ?? [], products);
  const [sizes, setSizes] = useState<Record<string, string>>({});
  if (!content?.published || pieces.length !== 2) return null;
  return <section className="px-4 sm:px-6 lg:px-8 py-14 sm:py-20 border-t border-sand/40" aria-label={content.title}>
    <div className="max-w-7xl mx-auto">
      <SectionHeading eyebrow={content.eyebrow} title={content.title} description={content.description}/>
      <div className="grid sm:grid-cols-2 gap-6 sm:gap-10 max-w-4xl mx-auto">
        {pieces.map(product => {
          const size = sizes[product.id] ?? "";
          const available = (value: string) => !product.stock || (product.stock[value] ?? 0) > 0;
          return <article key={product.id} className="bg-white border border-sand/50">
            <Link href={`/product/${product.id}`}><ResponsiveImage src={product.image} alt={product.name} sizes="(max-width: 640px) 100vw, 450px" className="w-full aspect-[3/4] object-cover"/></Link>
            <div className="p-5 sm:p-6 space-y-4">
              <Link href={`/product/${product.id}`} className="block font-serif text-2xl">{product.name}</Link>
              <p className="text-sm text-charcoal-subtle">{product.fabric}</p>
              <p className="font-semibold">${product.priceAud} AUD</p>
              <label className="block text-xs">Size for {product.name}<select value={size} onChange={e => setSizes(current => ({ ...current, [product.id]: e.target.value }))} className="mt-2 w-full p-3 border border-sand bg-white"><option value="">Choose a size</option>{product.sizes.map(value => <option key={value} value={value} disabled={!available(value)}>{value}{!available(value) ? " · sold out" : ""}</option>)}</select></label>
              <div className="flex gap-3 flex-wrap">
                <button type="button" disabled={!size || !available(size)} onClick={() => onAddToCart?.(product, size)} className="bg-charcoal text-white px-5 py-3 text-xs uppercase tracking-wider disabled:opacity-40">Add to bag</button>
                <button type="button" onClick={() => onQuickView?.(product)} className="px-4 py-3 text-xs underline underline-offset-4">Quick view</button>
              </div>
            </div>
          </article>;
        })}
      </div>
    </div>
  </section>;
}
