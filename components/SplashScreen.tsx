"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isOpening, setIsOpening] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Smooth progress simulation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsReady(true);
          return 100;
        }
        const increment = Math.floor(Math.random() * 8) + 4;
        return Math.min(prev + increment, 100);
      });
    }, 85);

    return () => clearInterval(interval);
  }, []);

  const handleEnter = () => {
    if (isOpening) return;
    setIsOpening(true);
    setTimeout(() => {
      onComplete();
    }, 1600);
  };

  // Auto trigger after reaching 100% and delay
  useEffect(() => {
    if (isReady) {
      const timer = setTimeout(() => {
        handleEnter();
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [isReady]);

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden select-none pointer-events-auto flex items-center justify-center ${
        isOpening ? "curtains-open" : ""
      }`}
    >
      {/* LEFT SILK CURTAIN PANEL */}
      <div
        className={`curtain-left absolute top-0 left-0 w-1/2 h-full bg-ink z-20 overflow-hidden shadow-[10px_0_50px_rgba(0,0,0,0.8)]`}
      >
        {/* Symmetrical Fabric Shading */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#2A2420]/20 to-black/50" />
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_50%,rgba(197,160,89,0.2)_0%,transparent_70%)]" />
      </div>

      {/* RIGHT SILK CURTAIN PANEL */}
      <div
        className={`curtain-right absolute top-0 right-0 w-1/2 h-full bg-ink z-20 overflow-hidden shadow-[-10px_0_50px_rgba(0,0,0,0.8)]`}
      >
        {/* Symmetrical Fabric Shading */}
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#2A2420]/20 to-black/50" />
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_70%_50%,rgba(197,160,89,0.2)_0%,transparent_70%)]" />
      </div>

      {/* CENTER STAGE CONTENT - ABSOLUTELY CENTERED ON SCREEN */}
      <div
        className={`absolute inset-0 z-30 flex flex-col items-center justify-center text-center px-4 transition-all duration-1000 ${
          isOpening ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"
        }`}
      >
        {/* Perfectly Centered Radial Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#C5A059]/10 via-[#A46446]/10 to-transparent blur-3xl animate-pulse-glow pointer-events-none" />

        {/* Brand Crest & Lotus Motif */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex flex-col items-center justify-center space-y-3 mb-6"
        >
          <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full border border-[#C5A059]/40 flex items-center justify-center bg-[#C5A059]/5 backdrop-blur-md shadow-[0_0_25px_rgba(197,160,89,0.15)] mx-auto">
            <svg
              className="w-6 h-6 sm:w-7 sm:h-7 text-[#C5A059]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
            >
              <path d="M12 2C12 2 7 7 7 12C7 15.5 9.5 18 12 21C14.5 18 17 15.5 17 12C17 7 12 2 12 2Z" />
              <path d="M12 21C7 19 3 15 3 11C3 8 5 6 6 5C6 5 6 10 12 14" />
              <path d="M12 21C17 19 21 15 21 11C21 8 19 6 18 5C18 5 18 10 12 14" />
            </svg>
          </div>
          <span className="text-[10px] sm:text-[11px] font-sans tracking-[0.35em] text-[#C5A059] uppercase block text-center pl-[0.35em]">
            Collection 01 • Origins
          </span>
        </motion.div>

        {/* Big Editorial Logo Title - Optical Centering Applied */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto"
        >
          {/* Tracking compensation pl-[0.25em] ensures true optical & geometrical center */}
          <h1 className="font-serif text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-[#FAF7F2] font-light tracking-[0.25em] pl-[0.25em] uppercase drop-shadow-[0_4px_30px_rgba(0,0,0,0.8)] text-center">
            BINDY<span className="text-[#C5A059]">.</span>
          </h1>
          <p className="mt-4 font-serif italic text-lg sm:text-2xl text-[#DCC7AF]/90 tracking-wide font-light text-center">
            Wear Your Calm, Feel Your Story
          </p>
          <p className="mt-2 text-[11px] sm:text-[12px] font-sans uppercase tracking-[0.4em] pl-[0.4em] text-[#A89F91] text-center">
            Two Islands • One Thread
          </p>
        </motion.div>

        {/* UNRAVELLING GOLDEN THREAD ANIMATION - Symmetrical Centered Box */}
        <div className="w-72 sm:w-96 my-8 flex flex-col items-center justify-center mx-auto">
          <svg
            className="w-full h-10 overflow-visible"
            viewBox="0 0 380 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Background guide line */}
            <path
              d="M 10 15 Q 95 -2, 190 15 T 370 15"
              stroke="rgba(197, 160, 89, 0.15)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            {/* Active Unravelling Silk Thread */}
            <motion.path
              d="M 10 15 Q 95 -2, 190 15 T 370 15"
              stroke="url(#threadGradient)"
              strokeWidth="2.2"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: progress / 100 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
            {/* Thread Gradient */}
            <defs>
              <linearGradient id="threadGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#A46446" />
                <stop offset="50%" stopColor="#C5A059" />
                <stop offset="100%" stopColor="#FAF7F2" />
              </linearGradient>
            </defs>
          </svg>

          {/* Symmetrically balanced status row */}
          <div className="grid grid-cols-3 w-full px-1 text-[10px] sm:text-[11px] font-sans tracking-[0.25em] text-[#DCC7AF]/80 uppercase mt-1">
            <span className="text-left">Weaving</span>
            <span className="text-center text-[#C5A059] font-mono">{progress}%</span>
            <span className="text-right">Heritage</span>
          </div>
        </div>

        {/* ENTER GATE BUTTON */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: isReady ? 1 : 0.6, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center"
        >
          <button
            onClick={handleEnter}
            disabled={!isReady && progress < 30}
            className="group relative px-8 py-3.5 rounded-full border border-[#C5A059]/50 bg-gradient-to-r from-[#C5A059]/10 via-[#FAF7F2]/5 to-[#C5A059]/10 hover:border-[#C5A059] transition-all duration-500 backdrop-blur-md shadow-[0_4px_30px_rgba(197,160,89,0.2)] hover:shadow-[0_4px_40px_rgba(197,160,89,0.4)] flex items-center space-x-3 cursor-pointer mx-auto"
          >
            <span className="text-xs uppercase font-sans tracking-[0.35em] pl-[0.35em] text-[#FAF7F2] group-hover:text-[#C5A059] transition-colors duration-300">
              {isReady ? "Unveil Experience" : "Unravelling Thread..."}
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-[#C5A059] group-hover:translate-x-1.5 transition-transform duration-300" />
          </button>
        </motion.div>

        {/* Footer Credit & Origin - Symmetrically Centered */}
        <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center space-x-4 text-[10px] uppercase font-sans tracking-[0.3em] pl-[0.3em] text-[#8C8477]">
          <span>Designed in Australia</span>
          <span className="text-[#C5A059]">•</span>
          <span>Inspired by Sri Lanka</span>
        </div>
      </div>
    </div>
  );
}
