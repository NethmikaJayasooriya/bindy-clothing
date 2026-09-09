"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Search,
  Heart,
  Volume2,
  VolumeX,
  Menu,
  X,
  ChevronDown,
  User,
  Sparkles,
  ArrowRight,
  Truck,
  RotateCcw,
  Globe,
  Package,
} from "lucide-react";
import SearchModal from "@/components/SearchModal";
import WishlistDrawer from "@/components/WishlistDrawer";
import { getAccount, subscribeAccount, type UserAccount } from "@/lib/account";
import { getWishlistCount, subscribeWishlist } from "@/lib/wishlist";

interface NavbarProps {
  isMuted: boolean;
  toggleAudio: () => void;
  cartCount?: number;
  onOpenCart?: () => void;
}

export default function Navbar({
  isMuted,
  toggleAudio,
  cartCount = 0,
  onOpenCart,
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [account, setAccount] = useState<UserAccount | null>(null);
  const [currency, setCurrency] = useState("AUD $");
  const [isCurrencyDropdown, setIsCurrencyDropdown] = useState(false);
  const [isCollectionHovered, setIsCollectionHovered] = useState(false);
  const [mobileExpandedCat, setMobileExpandedCat] = useState<string | null>(null);

  useEffect(() => {
    setAccount(getAccount());
    setWishlistCount(getWishlistCount());
    const unsub = subscribeAccount(() => {
      setAccount(getAccount());
    });
    const unsubWish = subscribeWishlist(() => {
      setWishlistCount(getWishlistCount());
    });
    return () => {
      unsub();
      unsubWish();
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const currencies = ["AUD $", "USD $", "GBP £", "LKR Rs"];

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const OCCASIONS = [
    { name: "Beach & Coast", href: "/collection?occasion=Beach%20%26%20Coast" },
    { name: "Evening & Party", href: "/collection?occasion=Evening%20%26%20Party" },
    { name: "Everyday Calm", href: "/collection?occasion=Everyday%20Calm" },
    { name: "Garden & High Tea", href: "/collection?occasion=Garden%20%26%20High%20Tea" },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 transition-all duration-300 pointer-events-none">
        
        {/* 1. TOP UTILITY STRIP (Wide, refined announcement & secondary utilities) */}
        <div
          className={`pointer-events-auto transition-all duration-300 overflow-hidden ${
            isScrolled
              ? "max-h-0 opacity-0 -translate-y-2"
              : "max-h-11 opacity-100 bg-[#1F1E1D]/90 backdrop-blur-md border-b border-white/10 text-white/85 py-1.5"
          }`}
        >
          <div className="max-w-[1540px] w-[96vw] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-[11px] font-mono">
            {/* Left: Free delivery & return assurance */}
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-[#C5A059]">
                <Truck className="w-3.5 h-3.5" />
                <span className="font-semibold uppercase tracking-wider">Free AU Courier $150+</span>
              </span>
              <span className="text-white/30 hidden sm:inline">•</span>
              <span className="text-white/70 hidden sm:inline">30-Day Easy Australian Returns</span>
            </div>

            {/* Right: Premium utilities with standard iconography */}
            <div className="flex items-center gap-4 text-white/80">
              {/* Currency Selector with Globe Icon */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsCurrencyDropdown(!isCurrencyDropdown)}
                  className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
                  title="Change Currency"
                >
                  <Globe className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>{currency}</span>
                  <ChevronDown className="w-3 h-3 opacity-60" />
                </button>

                {isCurrencyDropdown && (
                  <div className="absolute right-0 mt-1.5 w-28 bg-[#FFFDF9] border border-[#DCC7AF]/50 rounded-xl shadow-xl py-1 z-50 text-[#1F1E1D]">
                    {currencies.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => {
                          setCurrency(c);
                          setIsCurrencyDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-xs font-sans tracking-wider hover:bg-[#C5A059]/15 hover:text-[#C5A059] ${
                          currency === c ? "text-[#C5A059] font-medium" : "text-[#1F1E1D]"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Sound Toggle */}
              <button
                type="button"
                onClick={toggleAudio}
                className="hidden sm:flex items-center gap-1.5 hover:text-[#C5A059] transition-colors cursor-pointer"
                title={isMuted ? "Unmute Ambient Sound" : "Mute Ambient Sound"}
              >
                {isMuted ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-white/50" />
                    <span>Sound Off</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span className="text-[#C5A059]">Sound On</span>
                  </>
                )}
              </button>

              {/* Saved Pieces / Wishlist */}
              <button
                type="button"
                onClick={() => setIsWishlistOpen(true)}
                className="hidden sm:flex items-center gap-1.5 hover:text-[#C5A059] transition-colors cursor-pointer"
                title="View Saved Pieces"
              >
                <Heart className={`w-3.5 h-3.5 ${wishlistCount > 0 ? "fill-[#C5A059] text-[#C5A059]" : ""}`} />
                <span>Saved ({wishlistCount})</span>
              </button>

              {/* Account / Login */}
              <Link
                href="/account"
                className="hover:text-white flex items-center gap-1.5 transition-colors"
                title="Account Login"
              >
                <User className="w-3.5 h-3.5" />
                <span>{account ? account.name.split(" ")[0] : "Account"}</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 2. FLOATING PILL CAPSULE (Wide luxury span + CRIB.lk morphing states + premium standard icons) */}
        <div className="max-w-[1540px] w-[96vw] mx-auto px-2 sm:px-4 lg:px-6 mt-2.5 sm:mt-3">
          <nav
            className={`pointer-events-auto rounded-full transition-all duration-300 flex items-center justify-between border ${
              isScrolled
                ? "bg-[#1F1E1D]/95 backdrop-blur-xl border-white/15 text-white py-2 px-5 sm:px-8 shadow-[0_16px_45px_rgba(0,0,0,0.25)]"
                : "bg-white/95 backdrop-blur-xl border-[#DCC7AF]/70 text-[#1F1E1D] py-2.5 sm:py-3 px-5 sm:px-8 shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
            }`}
          >
            {/* ZONE 1: BRAND IDENTITY (Generous left margin & luxury typography) */}
            <div className="flex-shrink-0 mr-6 sm:mr-8 xl:mr-10">
              <Link href="/" className="inline-block text-left group">
                <span
                  className={`font-display text-xl sm:text-2xl lg:text-[26px] tracking-[0.2em] font-normal transition-colors ${
                    isScrolled
                      ? "text-white group-hover:text-[#C5A059]"
                      : "text-[#1F1E1D] group-hover:text-[#B86B4B]"
                  }`}
                >
                  BINDY.
                </span>
                <span className="block text-[7px] sm:text-[8px] uppercase tracking-[0.45em] text-[#C5A059] font-sans -mt-1 font-semibold">
                  Clothing
                </span>
              </Link>
            </div>

            {/* ZONE 2: PRIMARY NAVIGATION (Centered with comfortable breathing room) */}
            <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              {/* Collection Dropdown */}
              <div
                className="relative py-2"
                onMouseEnter={() => setIsCollectionHovered(true)}
                onMouseLeave={() => setIsCollectionHovered(false)}
              >
                <Link
                  href="/collection"
                  className={`text-xs uppercase tracking-[0.22em] font-sans font-medium transition-colors flex items-center gap-1.5 ${
                    isScrolled
                      ? "text-white/90 hover:text-[#C5A059]"
                      : "text-[#1F1E1D] hover:text-[#B86B4B]"
                  }`}
                >
                  <span>Collection</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isCollectionHovered ? "rotate-180 text-[#C5A059]" : "opacity-60"}`} />
                </Link>

                {/* Desktop Mega-Menu Dropdown */}
                <AnimatePresence>
                  {isCollectionHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.2 }}
                      className={`absolute left-0 top-full mt-2 w-[720px] rounded-3xl p-7 shadow-2xl z-50 border text-left ${
                        isScrolled
                          ? "bg-[#1F1E1D] border-white/15 text-white shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                          : "bg-[#FAF7F2] border-[#DCC7AF] text-[#1F1E1D]"
                      }`}
                    >
                      <div className="grid grid-cols-4 gap-6 text-left">
                        {/* Column 1: New Arrivals & Featured */}
                        <div className={`space-y-4 border-r pr-4 ${isScrolled ? "border-white/10" : "border-[#DCC7AF]/40"}`}>
                          <div>
                            <Link
                              href="/collection?filter=new"
                              className="text-xs font-mono uppercase tracking-widest text-[#C5A059] font-semibold hover:underline block mb-1"
                            >
                              ✦ New Arrivals
                            </Link>
                            <p className={`text-[11px] leading-relaxed ${isScrolled ? "text-white/60" : "text-[#78716A]"}`}>
                              Latest drop from our coastal Sri Lankan ateliers.
                            </p>
                          </div>

                          <div className={`pt-2 border-t ${isScrolled ? "border-white/10" : "border-[#DCC7AF]/30"}`}>
                            <Link
                              href="/collection?parent=Resort%20Wear"
                              className={`text-xs font-mono uppercase tracking-widest font-semibold block mb-1 ${
                                isScrolled ? "text-white hover:text-[#C5A059]" : "text-[#1F1E1D] hover:text-[#B86B4B]"
                              }`}
                            >
                              Resort Wear
                            </Link>
                            <p className={`text-[11px] leading-relaxed ${isScrolled ? "text-white/60" : "text-[#78716A]"}`}>
                              Airy linens &amp; lightweight voile sets.
                            </p>
                          </div>
                        </div>

                        {/* Column 2: Tops & Bottoms */}
                        <div className="space-y-4">
                          <div>
                            <Link
                              href="/collection?parent=Tops"
                              className={`text-xs font-mono uppercase tracking-widest font-semibold block mb-1.5 ${
                                isScrolled ? "text-white hover:text-[#C5A059]" : "text-[#1F1E1D] hover:text-[#B86B4B]"
                              }`}
                            >
                              Tops
                            </Link>
                            <ul className={`space-y-1.5 text-xs ${isScrolled ? "text-white/70" : "text-[#78716A]"}`}>
                              <li>
                                <Link
                                  href="/collection?parent=Tops&sub=Blouses%20%26%20Shirts"
                                  className={`transition-colors ${isScrolled ? "hover:text-white" : "hover:text-[#1F1E1D]"}`}
                                >
                                  Blouses &amp; Shirts
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href="/collection?parent=Tops&sub=Crop%20Tops"
                                  className={`transition-colors ${isScrolled ? "hover:text-white" : "hover:text-[#1F1E1D]"}`}
                                >
                                  Crop Tops
                                </Link>
                              </li>
                            </ul>
                          </div>

                          <div className={`pt-2 border-t ${isScrolled ? "border-white/10" : "border-[#DCC7AF]/30"}`}>
                            <Link
                              href="/collection?parent=Bottoms"
                              className={`text-xs font-mono uppercase tracking-widest font-semibold block mb-1.5 ${
                                isScrolled ? "text-white hover:text-[#C5A059]" : "text-[#1F1E1D] hover:text-[#B86B4B]"
                              }`}
                            >
                              Bottoms
                            </Link>
                            <ul className={`space-y-1.5 text-xs ${isScrolled ? "text-white/70" : "text-[#78716A]"}`}>
                              <li>
                                <Link
                                  href="/collection?parent=Bottoms&sub=Pants"
                                  className={`transition-colors ${isScrolled ? "hover:text-white" : "hover:text-[#1F1E1D]"}`}
                                >
                                  Pants
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href="/collection?parent=Bottoms&sub=Skirts"
                                  className={`transition-colors ${isScrolled ? "hover:text-white" : "hover:text-[#1F1E1D]"}`}
                                >
                                  Skirts
                                </Link>
                              </li>
                            </ul>
                          </div>
                        </div>

                        {/* Column 3: Dresses */}
                        <div className="space-y-1.5">
                          <Link
                            href="/collection?parent=Dresses"
                            className={`text-xs font-mono uppercase tracking-widest font-semibold block mb-1.5 ${
                              isScrolled ? "text-white hover:text-[#C5A059]" : "text-[#1F1E1D] hover:text-[#B86B4B]"
                            }`}
                          >
                            Dresses
                          </Link>
                          <ul className={`space-y-1.5 text-xs ${isScrolled ? "text-white/70" : "text-[#78716A]"}`}>
                            <li>
                              <Link
                                href="/collection?parent=Dresses&sub=Maxi"
                                className={`transition-colors ${isScrolled ? "hover:text-white" : "hover:text-[#1F1E1D]"}`}
                              >
                                Maxi Dresses
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/collection?parent=Dresses&sub=Mini"
                                className={`transition-colors ${isScrolled ? "hover:text-white" : "hover:text-[#1F1E1D]"}`}
                              >
                                Mini &amp; Midi
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/collection?parent=Dresses&sub=Linen"
                                className={`transition-colors ${isScrolled ? "hover:text-white" : "hover:text-[#1F1E1D]"}`}
                              >
                                Linen &amp; Voile
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/collection?parent=Dresses&sub=Formal"
                                className={`transition-colors ${isScrolled ? "hover:text-white" : "hover:text-[#1F1E1D]"}`}
                              >
                                Formal &amp; Party
                              </Link>
                            </li>
                          </ul>
                        </div>

                        {/* Column 4: Occasion Tags */}
                        <div className={`space-y-2 border-l pl-4 ${isScrolled ? "border-white/10" : "border-[#DCC7AF]/40"}`}>
                          <p className={`text-xs font-mono uppercase tracking-widest font-semibold mb-1.5 ${isScrolled ? "text-[#C5A059]" : "text-[#1F1E1D]"}`}>
                            Occasion
                          </p>
                          <ul className={`space-y-2 text-xs ${isScrolled ? "text-white/70" : "text-[#78716A]"}`}>
                            {OCCASIONS.map((occ) => (
                              <li key={occ.name}>
                                <Link
                                  href={occ.href}
                                  className={`transition-colors block ${isScrolled ? "hover:text-white" : "hover:text-[#B86B4B]"}`}
                                >
                                  {occ.name}
                                </Link>
                              </li>
                            ))}
                          </ul>

                          <div className={`pt-3 border-t ${isScrolled ? "border-white/10" : "border-[#DCC7AF]/30"}`}>
                            <Link
                              href="/collection"
                              className="text-[11px] font-mono uppercase tracking-wider text-[#C5A059] font-semibold hover:underline flex items-center gap-1"
                            >
                              <span>View All Pieces</span>
                              <ArrowRight className="w-3 h-3" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link
                href="/collection?filter=new"
                className={`text-xs uppercase tracking-[0.22em] font-sans font-medium transition-colors ${
                  isScrolled ? "text-white/90 hover:text-[#C5A059]" : "text-[#1F1E1D] hover:text-[#B86B4B]"
                }`}
              >
                New Arrivals
              </Link>
              <Link
                href="/stories"
                className={`text-xs uppercase tracking-[0.22em] font-sans font-medium transition-colors ${
                  isScrolled ? "text-white/90 hover:text-[#C5A059]" : "text-[#1F1E1D] hover:text-[#B86B4B]"
                }`}
              >
                Stories
              </Link>
              <Link
                href="/about"
                className={`text-xs uppercase tracking-[0.22em] font-sans font-medium transition-colors ${
                  isScrolled ? "text-white/90 hover:text-[#C5A059]" : "text-[#1F1E1D] hover:text-[#B86B4B]"
                }`}
              >
                Our Story
              </Link>
              <Link
                href="/craft"
                className={`text-xs uppercase tracking-[0.22em] font-sans font-medium transition-colors ${
                  isScrolled ? "text-white/90 hover:text-[#C5A059]" : "text-[#1F1E1D] hover:text-[#B86B4B]"
                }`}
              >
                Craft
              </Link>
              <Link
                href="/journal"
                className={`text-xs uppercase tracking-[0.22em] font-sans font-medium transition-colors ${
                  isScrolled ? "text-white/90 hover:text-[#C5A059]" : "text-[#1F1E1D] hover:text-[#B86B4B]"
                }`}
              >
                Journal
              </Link>
            </div>

            {/* ZONE 3: PREMIUM STANDARD ACTIONS & CTAS (CRIB.lk Pattern elevated) */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              
              {/* Rounded Search Pill Input (Clean search bar with standard magnifying glass) */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className={`hidden md:flex items-center justify-between rounded-full px-3.5 py-1.5 transition-all text-xs cursor-pointer border ${
                  isScrolled
                    ? "bg-white/10 hover:bg-white/15 border-white/20 text-white/80 w-36 xl:w-44"
                    : "bg-[#FAF7F2] hover:bg-white border-[#DCC7AF] text-[#78716A] w-36 xl:w-44"
                }`}
                title="Search garments (Cmd+K)"
                aria-label="Search garments"
              >
                <span className="text-[11px] truncate font-sans">Search collection...</span>
                <Search className={`w-3.5 h-3.5 shrink-0 ${isScrolled ? "text-white/70" : "text-[#78716A]"}`} />
              </button>

              {/* Mobile Search Icon */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className={`md:hidden p-2 rounded-full transition-colors cursor-pointer ${
                  isScrolled ? "text-white hover:bg-white/10" : "text-[#1F1E1D] hover:bg-[#FAF7F2]"
                }`}
                aria-label="Search collection"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Pill Button 1: Track Order (Secondary action with standard package icon) */}
              <Link
                href="/returns/start"
                className={`hidden sm:inline-flex items-center gap-1.5 px-3.5 xl:px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider font-semibold transition-all border ${
                  isScrolled
                    ? "bg-white/15 hover:bg-white/25 border-white/25 text-white shadow-sm"
                    : "bg-[#FAF7F2] hover:bg-white border-[#DCC7AF] text-[#1F1E1D] hover:border-[#1F1E1D]"
                }`}
                title="Track order or returns"
              >
                <RotateCcw className={`w-3 h-3 ${isScrolled ? "text-[#C5A059]" : "text-[#C5A059]"}`} />
                <span>Track Order</span>
              </Link>

              {/* Pill Button 2: Shop Now (Primary CTA with standard sparkles icon) */}
              <Link
                href="/collection"
                className={`hidden sm:inline-flex items-center gap-1.5 px-4 xl:px-5 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider font-semibold transition-all shadow-sm ${
                  isScrolled
                    ? "bg-white hover:bg-[#C5A059] text-[#1F1E1D] hover:text-white"
                    : "bg-[#1F1E1D] hover:bg-[#B86B4B] text-white"
                }`}
                title="Shop the Serendipity collection"
              >
                <Sparkles className="w-3 h-3 text-[#C5A059]" />
                <span>Shop Now</span>
              </Link>

              {/* Shopping Bag Pill (Prominent, intuitive, always accessible) */}
              <button
                type="button"
                onClick={onOpenCart}
                className={`flex items-center gap-2 py-1.5 px-3.5 rounded-full transition-all cursor-pointer shadow-sm text-xs font-mono font-medium ${
                  isScrolled
                    ? "bg-[#B86B4B] hover:bg-[#9E4D30] text-white"
                    : "bg-[#1F1E1D] hover:bg-[#B86B4B] text-white"
                }`}
                aria-label={`Shopping bag with ${cartCount} items`}
                title="View Shopping Bag"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-[#C5A059]" />
                <span className="text-[11px] font-bold tracking-tight">Bag ({cartCount})</span>
              </button>

              {/* Mobile Hamburger Menu Toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className={`lg:hidden p-2 rounded-full transition-colors cursor-pointer ml-0.5 ${
                  isScrolled ? "text-white hover:bg-white/10" : "text-[#1F1E1D] hover:bg-[#FAF7F2]"
                }`}
                aria-label="Open mobile menu"
              >
                <Menu className="w-5 h-5" />
              </button>

            </div>

          </nav>
        </div>

      </header>

      {/* SEARCH MODAL */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* WISHLIST DRAWER */}
      <WishlistDrawer isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />

      {/* MOBILE FULL-SCREEN NAVIGATION DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 z-50 bg-[#FAF7F2] flex flex-col p-6 overflow-y-auto"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between pb-5 border-b border-[#DCC7AF]/60">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-block text-left"
              >
                <span className="font-display text-2xl tracking-[0.2em] text-[#1F1E1D]">
                  BINDY.
                </span>
                <span className="block text-[8px] uppercase tracking-[0.45em] text-[#C5A059] font-sans -mt-1 font-semibold">
                  Clothing
                </span>
              </Link>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleAudio}
                  className="p-2 rounded-full border border-[#DCC7AF] text-[#1F1E1D]"
                  title="Toggle Sound"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#C5A059]" />}
                </button>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-full bg-[#1F1E1D] text-white"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="py-4 border-b border-[#DCC7AF]/40 flex gap-3">
              <Link
                href="/collection"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 py-2.5 px-4 rounded-full bg-[#B86B4B] text-white text-center font-mono text-xs uppercase tracking-wider font-semibold shadow-sm flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Shop Collection</span>
              </Link>
              <Link
                href="/returns/start"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 py-2.5 px-4 rounded-full border border-[#DCC7AF] bg-white text-[#1F1E1D] text-center font-mono text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Track Order</span>
              </Link>
            </div>

            {/* Primary Nav Links */}
            <div className="py-6 space-y-4 text-left flex-1">
              
              {/* Collection Accordion */}
              <div>
                <button
                  type="button"
                  onClick={() =>
                    setMobileExpandedCat(
                      mobileExpandedCat === "collection" ? null : "collection"
                    )
                  }
                  className="w-full flex items-center justify-between text-lg font-serif text-[#1F1E1D] py-1.5"
                >
                  <span>Collection</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      mobileExpandedCat === "collection" ? "rotate-180 text-[#B86B4B]" : ""
                    }`}
                  />
                </button>

                {mobileExpandedCat === "collection" && (
                  <div className="pl-4 py-2 space-y-2.5 text-sm text-[#78716A] border-l-2 border-[#DCC7AF]/60 mt-1">
                    <Link
                      href="/collection?filter=new"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-[#C5A059] font-mono text-xs uppercase tracking-wider font-semibold"
                    >
                      ✦ New Arrivals
                    </Link>
                    <Link
                      href="/collection?parent=Dresses"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block hover:text-[#1F1E1D]"
                    >
                      Dresses (Maxi, Mini, Linen)
                    </Link>
                    <Link
                      href="/collection?parent=Tops"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block hover:text-[#1F1E1D]"
                    >
                      Tops &amp; Blouses
                    </Link>
                    <Link
                      href="/collection?parent=Bottoms"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block hover:text-[#1F1E1D]"
                    >
                      Bottoms (Pants, Skirts)
                    </Link>
                    <Link
                      href="/collection?parent=Resort%20Wear"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block hover:text-[#1F1E1D]"
                    >
                      Resort Wear
                    </Link>
                    <Link
                      href="/collection"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-[#B86B4B] font-mono text-xs uppercase tracking-wider font-semibold pt-1"
                    >
                      View All Pieces &rarr;
                    </Link>
                  </div>
                )}
              </div>

              <Link
                href="/stories"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-lg font-serif text-[#1F1E1D] py-1.5 border-t border-[#DCC7AF]/30"
              >
                Heritage Stories
              </Link>

              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-lg font-serif text-[#1F1E1D] py-1.5 border-t border-[#DCC7AF]/30"
              >
                Our Story (About BINDY)
              </Link>

              <Link
                href="/craft"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-lg font-serif text-[#1F1E1D] py-1.5 border-t border-[#DCC7AF]/30"
              >
                Artisan Craft &amp; Sustainability
              </Link>

              <Link
                href="/journal"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-lg font-serif text-[#1F1E1D] py-1.5 border-t border-[#DCC7AF]/30"
              >
                Field Notes &amp; Journal
              </Link>

              <Link
                href="/size-guide"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-lg font-serif text-[#1F1E1D] py-1.5 border-t border-[#DCC7AF]/30"
              >
                Size Guide &amp; Fit Measurements
              </Link>

              <Link
                href="/returns"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-lg font-serif text-[#1F1E1D] py-1.5 border-t border-[#DCC7AF]/30"
              >
                Returns &amp; Exchanges Policy
              </Link>

              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-lg font-serif text-[#1F1E1D] py-1.5 border-t border-[#DCC7AF]/30"
              >
                Contact &amp; Concierge
              </Link>

            </div>

            {/* Bottom Account Strip */}
            <div className="pt-4 border-t border-[#DCC7AF]/50 flex items-center justify-between text-xs font-mono text-[#78716A]">
              <span>Currency: {currency}</span>
              <Link
                href="/account"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[#1F1E1D] font-semibold"
              >
                {account ? account.name : "Sign In / Register"}
              </Link>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
