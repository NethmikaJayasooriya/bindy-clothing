"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Compass, ArrowRight, Sparkles, MoveRight, Eye } from "lucide-react";

interface HeroProps {
  onExploreCollection?: () => void;
  onSelectStory?: (storyId: string) => void;
}

export default function CinematicHero({
  onExploreCollection,
  onSelectStory,
}: HeroProps) {
  const [activeVideo, setActiveVideo] = useState<0 | 1>(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTimeFormatted, setCurrentTimeFormatted] = useState("00:00");
  const [totalProgress, setTotalProgress] = useState(0);

  const video0Ref = useRef<HTMLVideoElement>(null);
  const video1Ref = useRef<HTMLVideoElement>(null);

  const videoClips = [
    { id: 0, src: "/media/scene-scenery.mp4" },
    { id: 1, src: "/media/scene-walking.mp4" },
  ];

  // Seamless continuous loop
  useEffect(() => {
    const v0 = video0Ref.current;
    const v1 = video1Ref.current;
    if (!v0 || !v1) return;

    const handleTimeUpdate0 = () => {
      if (activeVideo === 0 && v0.duration) {
        const progress = (v0.currentTime / v0.duration) * 50;
        setTotalProgress(progress);
        const secs = Math.floor(v0.currentTime % 60);
        setCurrentTimeFormatted(`00:${secs < 10 ? "0" + secs : secs}`);

        if (v0.currentTime >= v0.duration - 0.6) {
          v1.currentTime = 0;
          v1.play().catch(() => {});
          setActiveVideo(1);
        }
      }
    };

    const handleTimeUpdate1 = () => {
      if (activeVideo === 1 && v1.duration) {
        const progress = 50 + (v1.currentTime / v1.duration) * 50;
        setTotalProgress(progress);
        const secs = Math.floor(v1.currentTime % 60) + 8;
        setCurrentTimeFormatted(`00:${secs < 10 ? "0" + secs : secs}`);

        if (v1.currentTime >= v1.duration - 0.6) {
          v0.currentTime = 0;
          v0.play().catch(() => {});
          setActiveVideo(0);
        }
      }
    };

    v0.addEventListener("timeupdate", handleTimeUpdate0);
    v1.addEventListener("timeupdate", handleTimeUpdate1);

    return () => {
      v0.removeEventListener("timeupdate", handleTimeUpdate0);
      v1.removeEventListener("timeupdate", handleTimeUpdate1);
    };
  }, [activeVideo]);

  const togglePlay = () => {
    const v0 = video0Ref.current;
    const v1 = video1Ref.current;
    if (isPlaying) {
      v0?.pause();
      v1?.pause();
      setIsPlaying(false);
    } else {
      if (activeVideo === 0) v0?.play();
      else v1?.play();
      setIsPlaying(true);
    }
  };

  const featuredPieces = [
    {
      id: "lotus-memory",
      title: "Lotus Memory Dress",
      fabric: "Pure Cotton Voile",
      color: "Lotus Pink",
      price: "$240 AUD",
      image: "/images/serendipity/lotus-memory-dress.jpg",
    },
    {
      id: "cinnamon-flow",
      title: "Cinnamon Flow Skirt",
      fabric: "Recycled Silk Blend",
      color: "Cinnamon Satin",
      price: "$195 AUD",
      image: "/images/serendipity/cinnamon-flow-skirt.jpg",
    },
    {
      id: "pettah-check",
      title: "Pettah Discovery Set",
      fabric: "Handloom Gingham",
      color: "Crimson Check",
      price: "$220 AUD",
      image: "/images/serendipity/pettah-check-dress.jpg",
    },
  ];

  return (
    <section className="relative w-full h-screen min-h-[720px] overflow-hidden bg-black flex items-center justify-center select-none">
      {/* 1. SEAMLESS DUAL-VIDEO BACKGROUND LAYERS - ADJUSTED POSITION FOR HEADROOM */}
      <video
        ref={video0Ref}
        src={videoClips[0].src}
        autoPlay
        muted
        playsInline
        preload="auto"
        className={`absolute inset-0 w-full h-full object-cover object-[center_8%] sm:object-[center_6%] transition-opacity duration-1200 ease-in-out ${
          activeVideo === 0 ? "opacity-100 scale-100 z-0" : "opacity-0 scale-105 pointer-events-none"
        }`}
      />

      <video
        ref={video1Ref}
        src={videoClips[1].src}
        muted
        playsInline
        preload="auto"
        className={`absolute inset-0 w-full h-full object-cover object-[center_8%] sm:object-[center_6%] transition-opacity duration-1200 ease-in-out ${
          activeVideo === 1 ? "opacity-100 scale-100 z-0" : "opacity-0 scale-105 pointer-events-none"
        }`}
      />

      {/* 2. HIGH-CONTRAST EDITORIAL GRADIENT SCRIMS (Ensures ALL text is 100% crystal clear in all scenes) */}
      {/* Left-focused cinematic dark wash dedicated to text contrast */}
      <div className="absolute inset-y-0 left-0 w-full md:w-[65%] lg:w-[55%] bg-gradient-to-r from-black/90 via-black/60 to-transparent pointer-events-none z-10" />

      {/* Top and bottom subtle vignettes */}
      <div className="absolute top-0 inset-x-0 h-44 bg-gradient-to-b from-black/70 via-black/30 to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none z-10" />

      {/* Ambient subtle warm golden glow */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-[radial-gradient(circle,rgba(197,160,89,0.18)_0%,transparent_70%)] blur-3xl pointer-events-none z-10" />

      {/* 3. MAIN CINEMATIC EDITORIAL CONTENT */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-between pt-28 pb-10">
        
        {/* Top Header Tags */}
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center space-x-3"
          >
            <div className="px-3.5 py-1.5 rounded-full bg-black/65 backdrop-blur-xl border border-white/20 text-[10px] sm:text-[11px] font-sans uppercase tracking-[0.3em] text-[#C5A059] shadow-lg flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse" />
              <span>Collection 01 • Origins</span>
            </div>
            <span className="hidden md:inline-block text-[11px] font-sans tracking-[0.25em] uppercase text-white/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] font-medium">
              Two Islands • One Thread
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden sm:flex items-center space-x-2 text-[10px] font-sans tracking-[0.25em] text-white/90 uppercase backdrop-blur-xl px-3.5 py-1.5 rounded-full bg-black/65 border border-white/20 shadow-lg"
          >
            <span>Brisbane</span>
            <span className="text-[#C5A059]">•</span>
            <span>Colombo</span>
          </motion.div>
        </div>

        {/* Center Editorial Headlines & Story Block */}
        <div className="my-auto max-w-xl lg:max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.3 }}
            className="space-y-4 text-left"
          >
            {/* Tagline Badge */}
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-[#C5A059]/50 shadow-md">
              <Sparkles className="w-3 h-3 text-[#C5A059]" />
              <span className="text-[10px] uppercase font-sans tracking-[0.3em] text-[#FAF7F2] font-medium">
                Woven for the Australian Wardrobe
              </span>
            </div>

            {/* Master Headline with Multi-Layer Text Shadow */}
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] text-[#FFFFFF] font-normal tracking-[0.03em] leading-[1.05] drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)] [text-shadow:0_3px_15px_rgba(0,0,0,0.9)]">
              Wear Your Calm,
              <br />
              <span className="italic font-light text-[#E5D7C5] font-serif">
                Feel Your Story.
              </span>
            </h1>

            {/* Philosophy Description with High Legibility */}
            <p className="font-serif italic text-base sm:text-xl text-[#F2ECE1] max-w-lg font-light tracking-wide leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
              Thoughtfully designed silhouettes blending everyday ease, artistic spirit, and authentic Sri Lankan craftsmanship.
            </p>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <a
                href="#collection"
                onClick={onExploreCollection}
                className="group px-8 py-4 rounded-full bg-[#C5A059] hover:bg-[#FAF7F2] text-black font-sans text-xs uppercase tracking-[0.25em] font-semibold transition-all duration-400 flex items-center space-x-3 shadow-[0_6px_30px_rgba(197,160,89,0.4)] hover:shadow-[0_8px_35px_rgba(255,255,255,0.5)] cursor-pointer hover:scale-[1.03]"
              >
                <span>Discover Collection</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
              </a>

              <a
                href="#stories"
                className="px-7 py-4 rounded-full border border-white/30 hover:border-[#C5A059] bg-black/60 hover:bg-black/80 backdrop-blur-xl text-white font-sans text-xs uppercase tracking-[0.25em] transition-all duration-300 flex items-center space-x-2.5 shadow-lg hover:scale-[1.03]"
              >
                <Compass className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Heritage Stories</span>
              </a>
            </div>
          </motion.div>
        </div>

        {/* 4. BOTTOM BAR: FLOATING CINEMA CONTROLS & GARMENT SPOTLIGHT */}
        <div className="flex flex-col md:flex-row items-end justify-between gap-4">
          
          {/* Left: Floating Playback Capsule */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex items-center space-x-3.5 bg-black/70 backdrop-blur-2xl px-4 py-2.5 rounded-full border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.5)] w-full sm:w-auto"
          >
            <button
              onClick={togglePlay}
              className="w-8 h-8 rounded-full bg-[#C5A059] text-black flex items-center justify-center hover:bg-white transition-all shadow-md"
              title={isPlaying ? "Pause Video" : "Play Video"}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
            </button>

            <div className="flex flex-col flex-1 sm:w-48">
              <div className="flex justify-between text-[9px] font-sans tracking-[0.2em] text-white/90 uppercase mb-1">
                <span>Fashion Film</span>
                <span className="font-mono text-[#C5A059] font-medium">{currentTimeFormatted}</span>
              </div>
              <div className="w-full bg-white/20 h-1 rounded-full overflow-hidden">
                <div
                  className="bg-[#C5A059] h-full transition-all duration-200 ease-linear rounded-full"
                  style={{ width: `${totalProgress}%` }}
                />
              </div>
            </div>
          </motion.div>

          {/* Right: Spotlight Garment Previews */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="hidden lg:flex items-center space-x-2.5 bg-black/70 backdrop-blur-2xl p-2 pr-3 rounded-2xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
          >
            <div className="px-2.5 text-[9px] font-sans uppercase tracking-[0.25em] text-[#C5A059] flex items-center space-x-1.5 border-r border-white/15 pr-3">
              <Sparkles className="w-3 h-3" />
              <span>Spotlight</span>
            </div>

            <div className="flex space-x-2">
              {featuredPieces.map((piece) => (
                <div
                  key={piece.id}
                  onClick={() => onSelectStory?.(piece.id)}
                  className="group flex items-center space-x-2.5 bg-white/5 hover:bg-white/15 px-2.5 py-1.5 rounded-xl cursor-pointer transition-all duration-300 border border-white/10 hover:border-[#C5A059]/60 hover:scale-[1.03]"
                >
                  <img
                    src={piece.image}
                    alt={piece.title}
                    className="w-8 h-10 object-cover rounded-lg shadow-sm"
                  />
                  <div className="text-left pr-1">
                    <p className="text-[11px] font-serif text-white group-hover:text-[#C5A059] transition-colors leading-tight font-medium">
                      {piece.title}
                    </p>
                    <p className="text-[9px] font-sans text-white/70 tracking-wider">
                      {piece.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
