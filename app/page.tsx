"use client";

import React, { useState, useEffect, useRef } from "react";
import { getCart, saveCart } from "@/lib/cart";
import SplashScreen from "@/components/SplashScreen";
import Navbar from "@/components/Navbar";
import CinematicHero from "@/components/CinematicHero";
import HeritageTicker from "@/components/HeritageTicker";
import CollectionShowcase, { Product, PRODUCTS } from "@/components/CollectionShowcase";
import HeritageStories from "@/components/HeritageStories";
import ThreeWomenStory from "@/components/ThreeWomenStory";
import ArtisanCraft from "@/components/ArtisanCraft";
import ProductModal from "@/components/ProductModal";
import CartDrawer, { CartItem } from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import { ambientPlayer } from "@/lib/ambientSound";

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Hydrate the cart from localStorage (so items added on product pages appear here)
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
  const handleAddToCart = (product: Product, size: string = "AU 8 (S)") => {
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
    <main className="relative min-h-screen bg-[#FAF7F2] dark:bg-[#121110] text-[#1F1E1D] dark:text-[#FAF7F2] selection:bg-[#C5A059] selection:text-white">
      {/* 1. PLEATED SILK & UNRAVELLING THREAD SPLASH SCREEN */}
      {showSplash && (
        <SplashScreen
          onComplete={() => {
            setShowSplash(false);
          }}
        />
      )}

      {/* 2. LUXURY NAVBAR */}
      <Navbar
        isMuted={isMuted}
        toggleAudio={toggleAudio}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* 3. DUAL-REEL CINEMATIC HERO — fixed behind; the shop rises up and covers it */}
      <div className="fixed inset-0 h-screen z-0">
        <CinematicHero
          onExploreCollection={() => {
            const el = document.getElementById("collection");
            el?.scrollIntoView({ behavior: "smooth" });
          }}
          onSelectStory={(storyId) => {
            const found = PRODUCTS.find((p) => p.id.includes(storyId));
            if (found) setQuickViewProduct(found);
          }}
        />
      </div>

      {/* spacer: reserves one screen so the film plays first, then the shop rises over it */}
      <div className="h-screen" aria-hidden />

      {/* Everything below rises up over the fixed hero */}
      <div className="relative z-10 bg-[#FAF7F2] dark:bg-[#121110] rounded-t-[2.5rem] -mt-12 shadow-[0_-34px_80px_rgba(31,30,29,0.3)]">
        {/* grab handle seam that reads as the shop panel rising over the film */}
        <div className="flex justify-center pt-3.5 pb-1.5">
          <span className="h-1.5 w-16 rounded-full bg-[#DCC7AF]/70" />
        </div>
        {/* 4. HERITAGE VALUES TICKER */}
        <HeritageTicker />

      {/* 5. SERENDIPITY COLLECTION 01 SHOWCASE */}
      <CollectionShowcase
        onAddToCart={(prod) => handleAddToCart(prod)}
        onQuickView={(prod) => setQuickViewProduct(prod)}
      />

      {/* 6. HERITAGE CHAPTER STORIES (LOTUS, RED MOSQUE, SIGIRIYA, TEA HILLS, MANNAR) */}
      <HeritageStories />

      {/* 7. THREE WOMEN FOUNDER'S JOURNEY */}
      <ThreeWomenStory />

      {/* 8. ARTISAN CRAFT & SUSTAINABLE FABRICS */}
      <ArtisanCraft />

        {/* 9. LUXURY EDITORIAL FOOTER */}
        <Footer />
      </div>

      {/* 10. PRODUCT QUICK VIEW MODAL */}
      <ProductModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={(prod, size) => handleAddToCart(prod, size)}
      />

      {/* 11. SLIDE-OUT CART DRAWER */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />
    </main>
  );
}
