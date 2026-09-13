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
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Ruler,
  Gift,
  Leaf,
  Info,
  Clock,
  Share2,
} from "lucide-react";
import { PRODUCTS, getAverageRating, type Product } from "@/lib/products";
import {
  getCart,
  saveCart,
  addToCart,
  setBuyNowItem,
  subscribe as subscribeCart,
  cartCount,
  type CartItem,
} from "@/lib/cart";
import {
  isInWishlist,
  toggleWishlist,
  subscribeWishlist,
  getWishlistCount,
} from "@/lib/wishlist";
import BrandLogo from "@/components/BrandLogo";
import CartDrawer from "@/components/CartDrawer";
import WishlistDrawer from "@/components/WishlistDrawer";
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

  // Cart & Wishlist Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartCountNum, setCartCountNum] = useState(0);
  const [wishlistCountNum, setWishlistCountNum] = useState(0);

  // Buy Box Accordion State
  const [activeAccordion, setActiveAccordion] = useState<"fit" | "fabric" | "shipping" | null>(null);

  // Share Notification
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const syncCart = () => {
      const items = getCart();
      setCartItems(items);
      setCartCountNum(cartCount(items));
    };
    const syncWishlist = () => {
      setWishlistCountNum(getWishlistCount());
      setWishlistTick((t) => t + 1);
    };

    syncCart();
    syncWishlist();

    const unsubCart = subscribeCart(syncCart);
    const unsubWishlist = subscribeWishlist(syncWishlist);
    return () => {
      unsubCart();
      unsubWishlist();
    };
  }, []);

  const avg = useMemo(() => getAverageRating(product), [product]);
  const installment = useMemo(() => (product.priceAud / 4).toFixed(2), [product.priceAud]);

  // Inventory logic per size
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

  const handleUpdateQuantity = (id: string, sizeVal: string, delta: number) => {
    const current = getCart();
    const next = current
      .map((item) => {
        if (item.product.id === id && item.size === sizeVal) {
          return { ...item, quantity: item.quantity + delta };
        }
        return item;
      })
      .filter((item) => item.quantity > 0);
    saveCart(next);
    setCartItems(next);
    setCartCountNum(cartCount(next));
  };

  const handleRemoveItem = (id: string, sizeVal: string) => {
    const current = getCart();
    const next = current.filter(
      (item) => !(item.product.id === id && item.size === sizeVal)
    );
    saveCart(next);
    setCartItems(next);
    setCartCountNum(cartCount(next));
  };

  const handleAdd = () => {
    if (!size) return;
    addToCart(product, size, qty);
    setAdded(true);
    // Smoothly open cart drawer after micro-feedback
    setTimeout(() => {
      setAdded(false);
      setIsCartOpen(true);
    }, 450);
  };

  const handleBuyNow = () => {
    if (!size) return;
    setBuyNowItem(product, size, qty);
    router.push("/checkout?mode=buynow");
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const prevImage = () => {
    setActiveImg((i) => (i === 0 ? product.gallery.length - 1 : i - 1));
  };

  const nextImage = () => {
    setActiveImg((i) => (i === product.gallery.length - 1 ? 0 : i + 1));
  };

  const toggleAccordion = (key: "fit" | "fabric" | "shipping") => {
    setActiveAccordion((curr) => (curr === key ? null : key));
  };

  return (
    <main className="min-h-screen bg-paper text-charcoal selection:bg-gold/20">
      {/* 1. LUXURY BOUTIQUE HEADER */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-paper/95 border-b border-sand/40 transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          {/* Brand Logo with deliberate spacing */}
          <Link
            href="/"
            className="inline-flex items-center transition-transform duration-300 hover:scale-[1.01]"
          >
            <BrandLogo size="md" />
          </Link>

          {/* Center Announcement Ticker (Desktop only) */}
          <div className="hidden md:flex items-center gap-2 text-xs font-sans text-charcoal/80 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span>Complimentary AU Express Shipping on Orders $150+</span>
          </div>

          {/* Right Navigation Utilities */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Back to collection link */}
            <Link
              href="/#browse-collection"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-sans uppercase tracking-wider text-charcoal/80 hover:text-gold transition-colors font-medium mr-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Collection</span>
            </Link>

            {/* Share Piece */}
            <button
              onClick={handleShare}
              className="p-2.5 rounded-full border border-sand/50 hover:border-gold hover:text-gold text-charcoal/80 bg-paper-light/70 transition-all cursor-pointer relative"
              title="Share piece"
              aria-label="Share this piece"
            >
              <Share2 className="w-4 h-4" />
              {copiedLink && (
                <span className="absolute -bottom-8 right-0 text-[11px] font-sans bg-charcoal text-paper-light px-2 py-0.5 rounded shadow-md whitespace-nowrap">
                  Link copied!
                </span>
              )}
            </button>

            {/* Wishlist Button with Counter Badge */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="p-2.5 rounded-full border border-sand/50 hover:border-gold text-charcoal hover:text-gold bg-paper-light/70 transition-all cursor-pointer relative"
              title="View Wishlist"
              aria-label="Open Wishlist"
            >
              <Heart
                className={`w-4 h-4 ${
                  wishlistCountNum > 0 ? "fill-gold text-gold" : ""
                }`}
              />
              {wishlistCountNum > 0 && (
                <span className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full bg-gold text-charcoal text-[10px] font-sans font-bold flex items-center justify-center shadow-sm">
                  {wishlistCountNum}
                </span>
              )}
            </button>

            {/* Cart Bag with Counter Badge */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2.5 rounded-full border border-sand/50 hover:border-gold text-charcoal hover:text-gold bg-paper-light/70 transition-all cursor-pointer relative"
              title="View Cart"
              aria-label="Open Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartCountNum > 0 && (
                <span className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full bg-charcoal text-paper-light text-[10px] font-sans font-bold flex items-center justify-center shadow-sm">
                  {cartCountNum}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* 2. BREADCRUMB & BACK LINK */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <nav className="text-xs font-sans tracking-wide text-charcoal-subtle flex items-center gap-2 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-gold transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/collection" className="hover:text-gold transition-colors">
            Collection
          </Link>
          <span>/</span>
          <Link
            href={`/collection/${product.category.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")}`}
            className="hover:text-gold transition-colors"
          >
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-charcoal font-medium truncate">{product.name}</span>
        </nav>
      </div>

      {/* 3. HERO SHOWCASE: GALLERY (7 COLS) + BUY BOX (5 COLS) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
        {/* Gallery Column (7 cols) */}
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4 lg:sticky lg:top-24 self-start w-full">
          {/* Thumbnail Rail */}
          <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0 no-scrollbar">
            {product.gallery.map((src, i) => (
              <button
                key={src}
                onMouseEnter={() => setActiveImg(i)}
                onClick={() => setActiveImg(i)}
                className={`relative w-16 h-22 sm:w-20 sm:h-26 rounded-2xl overflow-hidden border bg-paper-dark shrink-0 transition-all duration-200 cursor-pointer ${
                  activeImg === i
                    ? "border-gold ring-2 ring-gold/70 shadow-md scale-102"
                    : "border-sand/40 hover:border-gold/60 opacity-80 hover:opacity-100"
                }`}
                aria-label={`Select photo ${i + 1}`}
              >
                <img
                  src={src}
                  alt={`${product.name} thumbnail ${i + 1}`}
                  className="w-full h-full object-cover"
                />
                {activeImg === i && (
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-gold" />
                )}
              </button>
            ))}
          </div>

          {/* Main Hero Stage */}
          <div className="relative flex-1 aspect-[3/4] w-full min-h-[420px] sm:min-h-[550px] rounded-3xl overflow-hidden bg-paper-dark border border-sand/40 shadow-xl group select-none">
            {/* Background Image with Crossfade */}
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImg}
                src={product.gallery[activeImg] || product.image}
                alt={product.name}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="absolute inset-0 w-full h-full object-cover cursor-zoom-in"
                onClick={() => setIsLightboxOpen(true)}
              />
            </AnimatePresence>

            {/* Subtle Gradient Overlays for High-Contrast Text Badges */}
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/45 via-black/10 to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/45 via-black/10 to-transparent pointer-events-none" />

            {/* Top Left Craft Heritage Badge */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 bg-black/55 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs text-white border border-white/20 shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              <span className="font-sans font-medium tracking-wide">
                100% Handloom · {product.storyPlace.split(",")[0] || "Sri Lanka"}
              </span>
            </div>

            {/* Top Right Color Swatch Badge */}
            <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-black/55 backdrop-blur-md px-3 py-1.5 rounded-full text-xs text-white border border-white/20 shadow-md">
              <span
                className="w-3 h-3 rounded-full border border-white/60 shadow-sm"
                style={{ backgroundColor: product.colorHex }}
              />
              <span className="font-sans uppercase font-medium tracking-wider text-[11px]">
                {product.colorName}
              </span>
            </div>

            {/* Prev / Next Chevrons */}
            {product.gallery.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/40 hover:bg-black/75 text-white backdrop-blur-md flex items-center justify-center border border-white/20 transition-all opacity-0 group-hover:opacity-100 sm:opacity-75 cursor-pointer shadow-lg hover:scale-105"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/40 hover:bg-black/75 text-white backdrop-blur-md flex items-center justify-center border border-white/20 transition-all opacity-0 group-hover:opacity-100 sm:opacity-75 cursor-pointer shadow-lg hover:scale-105"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Bottom Left: Image Counter (e.g., 2 / 4) */}
            <div className="absolute bottom-4 left-4 z-10 bg-black/55 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white/90 font-mono border border-white/15">
              {activeImg + 1} / {product.gallery.length}
            </div>

            {/* Bottom Right: Click to Zoom Cue */}
            <button
              onClick={() => setIsLightboxOpen(true)}
              className="absolute bottom-4 right-4 z-10 bg-black/55 hover:bg-black/80 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs text-white flex items-center gap-1.5 border border-white/20 transition-all cursor-pointer shadow-md"
            >
              <ZoomIn className="w-3.5 h-3.5 text-gold" />
              <span className="font-sans uppercase tracking-wider text-[11px]">
                Full Screen
              </span>
            </button>
          </div>
        </div>

        {/* Buy Box Column (5 cols - Sticky on desktop) */}
        <div className="lg:col-span-5 max-w-lg lg:sticky lg:top-24 space-y-6">
          {/* Header & Title */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/15 border border-gold/30 text-gold mb-3">
              <MapPin className="w-3 h-3 text-gold" />
              <span className="text-xs font-sans uppercase font-bold tracking-wider">
                {product.story} · {product.storyPlace}
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-[40px] font-light leading-tight text-charcoal-rich">
              {product.name}
            </h1>

            {/* Rating Anchor Link */}
            <div className="mt-3 flex items-center gap-3">
              <Stars value={avg} />
              <a
                href="#reviews"
                className="text-xs text-charcoal-subtle hover:text-gold font-sans font-medium transition-colors underline underline-offset-2"
              >
                {avg.toFixed(1)} · {product.reviews.length} Verified Customer Reviews
              </a>
            </div>

            {/* Price & Installments Breakdown */}
            <div className="mt-4 pt-3 border-t border-sand/40">
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-3xl sm:text-4xl font-medium text-charcoal-rich tracking-tight">
                  ${product.priceAud}
                </span>
                <span className="text-sm font-sans text-charcoal-subtle font-medium">
                  AUD
                </span>
                <span className="text-xs text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 ml-2 font-sans font-medium">
                  Tax Included
                </span>
              </div>

              {/* Installment Badge */}
              <p className="text-xs font-sans text-charcoal-subtle mt-1.5 flex items-center gap-1.5">
                <span>or 4 interest-free payments of</span>
                <strong className="text-charcoal font-semibold">${installment}</strong>
                <span>with</span>
                <span className="font-semibold text-charcoal border-b border-charcoal/40">
                  Afterpay
                </span>
                <span>or</span>
                <span className="font-semibold text-charcoal border-b border-charcoal/40">
                  Klarna
                </span>
              </p>
            </div>

            {/* Description */}
            <p className="mt-4 text-[14px] sm:text-[15px] leading-relaxed text-charcoal/85 font-light">
              {product.description}
            </p>
          </div>

          {/* Color Story Palette */}
          <div className="pt-4 border-t border-sand/30">
            <div className="flex items-center justify-between mb-2.5">
              <p className="text-xs font-sans uppercase font-bold tracking-wider text-charcoal-subtle">
                Natural Color Story
              </p>
              <span className="text-xs font-sans text-charcoal font-medium">
                {product.colorName}
              </span>
            </div>
            <div className="flex items-center gap-3">
              {product.palette.map((hex, idx) => (
                <div
                  key={hex}
                  className={`relative p-0.5 rounded-full border transition-all ${
                    idx === 0
                      ? "border-gold ring-2 ring-gold/40 scale-105"
                      : "border-sand/60 hover:border-sand"
                  }`}
                >
                  <span
                    className="block w-6 h-6 rounded-full shadow-inner"
                    style={{ backgroundColor: hex }}
                    title={hex}
                  />
                </div>
              ))}
              <span className="text-xs text-charcoal-subtle font-sans pl-1">
                Hand-dyed using organic vegetable pigments
              </span>
            </div>
          </div>

          {/* Size Selector with Unified Button Geometry */}
          <div className="pt-4 border-t border-sand/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-sans uppercase font-bold tracking-wider text-charcoal-subtle">
                  Select Size
                </span>
                {size && (
                  <span className="text-xs text-charcoal font-semibold bg-sand/30 px-2 py-0.5 rounded-full">
                    {size}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setShowSizeGuide(true)}
                className="inline-flex items-center gap-1.5 text-xs font-sans uppercase font-bold tracking-wider text-gold hover:text-cinnamon transition-colors cursor-pointer"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>Size Guide</span>
              </button>
            </div>

            {/* Size Buttons Grid */}
            <div className="grid grid-cols-5 gap-2">
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
                    className={`relative h-12 rounded-xl text-xs font-sans transition-all border cursor-pointer flex flex-col items-center justify-center p-1 ${
                      isSelected
                        ? "bg-charcoal text-paper-light border-charcoal font-bold shadow-md scale-[1.02]"
                        : "bg-paper-light border-sand/50 text-charcoal hover:border-gold hover:bg-paper font-medium"
                    }`}
                  >
                    <span className="font-medium tracking-tight">
                      {s.split(" ")[0]} {s.split(" ")[1]}
                    </span>
                    {status === "low_stock" && (
                      <span className="text-[9px] uppercase tracking-wider text-amber-600 font-bold -mt-0.5 font-sans">
                        Only 2 Left
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <p className="text-xs text-charcoal-subtle font-sans pt-1">
              Fits true to AU sizing. Tailored with relaxed ease through the hips.
            </p>
          </div>

          {/* Qty Counter + Primary Add to Bag + Wishlist */}
          <div className="pt-2 flex items-stretch gap-3">
            {/* Quantity Pill */}
            <div className="flex items-center border border-sand/60 rounded-2xl px-1.5 bg-paper-light shadow-sm shrink-0">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="p-2.5 text-charcoal/70 hover:text-charcoal cursor-pointer disabled:opacity-40"
                disabled={qty <= 1}
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-7 text-center font-sans text-sm font-semibold text-charcoal">
                {qty}
              </span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="p-2.5 text-charcoal/70 hover:text-charcoal cursor-pointer"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Add to Bag Button */}
            <button
              onClick={handleAdd}
              disabled={!size}
              className={`flex-1 rounded-2xl font-sans text-sm uppercase font-bold tracking-wider flex items-center justify-center gap-2.5 transition-all py-4 min-h-[52px] shadow-luxury ${
                !size
                  ? "bg-sand/30 text-charcoal-subtle border border-sand/40 cursor-not-allowed"
                  : "bg-gold hover:bg-[#B38F46] text-charcoal hover:text-white shadow-luxury hover:shadow-luxury-hover cursor-pointer active:scale-[0.99]"
              }`}
            >
              {added ? (
                <Check className="w-4 h-4 text-emerald-800" />
              ) : (
                <ShoppingBag className="w-4 h-4" />
              )}
              <span>{added ? "Added to Bag!" : !size ? "Select a Size" : "Add to Bag"}</span>
            </button>

            {/* Wishlist Toggle Button */}
            <button
              type="button"
              onClick={() => toggleWishlist(product)}
              className={`px-4.5 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-center min-h-[52px] ${
                isInWishlist(product.id)
                  ? "border-gold bg-gold/15 text-gold shadow-sm ring-1 ring-gold/40"
                  : "border-sand/60 text-charcoal hover:border-gold hover:text-gold bg-paper-light"
              }`}
              title={isInWishlist(product.id) ? "Saved in Wishlist" : "Save to Wishlist"}
              aria-label="Wishlist toggle"
            >
              <Heart
                className={`w-5 h-5 ${
                  isInWishlist(product.id) ? "fill-gold text-gold" : ""
                }`}
              />
            </button>
          </div>

          {/* Express Checkout / Buy Now */}
          <button
            onClick={handleBuyNow}
            disabled={!size}
            className={`w-full py-3.5 rounded-2xl font-sans text-xs uppercase font-bold tracking-wider flex items-center justify-center gap-2 transition-all border min-h-[48px] ${
              !size
                ? "bg-transparent text-charcoal-subtle/60 border-sand/30 cursor-not-allowed"
                : "bg-charcoal text-paper-light hover:bg-black cursor-pointer shadow-md hover:shadow-lg"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span>Instant Express Checkout</span>
          </button>

          {/* Trust Value Highlights Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-sans text-charcoal-subtle pt-3 border-t border-sand/30">
            <div className="flex items-center gap-1.5 p-2 rounded-xl bg-paper-light border border-sand/30">
              <Truck className="w-3.5 h-3.5 text-gold shrink-0" />
              <span className="leading-tight">Free AU $150+</span>
            </div>
            <div className="flex items-center gap-1.5 p-2 rounded-xl bg-paper-light border border-sand/30">
              <RefreshCw className="w-3.5 h-3.5 text-gold shrink-0" />
              <span className="leading-tight">30-Day Returns</span>
            </div>
            <div className="flex items-center gap-1.5 p-2 rounded-xl bg-paper-light border border-sand/30">
              <Leaf className="w-3.5 h-3.5 text-gold shrink-0" />
              <span className="leading-tight">100% Organic</span>
            </div>
            <div className="flex items-center gap-1.5 p-2 rounded-xl bg-paper-light border border-sand/30">
              <Gift className="w-3.5 h-3.5 text-gold shrink-0" />
              <span className="leading-tight">Silk Pouch</span>
            </div>
          </div>

          {/* IN-BUY-BOX EXPANDABLE ACCORDIONS (Modern E-Commerce Standard) */}
          <div className="pt-2 border-t border-sand/40 divide-y divide-sand/30 text-xs font-sans">
            {/* Accordion 1: Fit & Sizing */}
            <div>
              <button
                type="button"
                onClick={() => toggleAccordion("fit")}
                className="w-full py-3.5 flex items-center justify-between text-left text-charcoal hover:text-gold transition-colors font-medium cursor-pointer"
              >
                <span className="uppercase font-bold tracking-wider">
                  Fit & Silhouette Details
                </span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    activeAccordion === "fit" ? "rotate-180 text-gold" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {activeAccordion === "fit" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden pb-4 text-charcoal/80 space-y-2 leading-relaxed"
                  >
                    <p>
                      • Cut with gentle ease through the torso, designed to drape fluidly without clinging.
                    </p>
                    <p>
                      • Model is 176cm (5&apos;9&quot;) wearing AU 8 (S).
                    </p>
                    <p>
                      • True to Australian standard sizing. If between sizes, choose your usual size.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Accordion 2: Fabric & Craft */}
            <div>
              <button
                type="button"
                onClick={() => toggleAccordion("fabric")}
                className="w-full py-3.5 flex items-center justify-between text-left text-charcoal hover:text-gold transition-colors font-medium cursor-pointer"
              >
                <span className="uppercase font-bold tracking-wider">
                  Fabric & Artisan Origin
                </span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    activeAccordion === "fabric" ? "rotate-180 text-gold" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {activeAccordion === "fabric" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden pb-4 text-charcoal/80 space-y-2 leading-relaxed"
                  >
                    <p>
                      • <strong>Composition:</strong> {product.fabric} (100% natural organic fiber).
                    </p>
                    <p>
                      • <strong>Craftsmanship:</strong> Hand-loomed in small batches by artisan families in Gampaha, Sri Lanka.
                    </p>
                    <p>
                      • <strong>Dyes:</strong> Non-toxic, natural botanical pigment baths that age gracefully.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Accordion 3: Delivery & Returns */}
            <div>
              <button
                type="button"
                onClick={() => toggleAccordion("shipping")}
                className="w-full py-3.5 flex items-center justify-between text-left text-charcoal hover:text-gold transition-colors font-medium cursor-pointer"
              >
                <span className="uppercase font-bold tracking-wider">
                  Complimentary Shipping & 30-Day Returns
                </span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    activeAccordion === "shipping" ? "rotate-180 text-gold" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {activeAccordion === "shipping" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden pb-4 text-charcoal/80 space-y-2 leading-relaxed"
                  >
                    <p>
                      • <strong>Dispatch:</strong> Same-day dispatch from Melbourne on orders placed before 1 PM AEST.
                    </p>
                    <p>
                      • <strong>Shipping:</strong> Free Australia Post Express on orders over $150 AUD. Standard delivery 2–4 business days.
                    </p>
                    <p>
                      • <strong>Returns:</strong> Hassle-free 30-day return or exchange policy in original condition with tags intact.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* 4. SECTION 2: STORY BLOCK */}
      <StoryBlock product={product} />

      {/* 5. SECTION 3: FABRIC & CARE */}
      <FabricCareSection product={product} />

      {/* 6. SECTION 4: SIZE & FIT GUIDANCE */}
      <SizeFitGuidance product={product} />

      {/* 7. SECTION 5: REVIEWS + Q&A SUB-TAB */}
      <div id="reviews">
        <ReviewsSection product={product} />
      </div>

      {/* 8. SECTION 6: FEATURED COMMUNITY STORY CAROUSEL */}
      <CommunityStoryCard product={product} />

      {/* 9. SECTION 7: COMPLETE THE LOOK / CROSS-SELL */}
      <CompleteTheLook currentProduct={product} onAddToCart={handleAdd} />

      {/* 10. SECTION 8: RECENTLY VIEWED */}
      <RecentlyViewed currentProductId={product.id} />

      {/* 11. SECTION 9: STICKY MOBILE ADD-TO-CART BAR */}
      <StickyMobileBar
        product={product}
        selectedSize={size}
        onSelectSize={(s) => setSize(s)}
        onAddToCart={handleAdd}
        isAdded={added}
      />

      {/* FOOTER */}
      <Footer />

      {/* CART & WISHLIST DRAWERS */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        onOpenCart={() => {
          setIsWishlistOpen(false);
          setIsCartOpen(true);
        }}
      />

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
