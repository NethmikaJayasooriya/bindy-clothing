"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Search, Heart, Volume2, VolumeX, Menu, X, ChevronDown } from "lucide-react";

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
  const [currency, setCurrency] = useState("AUD $");
  const [isCurrencyDropdown, setIsCurrencyDropdown] = useState(false);

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

  const currencies = ["AUD $", "USD $", "LKR Rs", "GBP £", "EUR €"];

  return (
    <>
      <motion.header
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled
            ? "bg-[#FAF7F2]/95 dark:bg-[#151413]/95 backdrop-blur-xl border-b border-[#DCC7AF]/30 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.08)] text-zinc-900 dark:text-zinc-100"
            : "bg-gradient-to-b from-black/40 via-transparent to-transparent py-3 text-white"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* 1. LEFT CORNER: BRAND LOGO */}
          <div className="flex items-center">
            <Link href="/" className="group flex flex-col items-start text-left">
              <span
                className={`font-serif text-2xl sm:text-3xl tracking-[0.22em] uppercase font-medium transition-colors duration-300 ${
                  isScrolled ? "text-[#1F1E1D] dark:text-[#FAF7F2]" : "text-[#FAF7F2]"
                }`}
              >
                BINDY<span className="text-[#C5A059]">.</span>
              </span>
              <span className="text-[8px] font-sans tracking-[0.4em] uppercase text-[#C5A059] -mt-1 opacity-90">
                Clothing
              </span>
            </Link>
          </div>

          {/* 2. CENTER: NAVIGATION LINKS (DESKTOP) */}
          <nav className="hidden md:flex items-center space-x-9 text-[11px] lg:text-[12px] font-sans tracking-[0.25em] uppercase">
            <Link
              href="#collection"
              className={`transition-colors duration-300 hover:text-[#C5A059] ${
                isScrolled ? "text-zinc-800 dark:text-zinc-200" : "text-white/90"
              }`}
            >
              Collection
            </Link>
            <Link
              href="#stories"
              className={`transition-colors duration-300 hover:text-[#C5A059] ${
                isScrolled ? "text-zinc-800 dark:text-zinc-200" : "text-white/90"
              }`}
            >
              Heritage Stories
            </Link>
            <Link
              href="#about"
              className={`transition-colors duration-300 hover:text-[#C5A059] ${
                isScrolled ? "text-zinc-800 dark:text-zinc-200" : "text-white/90"
              }`}
            >
              Our Story
            </Link>
            <Link
              href="#craft"
              className={`transition-colors duration-300 hover:text-[#C5A059] ${
                isScrolled ? "text-zinc-800 dark:text-zinc-200" : "text-white/90"
              }`}
            >
              Artisan Craft
            </Link>
          </nav>

          {/* 3. RIGHT CORNER: CONTROLS & ACTIONS */}
          <div className="flex items-center space-x-4 sm:space-x-5">
            {/* Currency Selector */}
            <div className="relative hidden lg:block">
              <button
                onClick={() => setIsCurrencyDropdown(!isCurrencyDropdown)}
                className={`flex items-center space-x-1 text-[11px] font-sans tracking-[0.18em] uppercase transition-colors duration-300 hover:text-[#C5A059] ${
                  isScrolled ? "text-zinc-700 dark:text-zinc-300" : "text-white/90"
                }`}
              >
                <span>{currency}</span>
                <ChevronDown className="w-3 h-3 opacity-70" />
              </button>

              <AnimatePresence>
                {isCurrencyDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute right-0 mt-2 w-28 bg-[#FAF7F2] dark:bg-[#1E1D1B] border border-[#DCC7AF]/40 rounded-lg shadow-xl py-1.5 z-50 text-zinc-800 dark:text-zinc-100"
                  >
                    {currencies.map((c) => (
                      <button
                        key={c}
                        onClick={() => {
                          setCurrency(c);
                          setIsCurrencyDropdown(false);
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs hover:bg-[#DCC7AF]/20 transition-colors font-sans"
                      >
                        {c}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Ambient Sound Toggle (Clean & Static) */}
            <button
              onClick={toggleAudio}
              title={isMuted ? "Unmute Ambient Soundscape" : "Mute Soundscape"}
              className={`p-2 rounded-full transition-all duration-300 border ${
                isScrolled
                  ? "border-[#DCC7AF]/50 text-zinc-700 dark:text-zinc-300 hover:border-[#C5A059]"
                  : "border-white/30 text-white hover:border-[#C5A059]"
              }`}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4 text-[#C5A059]" />
              )}
            </button>

            {/* Wishlist */}
            <button
              className={`p-2 rounded-full transition-all duration-300 hover:text-[#C5A059] hidden sm:block ${
                isScrolled ? "text-zinc-700 dark:text-zinc-300" : "text-white"
              }`}
            >
              <Heart className="w-4 h-4" />
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className={`relative p-2 rounded-full transition-all duration-300 hover:text-[#C5A059] flex items-center space-x-1.5 ${
                isScrolled ? "text-zinc-700 dark:text-zinc-300" : "text-white"
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#C5A059] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2 rounded-full transition-colors ${
                isScrolled ? "text-zinc-800 dark:text-zinc-200" : "text-white"
              }`}
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
            className="fixed inset-0 z-30 bg-[#FAF7F2] dark:bg-[#151413] pt-24 px-8 pb-12 flex flex-col justify-between md:hidden"
          >
            <div className="flex flex-col space-y-6 text-center">
              <Link
                href="#collection"
                onClick={() => setMobileMenuOpen(false)}
                className="font-serif text-2xl uppercase tracking-[0.2em] text-zinc-900 dark:text-zinc-100"
              >
                Collection 01
              </Link>
              <Link
                href="#stories"
                onClick={() => setMobileMenuOpen(false)}
                className="font-serif text-2xl uppercase tracking-[0.2em] text-zinc-900 dark:text-zinc-100"
              >
                Heritage Stories
              </Link>
              <Link
                href="#about"
                onClick={() => setMobileMenuOpen(false)}
                className="font-serif text-2xl uppercase tracking-[0.2em] text-zinc-900 dark:text-zinc-100"
              >
                Three Women
              </Link>
              <Link
                href="#craft"
                onClick={() => setMobileMenuOpen(false)}
                className="font-serif text-2xl uppercase tracking-[0.2em] text-zinc-900 dark:text-zinc-100"
              >
                Artisan Craft
              </Link>
            </div>

            <div className="border-t border-[#DCC7AF]/30 pt-6 text-center space-y-4">
              <div className="flex justify-center space-x-4 text-xs tracking-wider uppercase text-zinc-600 dark:text-zinc-400">
                {currencies.slice(0, 3).map((c) => (
                  <button
                    key={c}
                    onClick={() => setCurrency(c)}
                    className={`px-3 py-1 rounded-full border ${
                      currency === c
                        ? "border-[#C5A059] text-[#C5A059] bg-[#C5A059]/10"
                        : "border-zinc-300 dark:border-zinc-700"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-[#8C8477]">
                Designed in Australia • Inspired by Sri Lanka
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
