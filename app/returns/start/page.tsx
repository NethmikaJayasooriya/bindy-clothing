"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer, { CartItem } from "@/components/CartDrawer";
import { getCart } from "@/lib/cart";
import { ambientPlayer } from "@/lib/ambientSound";
import ReturnPortalCard from "@/components/returns/ReturnPortalCard";

export default function ReturnPortalPage() {
  const [isMuted, setIsMuted] = useState(true);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    setCartItems(getCart());
  }, []);

  const toggleAudio = () => {
    if (!ambientPlayer) return;
    const muted = ambientPlayer.toggle();
    setIsMuted(muted);
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#1F1E1D] flex flex-col justify-between">
      {/* NAVBAR */}
      <Navbar
        isMuted={isMuted}
        toggleAudio={toggleAudio}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto w-full flex-1 flex flex-col justify-center">
        <div className="mb-6">
          <Link
            href="/returns"
            className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-[#78716A] hover:text-[#C5A059] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Return Policy</span>
          </Link>
        </div>

        {/* STANDALONE PORTAL CARD MATCHING REFERENCE SCREENSHOT */}
        <ReturnPortalCard isStandalone={true} />
      </div>

      <Footer />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={() => {}}
        onRemoveItem={() => {}}
      />
    </main>
  );
}
