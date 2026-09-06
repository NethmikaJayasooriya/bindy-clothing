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
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled
            ? "bg-[#FAF7F2]/95 backdrop-blur-md py-3.5 shadow-sm border-b border-[#DCC7AF]/40"
            : "bg-gradient-to-b from-black/60 via-black/20 to-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Left: Brand Identity */}
          <div className="flex-shrink-0">
            <Link href="/" className="inline-block text-left group">
              <span
                className={`font-display text-2xl sm:text-3xl tracking-[0.2em] font-normal transition-colors group-hover:text-[#C5A059] ${
                  isScrolled ? "text-[#1F1E1D]" : "text-white"
                }`}
              >
                BINDY.
              </span>
              <span className="block text-[8px] uppercase tracking-[0.45em] text-[#C5A059] font-sans -mt-1 font-semibold">
                Clothing
              </span>
            </Link>
          </div>

          {/* Center: Navigation Links with Mega-Menu on Collection */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <div
              className="relative py-2"
              onMouseEnter={() => setIsCollectionHovered(true)}
              onMouseLeave={() => setIsCollectionHovered(false)}
            >
              <Link
                href="/collection"
                className={`text-xs uppercase tracking-[0.25em] font-sans font-medium transition-colors hover:text-[#C5A059] flex items-center gap-1 ${
                  isScrolled ? "text-[#1F1E1D]" : "text-white"
                }`}
              >
                <span>Collection</span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </Link>

              {/* 5.1 DESKTOP MEGA-MENU DROPDOWN */}
              <AnimatePresence>
                {isCollectionHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-1/2 -translate-x-1/2 top-full mt-1 w-[720px] bg-[#FAF7F2] border border-[#DCC7AF]/70 rounded-3xl p-7 shadow-2xl z-50 text-[#1F1E1D]"
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
                            <Link href="/collection?parent=Dresses&sub=Mini" className="hover:text-[#1F1E1D]">
                              Mini
                            </Link>
                          </li>
                          <li>
                            <Link href="/collection?parent=Dresses&sub=Maxi" className="hover:text-[#1F1E1D]">
                              Maxi
                            </Link>
                          </li>
                          <li>
                            <Link href="/collection?parent=Dresses&sub=Linen" className="hover:text-[#1F1E1D]">
                              Linen
                            </Link>
                          </li>
                          <li>
                            <Link href="/collection?parent=Dresses&sub=Floral" className="hover:text-[#1F1E1D]">
                              Floral
                            </Link>
                          </li>
                          <li>
                            <Link href="/collection?parent=Dresses&sub=Casual" className="hover:text-[#1F1E1D]">
                              Casual
                            </Link>
                          </li>
                          <li>
                            <Link href="/collection?parent=Dresses&sub=Formal" className="hover:text-[#1F1E1D]">
                              Formal
                            </Link>
                          </li>
                        </ul>
                      </div>

                      {/* Column 4: Occasions & Lookbook Promo */}
                      <div className="space-y-4 bg-white/70 p-4 rounded-2xl border border-[#DCC7AF]/40">
                        <p className="text-xs font-mono uppercase tracking-widest text-[#1F1E1D] font-semibold">
                          Occasion
                        </p>
                        <ul className="space-y-1.5 text-xs text-[#78716A]">
                          {OCCASIONS.map((occ) => (
                            <li key={occ.name}>
                              <Link href={occ.href} className="hover:text-[#C5A059] transition-colors">
                                {occ.name}
                              </Link>
                            </li>
                          ))}
                        </ul>

                        <div className="pt-3 border-t border-[#DCC7AF]/40">
                          <Link
                            href="/collection"
                            className="text-[11px] font-mono tracking-wider uppercase text-[#C5A059] hover:underline flex items-center gap-1 font-semibold"
                          >
                            <span>Shop All Pieces</span>
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
              href="/stories"
              className={`text-xs uppercase tracking-[0.25em] font-sans font-medium transition-colors hover:text-[#C5A059] ${
                isScrolled ? "text-[#1F1E1D]" : "text-white"
              }`}
            >
              Heritage Stories
            </Link>
            <Link
              href="/about"
              className={`text-xs uppercase tracking-[0.25em] font-sans font-medium transition-colors hover:text-[#C5A059] ${
                isScrolled ? "text-[#1F1E1D]" : "text-white"
              }`}
            >
              Our Story
            </Link>
            <Link
              href="/craft"
              className={`text-xs uppercase tracking-[0.25em] font-sans font-medium transition-colors hover:text-[#C5A059] ${
                isScrolled ? "text-[#1F1E1D]" : "text-white"
              }`}
            >
              Artisan Craft
            </Link>
            <Link
              href="/journal"
              className={`text-xs uppercase tracking-[0.25em] font-sans font-medium transition-colors hover:text-[#C5A059] ${
                isScrolled ? "text-[#1F1E1D]" : "text-white"
              }`}
            >
              Journal
            </Link>
          </nav>

          {/* Right: Controls Cluster */}
          <div className="flex items-center gap-2.5 sm:gap-3 lg:gap-3.5">
            {/* 1. Currency Selector */}
            <div className="relative hidden lg:block">
              <button
                onClick={() => setIsCurrencyDropdown(!isCurrencyDropdown)}
                className={`flex items-center gap-1 text-[11px] font-sans uppercase tracking-widest px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                  isScrolled
                    ? "border-[#DCC7AF]/60 text-[#1F1E1D] hover:border-[#C5A059]"
                    : "border-white/30 text-white hover:border-[#C5A059]"
                }`}
              >
                <span>{currency}</span>
                <ChevronDown className="w-3 h-3 ml-0.5 opacity-70" />
              </button>

              {isCurrencyDropdown && (
                <div className="absolute right-0 mt-2 w-28 bg-[#FFFDF9] border border-[#DCC7AF]/40 rounded-xl shadow-xl py-1 z-50">
                  {currencies.map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        setCurrency(c);
                        setIsCurrencyDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs font-sans tracking-wider transition-colors hover:bg-[#C5A059]/15 hover:text-[#C5A059] ${
                        currency === c
                          ? "text-[#C5A059] font-medium"
                          : "text-[#1F1E1D]"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Sound Toggle */}
            <button
              onClick={toggleAudio}
              className={`hidden sm:flex p-2 sm:p-2.5 rounded-full transition-all duration-300 border cursor-pointer ${
                isScrolled
                  ? "border-[#DCC7AF]/60 text-[#1F1E1D] hover:border-[#C5A059] hover:text-[#C5A059]"
                  : "border-white/30 text-white hover:border-[#C5A059] hover:text-[#C5A059]"
              }`}
              title={isMuted ? "Unmute Ambient Sound" : "Mute Ambient Sound"}
              aria-label="Ambient Sound"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#C5A059]" />}
            </button>

            {/* Divider */}
            <div className={`hidden lg:block w-px h-4 ${isScrolled ? "bg-[#DCC7AF]/60" : "bg-white/25"} my-auto`} />

            {/* 3. Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              title="Search collection"
              className={`p-2 sm:p-2.5 rounded-full transition-all duration-300 border cursor-pointer ${
                isScrolled
                  ? "border-[#DCC7AF]/60 text-[#1F1E1D] hover:border-[#C5A059] hover:text-[#C5A059]"
                  : "border-white/30 text-white hover:border-[#C5A059] hover:text-[#C5A059]"
              }`}
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* 4. Wishlist */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              title="Saved Pieces"
              className={`relative p-2 sm:p-2.5 rounded-full transition-all duration-300 border hover:border-[#C5A059] hover:text-[#C5A059] cursor-pointer ${
                isScrolled
                  ? "border-[#DCC7AF]/60 text-[#1F1E1D]"
                  : "border-white/30 text-white"
              }`}
              aria-label="Saved Pieces"
            >
              <Heart
                className={`w-4 h-4 transition-colors ${
                  wishlistCount > 0 ? "fill-[#C5A059] text-[#C5A059]" : ""
                }`}
              />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#C5A059] text-[#1F1E1D] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* 5. Profile Trigger */}
            {account ? (
              <Link
                href="/account"
                title="Your BINDY Account"
                className={`p-1 sm:p-1.5 rounded-full transition-all duration-300 border hover:border-[#C5A059] cursor-pointer ${
                  isScrolled
                    ? "border-[#DCC7AF]/60 bg-[#F2ECE1]"
                    : "border-white/30 bg-black/20"
                }`}
                aria-label="Account Profile"
              >
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#C5A059]/20 text-[#C5A059] flex items-center justify-center font-serif text-[11px] font-semibold">
                  {getInitials(account.name)}
                </div>
              </Link>
            ) : (
              <Link
                href="/account"
                title="Sign In / Register"
                className={`p-2 sm:p-2.5 rounded-full transition-all duration-300 border hover:border-[#C5A059] hover:text-[#C5A059] cursor-pointer ${
                  isScrolled
                    ? "border-[#DCC7AF]/60 text-[#1F1E1D]"
                    : "border-white/30 text-white"
                }`}
                aria-label="Account Profile"
              >
                <User className="w-4 h-4" />
              </Link>
            )}

            {/* 6. Shopping Bag Trigger */}
            <button
              onClick={onOpenCart}
              title="View Cart"
              className={`relative p-2 sm:p-2.5 rounded-full transition-all duration-300 border cursor-pointer hover:border-[#C5A059] hover:text-[#C5A059] ${
                isScrolled
                  ? "border-[#DCC7AF]/60 text-[#1F1E1D]"
                  : "border-white/30 text-white"
              }`}
              aria-label="Shopping Bag"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#C5A059] text-[#1F1E1D] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>

            {/* 7. Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2 rounded-full border transition-colors cursor-pointer ${
                isScrolled
                  ? "border-[#DCC7AF]/60 text-[#1F1E1D]"
                  : "border-white/30 text-white"
              }`}
              aria-label="Open Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Drawer Menu with 5.1 Expandable Taxonomy Accordion */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-30 bg-[#FAF7F2] pt-24 px-6 pb-10 flex flex-col justify-between md:hidden shadow-2xl overflow-y-auto"
          >
            <div className="flex flex-col space-y-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsSearchOpen(true);
                }}
                className="flex items-center justify-center gap-2.5 w-full py-3 px-4 rounded-full border border-[#DCC7AF]/60 bg-white/80 text-xs font-sans uppercase tracking-[0.2em] text-[#1F1E1D] hover:border-[#C5A059] hover:text-[#C5A059] transition-colors"
              >
                <Search className="w-4 h-4 text-[#C5A059]" />
                <span>Search Collection</span>
              </button>

              {/* 5.1 ACCORDION CATEGORIES */}
              <div className="py-2 text-left border-y border-[#DCC7AF]/40 my-2 space-y-2">
                <Link
                  href="/collection?filter=new"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2 text-xs font-mono uppercase tracking-widest text-[#C5A059] font-semibold"
                >
                  <span>✦ New Arrivals</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>

                {TAXONOMY_CATEGORIES.map((cat) => (
                  <div key={cat.name} className="border-t border-[#DCC7AF]/20 pt-2">
                    <div className="flex items-center justify-between">
                      <Link
                        href={cat.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="font-serif text-lg text-[#1F1E1D] hover:text-[#C5A059]"
                      >
                        {cat.name}
                      </Link>
                      {cat.subcategories.length > 0 && (
                        <button
                          type="button"
                          onClick={() =>
                            setMobileExpandedCat(mobileExpandedCat === cat.name ? null : cat.name)
                          }
                          className="p-1 text-[#78716A]"
                        >
                          <ChevronDown
                            className={`w-4 h-4 transition-transform ${
                              mobileExpandedCat === cat.name ? "rotate-180 text-[#C5A059]" : ""
                            }`}
                          />
                        </button>
                      )}
                    </div>

                    {mobileExpandedCat === cat.name && cat.subcategories.length > 0 && (
                      <div className="pl-4 pt-2 pb-1 space-y-1.5 text-xs text-[#78716A]">
                        {cat.subcategories.map((sub) => (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block py-1 hover:text-[#1F1E1D]"
                          >
                            • {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {/* OCCASIONS */}
                <div className="border-t border-[#DCC7AF]/20 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-lg text-[#1F1E1D]">Occasions</span>
                    <button
                      type="button"
                      onClick={() =>
                        setMobileExpandedCat(mobileExpandedCat === "Occasion" ? null : "Occasion")
                      }
                      className="p-1 text-[#78716A]"
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          mobileExpandedCat === "Occasion" ? "rotate-180 text-[#C5A059]" : ""
                        }`}
                      />
                    </button>
                  </div>
                  {mobileExpandedCat === "Occasion" && (
                    <div className="pl-4 pt-2 pb-1 space-y-1.5 text-xs text-[#78716A]">
                      {OCCASIONS.map((occ) => (
                        <Link
                          key={occ.name}
                          href={occ.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block py-1 hover:text-[#1F1E1D]"
                        >
                          • {occ.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* SECONDARY BRAND LINKS */}
              <div className="space-y-2 text-left pt-1">
                <Link
                  href="/stories"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-xs uppercase tracking-[0.2em] text-[#78716A] hover:text-[#C5A059]"
                >
                  Heritage Stories
                </Link>
                <Link
                  href="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-xs uppercase tracking-[0.2em] text-[#78716A] hover:text-[#C5A059]"
                >
                  Our Story
                </Link>
                <Link
                  href="/craft"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-xs uppercase tracking-[0.2em] text-[#78716A] hover:text-[#C5A059]"
                >
                  Artisan Craft
                </Link>
                <Link
                  href="/journal"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-xs uppercase tracking-[0.2em] text-[#78716A] hover:text-[#C5A059]"
                >
                  Journal
                </Link>
                <Link
                  href="/size-guide"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-xs uppercase tracking-[0.2em] text-[#78716A] hover:text-[#C5A059]"
                >
                  Size Guide
                </Link>
                <Link
                  href="/returns"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-xs uppercase tracking-[0.2em] text-[#78716A] hover:text-[#C5A059]"
                >
                  Returns &amp; Exchanges
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-xs uppercase tracking-[0.2em] text-[#78716A] hover:text-[#C5A059]"
                >
                  Contact &amp; FAQ
                </Link>
              </div>
            </div>

            <div className="border-t border-[#DCC7AF]/30 pt-6 text-center space-y-3 mt-6">
              <div className="flex justify-center space-x-3 text-xs tracking-wider uppercase">
                {currencies.slice(0, 3).map((c) => (
                  <button
                    key={c}
                    onClick={() => setCurrency(c)}
                    className={`px-3 py-1 rounded-full border ${
                      currency === c
                        ? "border-[#C5A059] text-[#C5A059] bg-[#C5A059]/10"
                        : "border-[#DCC7AF]/60 text-[#1F1E1D]"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#78716A]">
                Two Islands, One Thread • Australia &amp; Sri Lanka
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Search Modal Overlay */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Global Saved Pieces / Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        onOpenCart={onOpenCart}
      />
    </>
  );
}
