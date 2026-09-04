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
          {/* Left: Brand Identity (Logo & Reverted Tagline "Clothing") */}
          <div className="flex-shrink-0">
            <Link href="/" className="inline-block text-left group">
              <span
                className={`font-display text-2xl sm:text-3xl tracking-[0.2em] font-normal transition-colors group-hover:text-[#C5A059] ${
                  isScrolled ? "text-charcoal" : "text-white"
                }`}
              >
                BINDY.
              </span>
              <span className="block text-[8px] uppercase tracking-[0.45em] text-[#C5A059] font-sans -mt-1 font-semibold">
                Clothing
              </span>
            </Link>
          </div>

          {/* Center: Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <Link
              href="/collection"
              className={`text-xs uppercase tracking-[0.25em] font-sans font-medium transition-colors hover:text-[#C5A059] ${
                isScrolled ? "text-charcoal" : "text-white"
              }`}
            >
              Collection
            </Link>
            <Link
              href="/stories"
              className={`text-xs uppercase tracking-[0.25em] font-sans font-medium transition-colors hover:text-[#C5A059] ${
                isScrolled ? "text-charcoal" : "text-white"
              }`}
            >
              Heritage Stories
            </Link>
            <Link
              href="/about"
              className={`text-xs uppercase tracking-[0.25em] font-sans font-medium transition-colors hover:text-[#C5A059] ${
                isScrolled ? "text-charcoal" : "text-white"
              }`}
            >
              Our Story
            </Link>
            <Link
              href="/craft"
              className={`text-xs uppercase tracking-[0.25em] font-sans font-medium transition-colors hover:text-[#C5A059] ${
                isScrolled ? "text-charcoal" : "text-white"
              }`}
            >
              Artisan Craft
            </Link>
            <Link
              href="/journal"
              className={`text-xs uppercase tracking-[0.25em] font-sans font-medium transition-colors hover:text-[#C5A059] ${
                isScrolled ? "text-charcoal" : "text-white"
              }`}
            >
              Journal
            </Link>
          </nav>

          {/* Right: Uncrowded & Harmonious Controls Cluster */}
          <div className="flex items-center gap-2.5 sm:gap-3 lg:gap-3.5">
            {/* 1. Currency Selector (Desktop) */}
            <div className="relative hidden lg:block">
              <button
                onClick={() => setIsCurrencyDropdown(!isCurrencyDropdown)}
                className={`flex items-center gap-1 text-[11px] font-sans uppercase tracking-widest px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                  isScrolled
                    ? "border-[#DCC7AF]/60 text-charcoal hover:border-[#C5A059]"
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
                          : "text-charcoal"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Sound Toggle (Desktop & Tablet) */}
            <button
              onClick={toggleAudio}
              className={`hidden sm:flex p-2 sm:p-2.5 rounded-full transition-all duration-300 border cursor-pointer ${
                isScrolled
                  ? "border-[#DCC7AF]/60 text-charcoal hover:border-[#C5A059] hover:text-[#C5A059]"
                  : "border-white/30 text-white hover:border-[#C5A059] hover:text-[#C5A059]"
              }`}
              title={isMuted ? "Unmute Ambient Sound" : "Mute Ambient Sound"}
              aria-label="Ambient Sound"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#C5A059]" />}
            </button>

            {/* Subtle Divider between utilities & shopping actions */}
            <div className={`hidden lg:block w-px h-4 ${isScrolled ? "bg-sand/40" : "bg-white/25"} my-auto`} />

            {/* 3. Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              title="Search collection"
              className={`p-2 sm:p-2.5 rounded-full transition-all duration-300 border cursor-pointer ${
                isScrolled
                  ? "border-[#DCC7AF]/60 text-charcoal hover:border-[#C5A059] hover:text-[#C5A059]"
                  : "border-white/30 text-white hover:border-[#C5A059] hover:text-[#C5A059]"
              }`}
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* 4. Wishlist / Saved Pieces */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              title="Saved Pieces"
              className={`relative p-2 sm:p-2.5 rounded-full transition-all duration-300 border hover:border-[#C5A059] hover:text-[#C5A059] cursor-pointer ${
                isScrolled
                  ? "border-[#DCC7AF]/60 text-charcoal"
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
                <span className="absolute -top-1 -right-1 bg-[#C5A059] text-charcoal text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* 5. Profile Trigger (Signed-In: Initials Badge | Signed-Out: Standard User Icon) */}
            {account ? (
              <Link
                href="/account"
                title={`Origins Circle Account (${account.name})`}
                className="relative group flex items-center justify-center cursor-pointer"
                aria-label="Member Account"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-[#FFFDF9] via-[#FAF7F2] to-[#F2ECE1] border border-[#C5A059] group-hover:border-[#C5A059] flex items-center justify-center shadow-[0_2px_8px_rgba(197,160,89,0.25)] group-hover:shadow-[0_4px_16px_rgba(197,160,89,0.45)] transition-all duration-300 transform group-hover:scale-105">
                  <span className="font-serif text-xs font-semibold text-[#C5A059] tracking-wider select-none">
                    {getInitials(account.name)}
                  </span>
                </div>
              </Link>
            ) : (
              <Link
                href="/account"
                title="Sign In / Account"
                className={`p-2 sm:p-2.5 rounded-full transition-all duration-300 border flex items-center justify-center cursor-pointer ${
                  isScrolled
                    ? "border-[#DCC7AF]/60 text-charcoal hover:border-[#C5A059] hover:text-[#C5A059]"
                    : "border-white/30 text-white hover:border-[#C5A059] hover:text-[#C5A059]"
                }`}
                aria-label="Account"
              >
                <User className="w-4 h-4" />
              </Link>
            )}

            {/* 6. Shopping Bag / Cart Button */}
            <button
              onClick={onOpenCart}
              className={`relative p-2 sm:p-2.5 rounded-full transition-all duration-300 border hover:border-[#C5A059] hover:text-[#C5A059] flex items-center justify-center cursor-pointer ${
                isScrolled
                  ? "border-[#DCC7AF]/60 text-charcoal"
                  : "border-white/30 text-white"
              }`}
              title="Shopping Bag"
              aria-label="Shopping Bag"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#C5A059] text-charcoal text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* 7. Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2 rounded-full transition-colors cursor-pointer ${
                isScrolled ? "text-charcoal" : "text-white"
              }`}
              aria-label="Open Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-30 bg-[#FAF7F2] pt-24 px-8 pb-12 flex flex-col justify-between md:hidden shadow-2xl"
          >
            <div className="flex flex-col space-y-3.5 text-center">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsSearchOpen(true);
                }}
                className="flex items-center justify-center gap-2.5 w-full py-3 px-4 rounded-full border border-[#DCC7AF]/60 bg-white/70 text-xs font-sans uppercase tracking-[0.2em] text-charcoal hover:border-gold hover:text-gold transition-colors cursor-pointer"
              >
                <Search className="w-4 h-4 text-gold" />
                <span>Search Collection</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsWishlistOpen(true);
                }}
                className="flex items-center justify-center gap-2.5 w-full py-3 px-4 rounded-full border border-[#DCC7AF]/60 bg-white/70 text-xs font-sans uppercase tracking-[0.2em] text-charcoal hover:border-gold hover:text-gold transition-colors cursor-pointer"
              >
                <Heart className={`w-4 h-4 ${wishlistCount > 0 ? "fill-gold text-gold" : "text-gold"}`} />
                <span>Saved Pieces {wishlistCount > 0 && `(${wishlistCount})`}</span>
              </button>

              {/* Mobile Profile Card / Link */}
              {account ? (
                <Link
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3.5 w-full p-3 rounded-2xl border border-gold/40 bg-[#FFFDF9] text-left transition-all hover:border-gold cursor-pointer mb-2 shadow-sm"
                >
                  <div className="w-10 h-10 rounded-full bg-paper-dark border border-gold/70 flex items-center justify-center text-gold font-serif text-sm font-semibold shadow-sm flex-shrink-0">
                    {getInitials(account.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-serif text-sm text-charcoal font-medium truncate">
                      {account.name}
                    </p>
                    <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-gold font-semibold block">
                      Origins Circle Member
                    </span>
                  </div>
                </Link>
              ) : (
                <Link
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2.5 w-full py-3 px-4 rounded-full border border-[#DCC7AF]/60 bg-white/70 text-xs font-sans uppercase tracking-[0.2em] text-charcoal hover:border-gold hover:text-gold transition-colors mb-2 cursor-pointer"
                >
                  <User className="w-4 h-4 text-gold" />
                  <span>Sign In / Join The Circle</span>
                </Link>
              )}

              {/* Mobile Sound Toggle */}
              <button
                onClick={toggleAudio}
                className="flex items-center justify-center gap-2.5 w-full py-3 px-4 rounded-full border border-[#DCC7AF]/60 bg-white/70 text-xs font-sans uppercase tracking-[0.2em] text-charcoal hover:border-gold hover:text-gold transition-colors cursor-pointer"
              >
                {isMuted ? (
                  <>
                    <VolumeX className="w-4 h-4 text-sand" />
                    <span>Unmute Ambient Sound</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 text-gold" />
                    <span>Ambient Sound Active</span>
                  </>
                )}
              </button>

              <Link
                href="/collection"
                onClick={() => setMobileMenuOpen(false)}
                className="font-serif text-xl sm:text-2xl uppercase tracking-[0.2em] text-charcoal pt-2 hover:text-gold transition-colors"
              >
                Collection
              </Link>
              <Link
                href="/stories"
                onClick={() => setMobileMenuOpen(false)}
                className="font-serif text-xl sm:text-2xl uppercase tracking-[0.2em] text-charcoal hover:text-gold transition-colors"
              >
                Heritage Stories
              </Link>
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="font-serif text-xl sm:text-2xl uppercase tracking-[0.2em] text-charcoal hover:text-gold transition-colors"
              >
                Our Story
              </Link>
              <Link
                href="/craft"
                onClick={() => setMobileMenuOpen(false)}
                className="font-serif text-xl sm:text-2xl uppercase tracking-[0.2em] text-charcoal hover:text-gold transition-colors"
              >
                Artisan Craft
              </Link>
              <Link
                href="/journal"
                onClick={() => setMobileMenuOpen(false)}
                className="font-serif text-xl sm:text-2xl uppercase tracking-[0.2em] text-charcoal hover:text-gold transition-colors"
              >
                Journal
              </Link>
              <Link
                href="/size-guide"
                onClick={() => setMobileMenuOpen(false)}
                className="font-serif text-xl sm:text-2xl uppercase tracking-[0.2em] text-charcoal hover:text-gold transition-colors"
              >
                Size Guide
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="font-serif text-xl sm:text-2xl uppercase tracking-[0.2em] text-charcoal hover:text-gold transition-colors"
              >
                Contact & FAQ
              </Link>
            </div>

            <div className="border-t border-[#DCC7AF]/30 pt-6 text-center space-y-4">
              <div className="flex justify-center space-x-4 text-xs tracking-wider uppercase text-charcoal/80">
                {currencies.slice(0, 3).map((c) => (
                  <button
                    key={c}
                    onClick={() => setCurrency(c)}
                    className={`px-3 py-1 rounded-full border ${
                      currency === c
                        ? "border-[#C5A059] text-[#C5A059] bg-[#C5A059]/10"
                        : "border-[#DCC7AF]/60 text-charcoal"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-muted">
                Designed in Australia • Inspired by Sri Lanka
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
