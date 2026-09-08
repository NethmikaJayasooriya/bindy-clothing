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
  ChevronRight,
  User,
  Sparkles,
  ArrowRight,
  Truck,
  RotateCcw,
  Compass,
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
      if (window.scrollY > 30) {
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

  // 5.1 CLIENT TAXONOMY NAVIGATION HIERARCHY
  const TAXONOMY_CATEGORIES = [
    {
      name: "Tops",
      href: "/collection?parent=Tops",
      subcategories: [
        { name: "Blouses & Shirts", href: "/collection?parent=Tops&sub=Blouses%20%26%20Shirts" },
        { name: "Crop Tops", href: "/collection?parent=Tops&sub=Crop%20Tops" },
      ],
    },
    {
      name: "Bottoms",
      href: "/collection?parent=Bottoms",
      subcategories: [
        { name: "Pants", href: "/collection?parent=Bottoms&sub=Pants" },
        { name: "Skirts", href: "/collection?parent=Bottoms&sub=Skirts" },
        { name: "Shorts", href: "/collection?parent=Bottoms&sub=Shorts" },
      ],
    },
    {
      name: "Dresses",
      href: "/collection?parent=Dresses",
      subcategories: [
        { name: "Mini", href: "/collection?parent=Dresses&sub=Mini" },
        { name: "Maxi", href: "/collection?parent=Dresses&sub=Maxi" },
        { name: "Linen", href: "/collection?parent=Dresses&sub=Linen" },
        { name: "Floral", href: "/collection?parent=Dresses&sub=Floral" },
        { name: "Casual", href: "/collection?parent=Dresses&sub=Casual" },
        { name: "Formal", href: "/collection?parent=Dresses&sub=Formal" },
      ],
    },
    {
      name: "Resort Wear",
      href: "/collection?parent=Resort%20Wear",
      subcategories: [],
    },
  ];

  const OCCASIONS = [
    { name: "Beach & Coast", href: "/collection?occasion=Beach%20%26%20Coast" },
    { name: "Evening & Party", href: "/collection?occasion=Evening%20%26%20Party" },
    { name: "Everyday Calm", href: "/collection?occasion=Everyday%20Calm" },
    { name: "Garden & High Tea", href: "/collection?occasion=Garden%20%26%20High%20Tea" },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 transition-all duration-300">
        
        {/* 1. SLIM TOP UTILITY BAR (CRIB.lk Pattern: secondary info row that tucks away on scroll) */}
        <div
          className={`transition-all duration-300 overflow-hidden ${
            isScrolled
              ? "max-h-0 opacity-0 -translate-y-2 pointer-events-none"
              : "max-h-12 opacity-100 bg-[#1F1E1D]/90 backdrop-blur-md text-white border-b border-white/10 py-1.5"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-[11px] font-mono">
            {/* Left: Shipping & Return Threshold */}
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-[#C5A059]">
                <Truck className="w-3.5 h-3.5" />
                <span className="font-semibold uppercase tracking-wider">Free AU Shipping $150+</span>
              </span>
              <span className="text-white/40 hidden sm:inline">•</span>
              <span className="text-white/70 hidden sm:inline">30-Day Australian Returns</span>
            </div>

            {/* Right: Currency + Sound + Account + Saved */}
            <div className="flex items-center gap-4 text-white/80">
              {/* Currency Selector */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsCurrencyDropdown(!isCurrencyDropdown)}
                  className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
                >
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

              {/* Ambient Audio Toggle */}
              <button
                type="button"
                onClick={toggleAudio}
                className="hidden sm:flex items-center gap-1 hover:text-[#C5A059] transition-colors cursor-pointer"
                title={isMuted ? "Unmute Ambient Sound" : "Mute Ambient Sound"}
              >
                {isMuted ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-white/60" />
                    <span>Sound Off</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span className="text-[#C5A059]">Sound On</span>
                  </>
                )}
              </button>

              {/* Wishlist Link */}
              <button
                type="button"
                onClick={() => setIsWishlistOpen(true)}
                className="hidden sm:flex items-center gap-1 hover:text-[#C5A059] transition-colors cursor-pointer"
              >
                <Heart className={`w-3.5 h-3.5 ${wishlistCount > 0 ? "fill-[#C5A059] text-[#C5A059]" : ""}`} />
                <span>Saved ({wishlistCount})</span>
              </button>

              {/* Account Link */}
              <Link
                href="/account"
                className="hover:text-white flex items-center gap-1 transition-colors"
              >
                <User className="w-3.5 h-3.5" />
                <span>{account ? account.name.split(" ")[0] : "Sign In"}</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 2. FLOATING PILL-SHAPED CAPSULE NAVBAR (Section 7.9) */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mt-2 sm:mt-3">
          <nav
            className={`rounded-full transition-all duration-300 flex items-center justify-between border ${
              isScrolled
                ? "bg-[#FAF7F2]/95 backdrop-blur-xl border-[#DCC7AF] py-2 px-4 sm:px-6 shadow-[0_14px_40px_rgba(0,0,0,0.12)]"
                : "bg-white/95 backdrop-blur-xl border-[#DCC7AF]/80 py-2.5 px-4 sm:px-7 shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
            }`}
          >
            {/* LEFT: Logo Identity */}
            <div className="flex-shrink-0">
              <Link href="/" className="inline-block text-left group">
                <span className="font-display text-xl sm:text-2xl tracking-[0.2em] font-normal text-[#1F1E1D] group-hover:text-[#B86B4B] transition-colors">
                  BINDY.
                </span>
                <span className="block text-[7px] sm:text-[8px] uppercase tracking-[0.45em] text-[#C5A059] font-sans -mt-1 font-semibold">
                  Clothing
                </span>
              </Link>
            </div>

            {/* CENTER: Primary Nav Links with Mega-Menu (Desktop) */}
            <div className="hidden lg:flex items-center space-x-5 xl:space-x-7">
              {/* Collection with Mega-Menu */}
              <div
                className="relative py-2"
                onMouseEnter={() => setIsCollectionHovered(true)}
                onMouseLeave={() => setIsCollectionHovered(false)}
              >
                <Link
                  href="/collection"
                  className="text-xs uppercase tracking-[0.22em] font-sans font-medium text-[#1F1E1D] hover:text-[#B86B4B] transition-colors flex items-center gap-1"
                >
                  <span>Collection</span>
                  <ChevronDown className="w-3 h-3 opacity-60" />
                </Link>

                {/* 5.1 DESKTOP MEGA-MENU DROPDOWN */}
                <AnimatePresence>
                  {isCollectionHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[720px] bg-[#FAF7F2] border border-[#DCC7AF] rounded-3xl p-7 shadow-2xl z-50 text-[#1F1E1D]"
                    >
                      <div className="grid grid-cols-4 gap-6 text-left">
                        {/* Column 1: New Arrivals & Featured */}
                        <div className="space-y-4 border-r border-[#DCC7AF]/40 pr-4">
                          <div>
                            <Link
                              href="/collection?filter=new"
                              className="text-xs font-mono uppercase tracking-widest text-[#C5A059] font-semibold hover:underline block mb-1"
                            >
                              ✦ New Arrivals
                            </Link>
                            <p className="text-[11px] text-[#78716A] leading-relaxed">
                              Latest drop from our coastal Sri Lankan ateliers.
                            </p>
                          </div>

                          <div className="pt-2">
                            <Link
                              href="/collection?parent=Resort%20Wear"
                              className="text-xs font-mono uppercase tracking-widest text-[#1F1E1D] font-semibold hover:text-[#C5A059] block mb-1"
                            >
                              Resort Wear
                            </Link>
                            <p className="text-[11px] text-[#78716A] leading-relaxed">
                              Airy linens &amp; lightweight voile sets.
                            </p>
                          </div>

                          <div className="pt-2 border-t border-[#DCC7AF]/30">
                            <p className="text-[10px] font-mono uppercase tracking-wider text-[#78716A] mb-1">
                              Collection
                            </p>
                            <Link
                              href="/collection?collection=Serendipity"
                              className="font-serif text-sm text-[#1F1E1D] hover:text-[#C5A059] font-medium block"
                            >
                              Serendipity 01
                            </Link>
                          </div>
                        </div>

                        {/* Column 2: Tops & Bottoms */}
                        <div className="space-y-5">
                          <div>
                            <Link
                              href="/collection?parent=Tops"
                              className="text-xs font-mono uppercase tracking-widest text-[#1F1E1D] font-semibold hover:text-[#C5A059] block mb-2"
                            >
                              Tops
                            </Link>
                            <ul className="space-y-1.5 text-xs text-[#78716A]">
                              <li>
                                <Link
                                  href="/collection?parent=Tops&sub=Blouses%20%26%20Shirts"
                                  className="hover:text-[#1F1E1D] transition-colors"
                                >
                                  Blouses &amp; Shirts
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href="/collection?parent=Tops&sub=Crop%20Tops"
                                  className="hover:text-[#1F1E1D] transition-colors"
                                >
                                  Crop Tops
                                </Link>
                              </li>
                            </ul>
                          </div>

                          <div className="pt-2 border-t border-[#DCC7AF]/30">
                            <Link
                              href="/collection?parent=Bottoms"
                              className="text-xs font-mono uppercase tracking-widest text-[#1F1E1D] font-semibold hover:text-[#C5A059] block mb-2"
                            >
                              Bottoms
                            </Link>
                            <ul className="space-y-1.5 text-xs text-[#78716A]">
                              <li>
                                <Link
                                  href="/collection?parent=Bottoms&sub=Pants"
                                  className="hover:text-[#1F1E1D] transition-colors"
                                >
                                  Pants
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href="/collection?parent=Bottoms&sub=Skirts"
                                  className="hover:text-[#1F1E1D] transition-colors"
                                >
                                  Skirts
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href="/collection?parent=Bottoms&sub=Shorts"
                                  className="hover:text-[#1F1E1D] transition-colors"
                                >
                                  Shorts
                                </Link>
                              </li>
                            </ul>
                          </div>
                        </div>

                        {/* Column 3: Dresses */}
                        <div className="space-y-2">
                          <Link
                            href="/collection?parent=Dresses"
                            className="text-xs font-mono uppercase tracking-widest text-[#1F1E1D] font-semibold hover:text-[#C5A059] block mb-2"
                          >
                            Dresses
                          </Link>
                          <ul className="space-y-1.5 text-xs text-[#78716A]">
                            <li>
                              <Link
                                href="/collection?parent=Dresses&sub=Mini"
                                className="hover:text-[#1F1E1D] transition-colors"
                              >
                                Mini
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/collection?parent=Dresses&sub=Maxi"
                                className="hover:text-[#1F1E1D] transition-colors"
                              >
                                Maxi
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/collection?parent=Dresses&sub=Linen"
                                className="hover:text-[#1F1E1D] transition-colors"
                              >
                                Linen
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/collection?parent=Dresses&sub=Floral"
                                className="hover:text-[#1F1E1D] transition-colors"
                              >
                                Floral
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/collection?parent=Dresses&sub=Casual"
                                className="hover:text-[#1F1E1D] transition-colors"
                              >
                                Casual
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/collection?parent=Dresses&sub=Formal"
                                className="hover:text-[#1F1E1D] transition-colors"
                              >
                                Formal
                              </Link>
                            </li>
                          </ul>
                        </div>

                        {/* Column 4: Occasion Tags */}
                        <div className="space-y-2 border-l border-[#DCC7AF]/40 pl-4">
                          <p className="text-xs font-mono uppercase tracking-widest text-[#1F1E1D] font-semibold mb-2">
                            Occasion
                          </p>
                          <ul className="space-y-2 text-xs text-[#78716A]">
                            {OCCASIONS.map((occ) => (
                              <li key={occ.name}>
                                <Link
                                  href={occ.href}
                                  className="hover:text-[#B86B4B] transition-colors block"
                                >
                                  {occ.name}
                                </Link>
                              </li>
                            ))}
                          </ul>

                          <div className="pt-4 mt-4 border-t border-[#DCC7AF]/30">
                            <Link
                              href="/collection"
                              className="text-[11px] font-mono uppercase tracking-wider text-[#B86B4B] font-semibold hover:underline flex items-center gap-1"
                            >
                              <span>View All (8)</span>
                              <ArrowRight className="w-3 h-3" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Other Primary Links */}
              <Link
                href="/collection?filter=new"
                className="text-xs uppercase tracking-[0.22em] font-sans font-medium text-[#1F1E1D] hover:text-[#B86B4B] transition-colors"
              >
                New Arrivals
              </Link>
              <Link
                href="/stories"
                className="text-xs uppercase tracking-[0.22em] font-sans font-medium text-[#1F1E1D] hover:text-[#B86B4B] transition-colors"
              >
                Heritage Stories
              </Link>
              <Link
                href="/about"
                className="text-xs uppercase tracking-[0.22em] font-sans font-medium text-[#1F1E1D] hover:text-[#B86B4B] transition-colors"
              >
                Our Story
              </Link>
              <Link
                href="/craft"
                className="text-xs uppercase tracking-[0.22em] font-sans font-medium text-[#1F1E1D] hover:text-[#B86B4B] transition-colors"
              >
                Artisan Craft
              </Link>
              <Link
                href="/journal"
                className="text-xs uppercase tracking-[0.22em] font-sans font-medium text-[#1F1E1D] hover:text-[#B86B4B] transition-colors"
              >
                Journal
              </Link>
            </div>

            {/* RIGHT: Search + Dual Pill CTAs + Cart Drawer */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              
              {/* Search Pill Button */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                title="Search collection"
                className="p-2 sm:py-2 sm:px-3 rounded-full border border-[#DCC7AF]/70 text-[#1F1E1D] hover:border-[#B86B4B] hover:text-[#B86B4B] transition-all flex items-center gap-1.5 text-xs font-sans cursor-pointer bg-white"
                aria-label="Search"
              >
                <Search className="w-3.5 h-3.5" />
                <span className="hidden xl:inline text-[11px] text-[#78716A]">Search pieces...</span>
              </button>

              {/* Ghost Pill CTA (Secondary Action: Track Order / Returns Portal) */}
              <Link
                href="/returns/start"
                className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#DCC7AF] text-[#1F1E1D] hover:border-[#1F1E1D] hover:bg-[#FAF7F2] text-[11px] font-mono uppercase tracking-wider font-semibold transition-all"
                title="Track your order or start a return"
              >
                <RotateCcw className="w-3 h-3 text-[#C5A059]" />
                <span>Track Order</span>
              </Link>

              {/* Solid Accent Pill CTA (Primary Conversion: Shop Now) */}
              <Link
                href="/collection"
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#B86B4B] hover:bg-[#9E4D30] text-white text-[11px] font-mono uppercase tracking-wider font-semibold transition-all shadow-sm"
              >
                <Sparkles className="w-3 h-3 text-white/80" />
                <span>Shop Now</span>
              </Link>

              {/* Cart Drawer Trigger */}
              <button
                type="button"
                onClick={onOpenCart}
                className="relative flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-[#1F1E1D] text-white hover:bg-[#C5A059] transition-all cursor-pointer shadow-sm text-xs font-mono font-medium"
                aria-label={`Shopping bag with ${cartCount} items`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span className="text-[11px] font-bold">{cartCount}</span>
              </button>

              {/* Mobile Hamburger Toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-full border border-[#DCC7AF] text-[#1F1E1D] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
                aria-label="Open navigation menu"
              >
                <Menu className="w-4 h-4" />
              </button>

            </div>

          </nav>
        </div>

      </header>

      {/* SEARCH MODAL */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* WISHLIST DRAWER */}
      <WishlistDrawer isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />

      {/* MOBILE FULL-SCREEN NAVIGATION PANEL */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="fixed inset-0 z-50 bg-[#FAF7F2] flex flex-col p-6 overflow-y-auto"
          >
            {/* Top Bar of Mobile Drawer */}
            <div className="flex items-center justify-between pb-6 border-b border-[#DCC7AF]/50">
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

            {/* Quick Action CTAs */}
            <div className="grid grid-cols-2 gap-3 py-4 border-b border-[#DCC7AF]/40">
              <Link
                href="/collection"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-4 rounded-full bg-[#B86B4B] text-white text-center font-mono text-xs uppercase tracking-wider font-semibold shadow-sm flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Shop Now</span>
              </Link>
              <Link
                href="/returns/start"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-4 rounded-full border border-[#DCC7AF] bg-white text-[#1F1E1D] text-center font-mono text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Track Order</span>
              </Link>
            </div>

            {/* Primary Nav Links */}
            <div className="py-6 space-y-4 text-left">
              
              {/* Collection with Accordion */}
              <div>
                <button
                  type="button"
                  onClick={() =>
                    setMobileExpandedCat(
                      mobileExpandedCat === "collection" ? null : "collection"
                    )
                  }
                  className="w-full flex items-center justify-between text-base font-serif text-[#1F1E1D] py-2"
                >
                  <span>Explore Collection</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      mobileExpandedCat === "collection" ? "rotate-180 text-[#B86B4B]" : ""
                    }`}
                  />
                </button>

                {mobileExpandedCat === "collection" && (
                  <div className="pl-4 py-2 space-y-3 text-sm text-[#78716A] border-l-2 border-[#DCC7AF]/60 mt-1">
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
                      Dresses (Maxi, Mini, Linen, Formal)
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
                className="block text-base font-serif text-[#1F1E1D] py-2 border-t border-[#DCC7AF]/30"
              >
                Heritage Stories
              </Link>

              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-base font-serif text-[#1F1E1D] py-2 border-t border-[#DCC7AF]/30"
              >
                Our Story (About BINDY)
              </Link>

              <Link
                href="/craft"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-base font-serif text-[#1F1E1D] py-2 border-t border-[#DCC7AF]/30"
              >
                Artisan Craft &amp; Sustainability
              </Link>

              <Link
                href="/journal"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-base font-serif text-[#1F1E1D] py-2 border-t border-[#DCC7AF]/30"
              >
                Field Notes &amp; Journal
              </Link>

              <Link
                href="/size-guide"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-base font-serif text-[#1F1E1D] py-2 border-t border-[#DCC7AF]/30"
              >
                Size Guide &amp; Fit Measurements
              </Link>

              <Link
                href="/returns"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-base font-serif text-[#1F1E1D] py-2 border-t border-[#DCC7AF]/30"
              >
                Returns &amp; Exchanges Policy
              </Link>

              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-base font-serif text-[#1F1E1D] py-2 border-t border-[#DCC7AF]/30"
              >
                Contact &amp; Concierge
              </Link>

            </div>

            {/* Bottom Drawer Details */}
            <div className="mt-auto pt-6 border-t border-[#DCC7AF]/50 flex items-center justify-between text-xs font-mono text-[#78716A]">
              <span>Currency: {currency}</span>
              <Link
                href="/account"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[#1F1E1D] font-semibold"
              >
                {account ? "My Account" : "Sign In / Register"}
              </Link>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
