"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { ambientPlayer } from "@/lib/ambientSound";
import ReturnPortalCard from "@/components/returns/ReturnPortalCard";

function PortalContent() {
  const searchParams = useSearchParams();
  const initialOrder = searchParams.get("order") || "";

  return (
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

      <ReturnPortalCard initialOrderNumber={initialOrder} isStandalone={true} />
    </div>
  );
}

export default function ReturnPortalPage() {
  const [isMuted, setIsMuted] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const toggleAudio = () => {
    if (!ambientPlayer) return;
    const muted = ambientPlayer.toggle();
    setIsMuted(muted);
  };

  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#1F1E1D] flex flex-col justify-between">
      <Navbar
        isMuted={isMuted}
        toggleAudio={toggleAudio}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <Suspense fallback={<div className="pt-32 pb-20 text-center font-mono text-xs text-[#78716A]">Loading Returns Portal...</div>}>
        <PortalContent />
      </Suspense>

      <Footer />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </main>
  );
}
