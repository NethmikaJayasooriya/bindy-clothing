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
  MapPin,
  Sparkles,
  Heart,
  ZoomIn,
  Bell,
  Eye,
} from "lucide-react";
import { PRODUCTS, getAverageRating, type Product } from "@/lib/products";
import { addToCart, setBuyNowItem } from "@/lib/cart";
import { isInWishlist, toggleWishlist, subscribeWishlist } from "@/lib/wishlist";
import LightboxModal from "@/components/product/LightboxModal";
import NotifyModal from "@/components/product/NotifyModal";
import StoryBlock from "@/components/product/StoryBlock";
import FabricCareSection from "@/components/product/FabricCareSection";
import SizeFitGuidance from "@/components/product/SizeFitGuidance";
import ReviewsSection from "@/components/ReviewsSection";
import CommunityStoryCard from "@/components/product/CommunityStoryCard";
import CompleteTheLook from "@/components/product/CompleteTheLook";
import RecentlyViewed from "@/components/product/RecentlyViewed";
import StickyMobileBar from "@/components/product/StickyMobileBar";
import SizeGuideModal from "@/components/SizeGuideModal";
import Footer from "@/components/Footer";

function Stars({ value, className = "" }: { value: number; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-0.5 ${className}`}>
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
  const [size, setSize] = useState<string | null>(product.sizes[1] || product.sizes[0] || null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [notifyModalSize, setNotifyModalSize] = useState<string | null>(null);
  const [, setWishlistTick] = useState(0);

  useEffect(() => {
    const unsub = subscribeWishlist(() => setWishlistTick((t) => t + 1));
    return () => unsub();
  }, []);

  const avg = useMemo(() => getAverageRating(product), [product]);

  // Inventory logic per size: AU 14 is limited/sold out on select styles to demonstrate the notify flow
  const sizeAvailability = useMemo(() => {
    const map: Record<string, "in_stock" | "low_stock" | "sold_out"> = {};
    product.sizes.forEach((s, idx) => {
      if (idx === product.sizes.length - 1 && product.id.includes("dress")) {
        map[s] = "low_stock";
      } else {
        map[s] = "in_stock";
      }
    });
    return map;
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
    <main className="min-h-screen bg-paper text-charcoal">
      {/* 1. SLIM HEADER */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-paper/90 border-b border-sand/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex flex-col leading-none">
            <span className="font-display text-2xl tracking-[0.12em] text-charcoal">BINDY.</span>
            <span className="text-[8px] font-sans uppercase tracking-[0.45em] text-gold mt-0.5 font-semibold">
              Clothing
            </span>
          </Link>
          <Link
            href="/#browse-collection"
            className="flex items-center gap-2 text-[11px] font-sans uppercase tracking-[0.25em] text-charcoal/80 hover:text-gold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to collection
          </Link>
        </div>
      </header>

      {/* BREADCRUMB */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <nav className="text-[11px] font-sans tracking-wide text-muted flex items-center gap-2">
          <Link href="/" className="hover:text-gold">Home</Link>
          <span>/</span>
          <Link href="/collection" className="hover:text-gold">Collection</Link>
          <span>/</span>
          <Link href={`/collection/${product.category.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")}`} className="hover:text-gold">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-charcoal font-medium">{product.name}</span>
        </nav>
      </div>

      {/* 2. SECTION 1: GALLERY + BUY BOX */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Gallery Column (7 cols) */}
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4 lg:sticky lg:top-24 self-start w-full">
          {/* Thumbnail list */}
          <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0 no-scrollbar">
            {product.gallery.map((src, i) => (
              <button
                key={src}
                onMouseEnter={() => setActiveImg(i)}
                onClick={() => setActiveImg(i)}
                className={`relative w-16 h-20 sm:w-20 sm:h-24 aspect-[4/5] rounded-xl overflow-hidden border bg-paper-dark shrink-0 transition-all cursor-pointer ${
                  activeImg === i
                    ? "border-gold ring-2 ring-gold/70 shadow-sm scale-102"
                    : "border-sand/40 hover:border-gold/60 opacity-75 hover:opacity-100"
                }`}
              >
                <img
                  src={src}
                  alt={`${product.name} view ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

          {/* Main Display Image with Click-to-Zoom */}
          <div
            className="relative flex-1 aspect-[3/4] w-full min-h-[380px] sm:min-h-[500px] rounded-3xl overflow-hidden bg-paper-dark border border-sand/40 shadow-xl group cursor-zoom-in"
            onClick={() => setIsLightboxOpen(true)}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImg}
                src={product.gallery[activeImg] || product.image}
                alt={product.name}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </AnimatePresence>

            {/* Color Swatch Badge */}
            <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/55 backdrop-blur-md px-3 py-1 rounded-full text-[10px] text-white border border-white/15">
              <span
                className="w-2.5 h-2.5 rounded-full border border-white/40"
                style={{ backgroundColor: product.colorHex }}
              />
              <span className="font-sans uppercase tracking-wider">{product.colorName}</span>
            </div>

            {/* Click to Zoom Overlay Cue */}
            <div className="absolute bottom-4 right-4 bg-black/50 hover:bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] text-white flex items-center gap-1.5 border border-white/15 transition-all opacity-0 group-hover:opacity-100">
              <ZoomIn className="w-3.5 h-3.5 text-gold" />
              <span className="font-sans uppercase tracking-wider">Tap to Expand</span>
            </div>
          </div>
        </div>

        {/* Buy Box Column (5 cols - Sticky on desktop scroll) */}
        <div className="lg:col-span-5 max-w-lg lg:sticky lg:top-24 space-y-6">
          <div>
            <p className="text-[10px] font-sans uppercase tracking-[0.35em] text-gold mb-2 flex items-center gap-2 font-semibold">
              <MapPin className="w-3.5 h-3.5" />
              {product.story} · {product.storyPlace}
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl font-light leading-tight text-charcoal-rich">
              {product.name}
            </h1>

            <div className="mt-3 flex items-center gap-3">
              <Stars value={avg} />
              <span className="text-xs text-muted font-sans font-medium">
                {avg.toFixed(1)} · {product.reviews.length} customer reviews
              </span>
            </div>

            <div className="mt-4 font-serif text-2xl sm:text-3xl font-semibold text-charcoal-rich tracking-tight">
              ${product.priceAud} <span className="text-sm font-sans text-muted font-normal">AUD</span>
            </div>

            <p className="mt-4 text-[14px] sm:text-[15px] leading-relaxed text-charcoal/85 font-light">
              {product.description}
            </p>
          </div>

          {/* Color Story Swatches */}
          <div className="pt-2 border-t border-sand/30">
            <p className="text-[10px] font-sans uppercase tracking-[0.28em] text-muted mb-2 font-semibold">
              Natural Color Story
            </p>
            <div className="flex items-center gap-2.5">
              {product.palette.map((hex) => (
                <span
                  key={hex}
                  className="w-7 h-7 rounded-full border border-sand/70 shadow-sm transition-transform hover:scale-110"
                  style={{ backgroundColor: hex }}
                  title={hex}
                />
              ))}
              <span className="ml-2 text-xs text-muted font-sans font-medium">
                {product.colorName}
              </span>
            </div>
          </div>

          {/* Size Selector with Stock & Notify Me */}
          <div className="pt-2 border-t border-sand/30 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <p className="text-[10px] font-sans uppercase tracking-[0.28em] text-muted font-semibold">
                  Select Size
                </p>
                <span className="text-[11px] text-muted font-sans">• AU standard sizing</span>
              </div>
              <button
                type="button"
                onClick={() => setShowSizeGuide(true)}
                className="text-xs font-sans uppercase tracking-wider text-gold hover:text-cinnamon cursor-pointer font-semibold underline underline-offset-4"
              >
                Size Guide
              </button>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {product.sizes.map((s) => {
                const status = sizeAvailability[s];
                const isSelected = size === s;

                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      if (status === "sold_out") {
                        setNotifyModalSize(s);
                      } else {
                        setSize(s);
                      }
                    }}
                    className={`relative px-4 py-2.5 rounded-xl text-xs font-sans transition-all border cursor-pointer flex flex-col items-center ${
                      isSelected
                        ? "bg-charcoal text-paper-light border-charcoal font-semibold shadow-md scale-[1.02]"
                        : "bg-paper-light border-sand/40 text-charcoal hover:border-gold font-medium"
                    }`}
                  >
                    <span>{s}</span>
                    {status === "low_stock" && (
                      <span className="text-[8px] uppercase tracking-wider text-gold font-semibold -mt-0.5">
                        Only 2 Left
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Qty + Add to Bag + Wishlist */}
          <div className="pt-2 flex items-stretch gap-3">
            <div className="flex items-center border border-sand/60 rounded-full px-1.5 bg-paper-light shadow-sm">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="p-2 text-charcoal/70 hover:text-charcoal cursor-pointer"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-sans text-sm font-semibold text-charcoal">
                {qty}
              </span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="p-2 text-charcoal/70 hover:text-charcoal cursor-pointer"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleAdd}
              disabled={!size}
              className={`flex-1 rounded-full font-sans text-xs uppercase tracking-[0.25em] font-semibold flex items-center justify-center gap-2.5 transition-all py-4 min-h-[48px] ${
                !size
                  ? "bg-sand/20 text-muted border border-sand/30 cursor-not-allowed"
                  : "bg-gold hover:bg-cinnamon text-charcoal hover:text-white shadow-luxury hover:shadow-luxury-hover cursor-pointer"
              }`}
            >
              {added ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
              {added ? "Added to Bag" : !size ? "Select a Size" : "Add to Bag"}
            </button>

            <button
              type="button"
              onClick={() => toggleWishlist(product)}
              className={`px-4.5 rounded-full border transition-all duration-300 cursor-pointer flex items-center justify-center min-h-[48px] ${
                isInWishlist(product.id)
                  ? "border-gold bg-gold/15 text-gold shadow-sm ring-1 ring-gold/40"
                  : "border-sand/60 text-charcoal hover:border-gold hover:text-gold bg-paper-light"
              }`}
              title={isInWishlist(product.id) ? "Saved in Wishlist" : "Save to Wishlist"}
              aria-label="Wishlist toggle"
            >
              <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? "fill-gold text-gold" : ""}`} />
            </button>
          </div>

          {/* Buy Now (Express Checkout) */}
          <button
            onClick={handleBuyNow}
            disabled={!size}
            className={`w-full py-4 rounded-full font-sans text-xs uppercase tracking-[0.25em] font-semibold flex items-center justify-center gap-2.5 transition-all border min-h-[48px] ${
              !size
                ? "bg-transparent text-muted/60 border-sand/30 cursor-not-allowed"
                : "bg-paper-light border-gold text-charcoal hover:bg-gold hover:text-charcoal cursor-pointer shadow-sm hover:shadow-md"
            }`}
          >
            <Sparkles className="w-4 h-4 text-gold" />
            <span>Buy Now • Express Checkout</span>
          </button>

          {/* Value Highlights Strip */}
          <div className="grid grid-cols-3 gap-2 text-[10px] font-sans text-muted pt-2 border-t border-sand/30">
            <div className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-gold shrink-0" />
              <span>Free AU $150+</span>
            </div>
            <div className="flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 text-gold shrink-0" />
              <span>30-Day Returns</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-gold shrink-0" />
              <span>Ethical Craft</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. SECTION 2: STORY BLOCK (Full-Width Section) */}
      <StoryBlock product={product} />

      {/* 4. SECTION 3: FABRIC & CARE */}
      <FabricCareSection product={product} />

      {/* 5. SECTION 4: SIZE & FIT GUIDANCE */}
      <SizeFitGuidance product={product} />

      {/* 6. SECTION 5: REVIEWS + Q&A SUB-TAB */}
      <ReviewsSection product={product} />

      {/* 7. SECTION 6: FEATURED COMMUNITY STORY CAROUSEL */}
      <CommunityStoryCard product={product} />

      {/* 8. SECTION 7: COMPLETE THE LOOK / CROSS-SELL */}
      <CompleteTheLook currentProduct={product} onAddToCart={handleAdd} />

      {/* 9. SECTION 8: RECENTLY VIEWED */}
      <RecentlyViewed currentProductId={product.id} />

      {/* 10. SECTION 9: STICKY MOBILE ADD-TO-CART BAR */}
      <StickyMobileBar
        product={product}
        selectedSize={size}
        onSelectSize={(s) => setSize(s)}
        onAddToCart={handleAdd}
        isAdded={added}
      />

      {/* FOOTER */}
      <Footer />

      {/* MODALS: Lightbox, Notify, Size Guide */}
      <LightboxModal
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        images={product.gallery}
        initialIndex={activeImg}
        productName={product.name}
      />

      <NotifyModal
        isOpen={Boolean(notifyModalSize)}
        onClose={() => setNotifyModalSize(null)}
        productName={product.name}
        size={notifyModalSize || "AU 14 (XL)"}
      />

      <SizeGuideModal isOpen={showSizeGuide} onClose={() => setShowSizeGuide(false)} />
    </main>
  );
}
