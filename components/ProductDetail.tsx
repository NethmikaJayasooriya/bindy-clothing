"use client";

import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Check,
  Minus,
  Plus,
  ShoppingBag,
  ArrowLeft,
  ArrowRight,
  Truck,
  RefreshCw,
  ShieldCheck,
  ChevronDown,
  MapPin,
  Sparkles,
  Heart,
} from "lucide-react";
import { PRODUCTS, getAverageRating, type Product } from "@/lib/products";
import { addToCart, setBuyNowItem } from "@/lib/cart";
import { isInWishlist, toggleWishlist, subscribeWishlist } from "@/lib/wishlist";
import ReviewsSection from "@/components/ReviewsSection";
import SizeGuideModal from "@/components/SizeGuideModal";

function Stars({ value, className = "" }: { value: number; className?: string }) {
  return (
    <span className={`inline-flex items-center ${className}`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${
            i <= Math.round(value)
              ? "fill-gold text-gold"
              : "text-sand/40 fill-transparent"
          }`}
        />
      ))}
    </span>
  );
}

export default function ProductDetail({ product }: { product: Product }) {
  const router = useRouter();
  const [activeImg, setActiveImg] = useState(0);
  const [size, setSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [careOpen, setCareOpen] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [, setWishlistTick] = useState(0);

  useEffect(() => {
    const unsub = subscribeWishlist(() => setWishlistTick((t) => t + 1));
    return () => unsub();
  }, []);

  const avg = useMemo(() => getAverageRating(product), [product]);

  const related = useMemo(() => {
    const matching = PRODUCTS.filter(
      (p) =>
        p.id !== product.id &&
        p.destinations.some((d) => product.destinations.includes(d))
    );
    if (matching.length >= 4) return matching.slice(0, 4);
    const others = PRODUCTS.filter(
      (p) => p.id !== product.id && !matching.some((m) => m.id === p.id)
    );
    return [...matching, ...others].slice(0, 4);
  }, [product]);

  const handleAdd = () => {
    if (!size) return;
    addToCart(product, size, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  const handleBuyNow = () => {
    if (!size) return;
    setBuyNowItem(product, size, qty);
    router.push("/checkout?mode=buynow");
  };

  return (
    <main className="min-h-screen bg-paper dark:bg-ink-deep text-charcoal dark:text-paper">
      {/* Slim header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-paper/85 dark:bg-ink-deep/85 border-b border-sand/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex flex-col leading-none">
            <span className="font-display text-2xl tracking-[0.12em]">BINDY.</span>
            <span className="text-[8px] font-sans uppercase tracking-[0.45em] text-gold mt-0.5">
              Clothing
            </span>
          </Link>
          <Link
            href="/#collection"
            className="flex items-center gap-2 text-[11px] font-sans uppercase tracking-[0.25em] text-zinc-600 dark:text-zinc-300 hover:text-gold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to collection
          </Link>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <nav className="text-[11px] font-sans tracking-wide text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
          <Link href="/" className="hover:text-gold">Home</Link>
          <span>/</span>
          <Link href="/#collection" className="hover:text-gold">Collection</Link>
          <span>/</span>
          <span className="text-zinc-700 dark:text-zinc-200">{product.name}</span>
        </nav>
      </div>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Gallery */}
        <div className="flex flex-col-reverse sm:flex-row gap-4 lg:sticky lg:top-24 self-start w-full">
          <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0 no-scrollbar">
            {product.gallery.map((src, i) => (
              <button
                key={src}
                onMouseEnter={() => setActiveImg(i)}
                onClick={() => setActiveImg(i)}
                className={`relative w-16 h-20 sm:w-20 sm:h-24 aspect-[4/5] rounded-xl overflow-hidden border bg-ink flex-shrink-0 transition-all ${
                  activeImg === i
                    ? "border-gold ring-1 ring-gold"
                    : "border-sand/40 hover:border-gold/60"
                }`}
              >
                <img
                  src={src}
                  alt={`${product.name} view ${i + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = product.image;
                  }}
                />
              </button>
            ))}
          </div>
          <div className="relative flex-1 aspect-[3/4] w-full min-h-[350px] sm:min-h-[460px] rounded-3xl overflow-hidden bg-ink border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImg}
                src={product.gallery[activeImg] || product.image}
                alt={product.name}
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = product.image;
                }}
              />
            </AnimatePresence>
            <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/55 backdrop-blur-md px-3 py-1 rounded-full text-[10px] text-white border border-white/15">
              <span className="w-2.5 h-2.5 rounded-full border border-white/40" style={{ backgroundColor: product.colorHex }} />
              <span className="font-sans uppercase tracking-wider">{product.colorName}</span>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="max-w-lg">
          <p className="text-[11px] font-sans uppercase tracking-[0.35em] text-[#C5A059] mb-2 flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5" />
            {product.story} · {product.storyPlace}
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-light leading-tight">
            {product.name}
          </h1>

          <div className="mt-3 flex items-center gap-3">
            <Stars value={avg} />
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {avg.toFixed(1)} · {product.reviews.length} reviews
            </span>
          </div>

          <div className="mt-4 font-serif text-2xl font-semibold">
            ${product.priceAud} <span className="text-sm font-sans text-zinc-500">AUD</span>
          </div>

          <p className="mt-5 text-[15px] leading-relaxed text-zinc-700 dark:text-zinc-300 font-light">
            {product.description}
          </p>

          {/* palette */}
          <div className="mt-6">
            <p className="text-[10px] font-sans uppercase tracking-[0.3em] text-zinc-500 mb-2">Colour Story</p>
            <div className="flex items-center gap-2">
              {product.palette.map((hex) => (
                <span key={hex} className="w-7 h-7 rounded-full border border-black/10 shadow-sm" style={{ backgroundColor: hex }} title={hex} />
              ))}
              <span className="ml-2 text-xs text-zinc-500 dark:text-zinc-400">{product.colorName}</span>
            </div>
          </div>

          {/* fabric */}
          <div className="mt-5 text-sm">
            <span className="text-zinc-500 dark:text-zinc-400">Fabric — </span>
            <span className="text-zinc-800 dark:text-zinc-200">{product.fabric}</span>
          </div>

          {/* size */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <p className="text-[10px] font-sans uppercase tracking-[0.3em] text-zinc-500">Select Size</p>
                <span className="text-[11px] text-zinc-400 font-sans">• AU sizing</span>
              </div>
              <button
                type="button"
                onClick={() => setShowSizeGuide(true)}
                className="text-xs font-sans uppercase tracking-wide text-gold hover:underline underline-offset-4 cursor-pointer"
              >
                Size Guide
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-sans transition-all border ${
                    size === s
                      ? "bg-[#1F1E1D] text-[#FAF7F2] border-[#1F1E1D]"
                      : "bg-transparent border-[#DCC7AF]/60 text-zinc-700 dark:text-zinc-300 hover:border-[#C5A059]"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* qty + add + wishlist */}
          <div className="mt-6 flex items-stretch gap-3">
            <div className="flex items-center border border-sand/60 rounded-full px-1">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-2 text-zinc-600 hover:text-black dark:hover:text-white cursor-pointer" aria-label="Decrease">
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-sans text-sm">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="p-2 text-zinc-600 hover:text-black dark:hover:text-white cursor-pointer" aria-label="Increase">
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleAdd}
              disabled={!size}
              className={`flex-1 rounded-full font-sans text-xs uppercase tracking-[0.25em] font-semibold flex items-center justify-center gap-2.5 transition-all py-3.5 ${
                !size
                  ? "bg-sand/20 text-muted border border-sand/30 cursor-not-allowed"
                  : "bg-gold hover:bg-cinnamon text-white shadow-[0_8px_30px_rgba(197,160,89,0.35)] cursor-pointer"
              }`}
            >
              {added ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
              {added ? "Added to Bag" : !size ? "Select a Size" : "Add to Bag"}
            </button>

            <button
              type="button"
              onClick={() => toggleWishlist(product)}
              className={`px-4 rounded-full border transition-all duration-300 cursor-pointer flex items-center justify-center ${
                isInWishlist(product.id)
                  ? "border-gold bg-gold/15 text-gold shadow-sm ring-1 ring-gold/40"
                  : "border-sand/60 text-zinc-600 dark:text-zinc-300 hover:border-gold hover:text-gold"
              }`}
              title={isInWishlist(product.id) ? "Saved in Wishlist" : "Save to Wishlist"}
              aria-label="Wishlist toggle"
            >
              <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? "fill-gold text-gold" : ""}`} />
            </button>
          </div>

          {/* Buy Now Button (Distinct Secondary Outlined Luxury Style) */}
          <button
            onClick={handleBuyNow}
            disabled={!size}
            className={`w-full mt-3 py-3.5 rounded-full font-sans text-xs uppercase tracking-[0.25em] font-semibold flex items-center justify-center gap-2.5 transition-all border ${
              !size
                ? "bg-transparent text-muted/60 border-sand/30 cursor-not-allowed"
                : "bg-transparent border-gold text-gold hover:bg-gold hover:text-charcoal cursor-pointer shadow-md"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Buy Now • Express Checkout</span>
          </button>

          <AnimatePresence>
            {added && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-3 text-xs text-zinc-600 dark:text-zinc-300"
              >
                Added {qty} × {size}. <Link href="/" className="text-[#C5A059] underline underline-offset-2">View your bag →</Link>
              </motion.div>
            )}
          </AnimatePresence>

          {/* trust row */}
          <div className="mt-6 grid grid-cols-3 gap-2 text-[10px] font-sans text-zinc-500 dark:text-zinc-400">
            <div className="flex items-center gap-1.5"><Truck className="w-3.5 h-3.5 text-[#C5A059]" /> Free AU shipping $150+</div>
            <div className="flex items-center gap-1.5"><RefreshCw className="w-3.5 h-3.5 text-[#C5A059]" /> 30-day returns</div>
            <div className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" /> Secure checkout</div>
          </div>

          {/* heritage narrative */}
          <div className="mt-9 border-t border-[#DCC7AF]/30 pt-7">
            <p className="text-[10px] font-sans uppercase tracking-[0.35em] text-[#C5A059] mb-3">The Story</p>
            <blockquote className="font-serif italic text-xl leading-snug text-zinc-800 dark:text-zinc-100">
              “{product.quote}”
            </blockquote>
            <p className="mt-4 text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-300 font-light">
              {product.heritage}
            </p>
          </div>

          {/* craft details */}
          <div className="mt-7">
            <p className="text-[10px] font-sans uppercase tracking-[0.35em] text-zinc-500 mb-3">Thoughtful Details</p>
            <ul className="space-y-2">
              {product.craftDetails.map((d) => (
                <li key={d} className="flex items-start gap-2.5 text-sm text-zinc-700 dark:text-zinc-300">
                  <Check className="w-4 h-4 text-[#C5A059] mt-0.5 flex-shrink-0" />
                  {d}
                </li>
              ))}
            </ul>
          </div>

          {/* care accordion */}
          <div className="mt-6 border-t border-[#DCC7AF]/30 pt-4">
            <button onClick={() => setCareOpen((o) => !o)} className="w-full flex items-center justify-between text-sm font-sans uppercase tracking-[0.2em] text-zinc-700 dark:text-zinc-200">
              Care & Fabric
              <ChevronDown className={`w-4 h-4 transition-transform ${careOpen ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {careOpen && (
                <motion.ul
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden mt-3 space-y-1.5 text-sm text-zinc-600 dark:text-zinc-400"
                >
                  {product.care.map((c) => (
                    <li key={c} className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-[#C5A059]" />{c}</li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <ReviewsSection product={product} />

      {/* Related */}
      {related.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <h2 className="font-serif text-2xl sm:text-3xl font-light mb-8 text-center text-paper-light">
            Complete the <span className="italic">journey</span>
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((p) => (
              <Link key={p.id} href={`/product/${p.id}`} className="group flex flex-col">
                <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-ink border border-white/10 shadow-sm flex-shrink-0">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:opacity-0"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.opacity = "0.7";
                    }}
                  />
                  <img
                    src={p.imageHover || p.image}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover opacity-0 transition-all duration-700 group-hover:opacity-100"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = p.image;
                    }}
                  />
                </div>
                <p className="mt-3 text-[10px] font-sans uppercase tracking-[0.25em] text-[#C5A059]">{p.story}</p>
                <h3 className="font-serif text-base font-medium text-paper-light group-hover:text-[#C5A059] transition-colors leading-snug">{p.name}</h3>

                {p.reviews && p.reviews.length > 0 ? (
                  <div className="mt-1 flex items-center gap-1.5" title={`${getAverageRating(p).toFixed(1)} out of 5 stars (${p.reviews.length} reviews)`}>
                    <div className="inline-flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-2.5 h-2.5 ${
                            star <= Math.round(getAverageRating(p))
                              ? "fill-gold text-gold"
                              : "text-sand/30 fill-transparent"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] font-sans text-sand/60">({p.reviews.length})</span>
                  </div>
                ) : (
                  <span className="mt-1 text-[9px] font-sans uppercase tracking-widest text-gold/80 font-medium">New Arrival</span>
                )}

                <p className="mt-1 text-sm text-sand/70">${p.priceAud} AUD</p>
              </Link>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/#collection" className="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-[0.25em] text-paper-light hover:text-[#C5A059] transition-colors">
              View the full collection <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      )}

      {/* Size Guide Modal */}
      <SizeGuideModal isOpen={showSizeGuide} onClose={() => setShowSizeGuide(false)} />
    </main>
  );
}
