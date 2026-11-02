"use client";

import dynamic from "next/dynamic";
import DeferredSection from "@/components/DeferredSection";
import { claimSplash } from "@/lib/splash-session";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { getCart, saveCart } from "@/lib/cart";
import { type Product } from "@/data/products";
import SplashScreen from "@/components/SplashScreen";
import Navbar from "@/components/Navbar";
import EditorialHero from "@/components/EditorialHero";
import HeritageTicker from "@/components/HeritageTicker";
const SpotlightSection = dynamic(() => import("@/components/home/SpotlightSection"));
import PublishedPromotions from "@/components/home/PublishedPromotions";
import BrowseSection from "@/components/home/BrowseSection";
const ShopTheLookSection = dynamic(() => import("@/components/home/ShopTheLookSection"));
const JourneySignup = dynamic(() => import("@/components/home/NewsletterSignup"));
import ProductModal from "@/components/ProductModal";
import CartDrawer, { CartItem } from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { ambientPlayer } from "@/lib/ambientSound";
import type { Destination } from "@/data/products";
import { useStorefront } from "@/components/StorefrontProvider";

export default function Home() {
  const { homepage } = useStorefront();
  const [showSplash, setShowSplash] = useState(false);
  const [isSplashLifting, setIsSplashLifting] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [selectedJourney, setSelectedJourney] = useState<Destination | "All">("All");
  const [showStickyMobile, setShowStickyMobile] = useState(false);

  useEffect(() => { if (claimSplash()) setShowSplash(true); }, []);

  // Track scroll position for the sticky mobile shopping controls
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking && typeof window !== "undefined") {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const h = window.innerHeight;
          const shouldSticky = scrollY > h * 0.7;
          setShowStickyMobile((prev) => (prev !== shouldSticky ? shouldSticky : prev));
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Hydrate the cart from localStorage
  const firstPersist = useRef(true);
  useEffect(() => {
    setCartItems(getCart());
  }, []);
  useEffect(() => {
    if (firstPersist.current) {
      firstPersist.current = false;
      return;
    }
    saveCart(cartItems);
  }, [cartItems]);

  // Audio Toggle
  const toggleAudio = () => {
    if (!ambientPlayer) return;
    const muted = ambientPlayer.toggle();
    setIsMuted(muted);
  };

  // Cart operations
  const handleAddToCart = (product: Product, size: string) => {
    if (!size) return;
    setCartItems((prev) => {
      const existing = prev.find(
        (item) => item.product.id === product.id && item.size === size
      );
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, size, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: string, size: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id === id && item.size === size) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (id: string, size: string) => {
    setCartItems((prev) =>
      prev.filter((item) => !(item.product.id === id && item.size === size))
    );
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <main className="relative min-h-screen bg-paper text-charcoal selection:bg-gold selection:text-white">
      {/* 1. SPLASH — garment buttons assemble the bindy. logo */}
      {showSplash && (
        <SplashScreen
          onLift={() => setIsSplashLifting(true)}
          onComplete={() => {
            setIsSplashLifting(true);
            setShowSplash(false);
          }}
        />
      )}

      {/* 2. NAVBAR */}
      <Navbar
        immersive
        isMuted={isMuted}
        toggleAudio={toggleAudio}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <EditorialHero
        isSplashActive={showSplash && !isSplashLifting}
        onExploreCollection={() => {
          document.getElementById("browse-collection")?.scrollIntoView({
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
          });
        }}
      />

      <div className="relative bg-paper">
        <HeritageTicker />

        {/* SECTION 5: BROWSE BY PIECE (grid, filter pills, micro-badges, load more) */}
        <BrowseSection
          onQuickView={(prod) => setQuickViewProduct(prod)}
          onAddToCart={handleAddToCart}
          selectedJourney={selectedJourney}
          onClearJourney={() => setSelectedJourney("All")}
        />

        {homepage?.spotlight.published && <DeferredSection><SpotlightSection
          onSelectProduct={(prod) => setQuickViewProduct(prod)}
          onAddToCart={handleAddToCart}
        /></DeferredSection>}

        {/* SECTION 4: SHOP THE LOOK / EDITORIAL STYLING HOTSPOTS (AOV Bundle Booster) */}
        {homepage?.shopTheLook.published && <DeferredSection><ShopTheLookSection
          onQuickView={(prod) => setQuickViewProduct(prod)}
          onAddToCart={handleAddToCart}
        /></DeferredSection>}

        <PublishedPromotions/>

        {/* BELOW-THE-FOLD SECTIONS (High-Performance content-visibility: auto) */}
        <div className="content-auto">
          {/* SECTION 6: LOVED ACROSS AUSTRALIA — VERIFIED REVIEWS THAT SELL */}

          {/* SECTION 7: VIP FIRST-ORDER PRIVILEGE (Instant 10% Off Activation) */}
          {homepage?.newsletter.published && <ScrollReveal>
            <DeferredSection><JourneySignup /></DeferredSection>
          </ScrollReveal>}

          {/* SECTION 11: FOOTER (full sitemap) */}
          <ScrollReveal>
            <Footer />
          </ScrollReveal>
        </div>
      </div>

      {/* PRODUCT QUICK VIEW MODAL */}
      <ProductModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* CART DRAWER */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />

      {/* STICKY MOBILE CONVERSION BAR (Section 7.8) */}
      <AnimatePresence>
        {showStickyMobile && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-0 inset-x-0 z-40 sm:hidden bg-white/95 backdrop-blur-md border-t border-[#DCC7AF]/80 p-3 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] flex items-center justify-between gap-3 shadow-[0_-8px_30px_rgba(0,0,0,0.1)]"
          >
            <div className="min-w-0">
              <p className="font-serif text-xs font-semibold text-[#1F1E1D] truncate">
                Serendipity Collection
              </p>
              <p className="text-[10px] font-mono text-[#78716A]">
                Ethical Handloom
              </p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById("browse-collection");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-4 py-2 rounded-full bg-[#B86B4B] hover:bg-[#9B5538] text-white font-mono text-xs uppercase tracking-wider font-semibold shadow-md active:scale-95 transition-all"
              >
                Shop Now
              </button>
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 rounded-full bg-[#FAF7F2] border border-[#DCC7AF] text-[#1F1E1D] shadow-sm hover:border-[#B86B4B] transition-colors"
                aria-label="Open Shopping Bag"
              >
                <ShoppingBag className="w-4 h-4 text-[#B86B4B]" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#1F1E1D] text-white text-[9px] font-mono flex items-center justify-center font-bold">
                    {totalCartCount}
                  </span>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}
